<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const router = useRouter()

// Form data
const form = ref({
  date: '',
  time: '',
  driver_name: '',
  driver_otp: '',
  driver_license: '',
  plate_number: '',
  lto_cr: '',
  lto_or: '',
  truck_type: '',
  commodity_carried: '',
  commodity_type: '',
  origin: '',
  destination: '',
  first_axle: 0,
  second_axle: 0,
  third_axle: 0,
  fourth_axle: 0,
  fifth_axle: 0,
  sixth_axle: 0,
  seventh_axle: 0,
  eighth_axle: 0,
  total_weight: 0,
  allowable_gvw: 0,
  excess_load: 0,
  excess_gvw: 0,
  overloaded_axles: 0,
  overloaded: '',
  apprehended: '',
})

const errors = ref([])
const isLoading = ref(false)
const userProfile = ref(null)
const logId = ref(null)

// GVW mapping based on truck type
const gvwMapping = {
  '1-1': 15000,
  '1-2': 25000,
  '1-3': 35000,
  '11-1': 30000,
  '11-2': 40000,
  '11-3': 50000,
  '12-1': 35000,
  '12-2': 45000,
  '12-3': 55000,
  '11-11': 45000,
  '11-12': 55000,
  '12-11': 50000,
  '12-12': 60000,
}

// Initialize form with existing log data
onMounted(async () => {
  logId.value = route.params.id
  await loadUserProfile()
  await fetchLogData()
})

// Load user profile data
const loadUserProfile = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    userProfile.value = profile
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

// Fetch existing log data
const fetchLogData = async () => {
  try {
    isLoading.value = true
    const { data, error } = await supabase
      .from('truck_logs')
      .select('*')
      .eq('id', logId.value)
      .single()

    if (error) throw error
    if (!data) throw new Error('Log not found')

    // Map the fetched data to our form
    Object.keys(form.value).forEach(key => {
      if (data[key] !== undefined) {
        form.value[key] = data[key]
      }
    })

  } catch (error) {
    console.error('Error fetching log:', error)
    errors.value.push({
      field: 'general',
      message: error.message || 'Failed to load log data'
    })
  } finally {
    isLoading.value = false
  }
}

const updateGVW = () => {
  form.value.allowable_gvw = gvwMapping[form.value.truck_type] || 0
  calculateExcessLoad()
}

const calculateTotalWeight = () => {
  const axleWeights = [
    parseFloat(form.value.first_axle) || 0,
    parseFloat(form.value.second_axle) || 0,
    parseFloat(form.value.third_axle) || 0,
    parseFloat(form.value.fourth_axle) || 0,
    parseFloat(form.value.fifth_axle) || 0,
    parseFloat(form.value.sixth_axle) || 0,
    parseFloat(form.value.seventh_axle) || 0,
    parseFloat(form.value.eighth_axle) || 0,
  ]

  form.value.total_weight = axleWeights.reduce((sum, weight) => sum + weight, 0)
  calculateExcessLoad()
}

const calculateExcessLoad = () => {
  const axleWeights = [
    parseFloat(form.value.first_axle) || 0,
    parseFloat(form.value.second_axle) || 0,
    parseFloat(form.value.third_axle) || 0,
    parseFloat(form.value.fourth_axle) || 0,
    parseFloat(form.value.fifth_axle) || 0,
    parseFloat(form.value.sixth_axle) || 0,
    parseFloat(form.value.seventh_axle) || 0,
    parseFloat(form.value.eighth_axle) || 0,
  ]

  const excessPerAxle = axleWeights.reduce((sum, weight) => {
    return sum + (weight > 13500 ? weight - 13500 : 0)
  }, 0)

  form.value.excess_load = excessPerAxle > 0 ? excessPerAxle : 0

  const allowableGVW = parseFloat(form.value.allowable_gvw) || 0
  const totalWeight = parseFloat(form.value.total_weight) || 0
  const excessGVW = totalWeight > allowableGVW ? totalWeight - allowableGVW : 0

  form.value.excess_gvw = excessGVW > 0 ? excessGVW : 0
  form.value.overloaded_axles = axleWeights.filter((weight) => weight > 13500).length

  if (form.value.excess_load > 0 && form.value.excess_gvw > 0) {
    form.value.overloaded = 'both'
  } else if (form.value.excess_gvw > 0) {
    form.value.overloaded = 'gvw-only'
  } else if (form.value.excess_load > 0) {
    form.value.overloaded = 'axle-only'
  } else {
    form.value.overloaded = ''
  }
}

const validateForm = () => {
  errors.value = []
  let isValid = true

  const requiredFields = [
    'date',
    'driver_name',
    'driver_license',
    'plate_number',
    'truck_type',
    'commodity_carried',
    'origin',
    'destination',
  ]

  requiredFields.forEach((field) => {
    if (!form.value[field]) {
      errors.value.push({
        field,
        message: `${field.replace('_', ' ')} is required`,
      })
      isValid = false
    }
  })

  if (form.value.total_weight <= 0) {
    errors.value.push({
      field: 'total_weight',
      message: 'Total weight must be greater than 0',
    })
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    // Verify authentication and get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Authentication required')

    // Prepare update data
    const updateData = {
      ...form.value,
      // Convert numeric fields
      first_axle: Number(form.value.first_axle),
      second_axle: Number(form.value.second_axle),
      third_axle: Number(form.value.third_axle),
      fourth_axle: Number(form.value.fourth_axle),
      fifth_axle: Number(form.value.fifth_axle),
      sixth_axle: Number(form.value.sixth_axle),
      seventh_axle: Number(form.value.seventh_axle),
      eighth_axle: Number(form.value.eighth_axle),
      total_weight: Number(form.value.total_weight),
      allowable_gvw: Number(form.value.allowable_gvw),
      excess_load: Number(form.value.excess_load),
      excess_gvw: Number(form.value.excess_gvw),
      overloaded_axles: Number(form.value.overloaded_axles),
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    }

    // Update the truck_log
    const { data, error } = await supabase
      .from('truck_logs')
      .update(updateData)
      .eq('id', logId.value)
      .select()

    if (error) throw error

    // Success - redirect to logs view
    router.push({ name: 'logs' })
  } catch (error) {
    console.error('Update error:', error)
    errors.value.push({
      field: 'general',
      message: error.message || 'Failed to update log. Please try again.',
    })
  } finally {
    isLoading.value = false
  }
}

const hasError = (field) => errors.value.some((e) => e.field === field)
const getError = (field) => errors.value.find((e) => e.field === field)?.message || ''
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="flex flex-wrap justify-between items-center mb-6">
      <div class="w-full md:w-auto mb-4 md:mb-0">
        <h2 class="text-2xl font-bold">Edit Log</h2>
        <p class="text-sm text-gray-500">Editing log ID: {{ logId }}</p>
      </div>
      <div class="w-full md:w-auto">
        <router-link
          :to="{ name: 'logs' }"
          class="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i> Back
        </router-link>
      </div>
    </div>

    <!-- Error Messages -->
    <div
      v-if="errors.length > 0"
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
    >
      <div class="font-bold">Whoops!</div>
      <p>There were some problems with your input.</p>
      <ul class="list-disc pl-5 mt-2">
        <li v-for="(error, index) in errors" :key="index">{{ error.message }}</li>
      </ul>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Truck Data Information (Left) -->
        <section class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Truck Data Information</h2>

          <div class="space-y-4">
            <!-- Date -->
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date:</label>
              <input
                type="date"
                id="date"
                v-model="form.date"
                required
                :class="{ 'border-red-500': hasError('date') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('date')" class="mt-1 text-sm text-red-600">
                {{ getError('date') }}
              </p>
            </div>

            <!-- Time -->
            <div>
              <label for="time" class="block text-sm font-medium text-gray-700 mb-1"
                >Time (HH:MM AM/PM):</label
              >
              <input
                type="time"
                id="time"
                v-model="form.time"
                required
                :class="{ 'border-red-500': hasError('time') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('time')" class="mt-1 text-sm text-red-600">
                {{ getError('time') }}
              </p>
            </div>

            <!-- Driver Name -->
            <div>
              <label for="driver_name" class="block text-sm font-medium text-gray-700 mb-1"
                >Driver Name:</label
              >
              <input
                type="text"
                id="driver_name"
                v-model="form.driver_name"
                required
                :class="{ 'border-red-500': hasError('driver_name') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('driver_name')" class="mt-1 text-sm text-red-600">
                {{ getError('driver_name') }}
              </p>
            </div>

            <!-- Driver OTP -->
            <div>
              <label for="driver_otp" class="block text-sm font-medium text-gray-700 mb-1"
                >TOP (Temporary Operator's Permit):</label
              >
              <input
                type="text"
                id="driver_otp"
                v-model="form.driver_otp"
                :class="{ 'border-red-500': hasError('driver_otp') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('driver_otp')" class="mt-1 text-sm text-red-600">
                {{ getError('driver_otp') }}
              </p>
            </div>

            <!-- Driver License -->
            <div>
              <label for="driver_license" class="block text-sm font-medium text-gray-700 mb-1"
                >Driver's License:</label
              >
              <input
                type="text"
                id="driver_license"
                v-model="form.driver_license"
                required
                :class="{ 'border-red-500': hasError('driver_license') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('driver_license')" class="mt-1 text-sm text-red-600">
                {{ getError('driver_license') }}
              </p>
            </div>

            <!-- Plate Number -->
            <div>
              <label for="plate_number" class="block text-sm font-medium text-gray-700 mb-1"
                >Plate Number (Tractor Head & Trailer):</label
              >
              <input
                type="text"
                id="plate_number"
                v-model="form.plate_number"
                required
                :class="{ 'border-red-500': hasError('plate_number') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('plate_number')" class="mt-1 text-sm text-red-600">
                {{ getError('plate_number') }}
              </p>
            </div>

            <!-- LTO CR -->
            <div>
              <label for="lto_cr" class="block text-sm font-medium text-gray-700 mb-1"
                >LTO CR No.:</label
              >
              <input
                type="text"
                id="lto_cr"
                v-model="form.lto_cr"
                :class="{ 'border-red-500': hasError('lto_cr') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('lto_cr')" class="mt-1 text-sm text-red-600">
                {{ getError('lto_cr') }}
              </p>
            </div>

            <!-- LTO OR Date -->
            <div>
              <label for="lto_or" class="block text-sm font-medium text-gray-700 mb-1"
                >LTO OR Date:</label
              >
              <input
                type="date"
                id="lto_or"
                v-model="form.lto_or"
                :class="{ 'border-red-500': hasError('lto_or') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('lto_or')" class="mt-1 text-sm text-red-600">
                {{ getError('lto_or') }}
              </p>
            </div>

            <!-- Truck Type -->
            <div>
              <label for="truck_type" class="block text-sm font-medium text-gray-700 mb-1"
                >Truck/Trailer Type:</label
              >
              <select
                id="truck_type"
                v-model="form.truck_type"
                required
                @change="updateGVW"
                :class="{ 'border-red-500': hasError('truck_type') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select</option>
                <option value="1-1">1-1 (6 wheels)</option>
                <option value="1-2">1-2 (10 wheels)</option>
                <option value="1-3">1-3 (14 wheels)</option>
                <option value="11-1">11-1 (10 wheels)</option>
                <option value="11-2">11-2 (14 wheels)</option>
                <option value="11-3">11-3 (18 wheels)</option>
                <option value="12-1">12-1 (14 wheels)</option>
                <option value="12-2">12-2 (18 wheels)</option>
                <option value="12-3">12-3 (22 wheels)</option>
                <option value="11-11">11-11 (14 wheels)</option>
                <option value="11-12">11-12 (18 wheels)</option>
                <option value="12-11">12-11 (18 wheels)</option>
                <option value="12-12">12-12 (22 wheels)</option>
              </select>
              <p v-if="hasError('truck_type')" class="mt-1 text-sm text-red-600">
                {{ getError('truck_type') }}
              </p>
            </div>

            <!-- Commodity Carried -->
            <div>
              <label for="commodity_carried" class="block text-sm font-medium text-gray-700 mb-1"
                >Commodity Carried:</label
              >
              <input
                type="text"
                id="commodity_carried"
                v-model="form.commodity_carried"
                required
                :class="{ 'border-red-500': hasError('commodity_carried') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('commodity_carried')" class="mt-1 text-sm text-red-600">
                {{ getError('commodity_carried') }}
              </p>
            </div>

            <!-- Commodity Type -->
            <div>
              <label for="commodity_type" class="block text-sm font-medium text-gray-700 mb-1"
                >Commodity Type:</label
              >
              <input
                type="text"
                id="commodity_type"
                v-model="form.commodity_type"
                :class="{ 'border-red-500': hasError('commodity_type') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('commodity_type')" class="mt-1 text-sm text-red-600">
                {{ getError('commodity_type') }}
              </p>
            </div>

            <!-- Origin -->
            <div>
              <label for="origin" class="block text-sm font-medium text-gray-700 mb-1"
                >Origin:</label
              >
              <input
                type="text"
                id="origin"
                v-model="form.origin"
                required
                :class="{ 'border-red-500': hasError('origin') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('origin')" class="mt-1 text-sm text-red-600">
                {{ getError('origin') }}
              </p>
            </div>

            <!-- Destination -->
            <div>
              <label for="destination" class="block text-sm font-medium text-gray-700 mb-1"
                >Destination:</label
              >
              <input
                type="text"
                id="destination"
                v-model="form.destination"
                required
                :class="{ 'border-red-500': hasError('destination') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('destination')" class="mt-1 text-sm text-red-600">
                {{ getError('destination') }}
              </p>
            </div>
          </div>
        </section>

        <!-- Weighing Data (Right) -->
        <section class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4 pb-2 border-b">Weighing Data</h2>

          <div class="space-y-4">
            <!-- Axle Weights -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Weight per Axle (kgs) - Standard Weight per Axle (13500 kgs):</label
              >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="number"
                  v-model="form.first_axle"
                  placeholder="1st Axle"
                  @input="calculateTotalWeight"
                  class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  v-model="form.second_axle"
                  placeholder="2nd Axle"
                  @input="calculateTotalWeight"
                  class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  v-model="form.third_axle"
                  placeholder="3rd Axle"
                  @input="calculateTotalWeight"
                  class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  v-model="form.fourth_axle"
                  placeholder="4th Axle"
                  @input="calculateTotalWeight"
                  class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  v-model="form.fifth_axle"
                  placeholder="5th Axle"
                  @input="calculateTotalWeight"
                  class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  v-model="form.sixth_axle"
                  placeholder="6th Axle"
                  @input="calculateTotalWeight"
                  class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  v-model="form.seventh_axle"
                  placeholder="7th Axle"
                  @input="calculateTotalWeight"
                  class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  v-model="form.eighth_axle"
                  placeholder="8th Axle"
                  @input="calculateTotalWeight"
                  class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Total Weight -->
            <div>
              <label for="total_weight" class="block text-sm font-medium text-gray-700 mb-1"
                >Total Weight (kgs):</label
              >
              <input
                type="number"
                id="total_weight"
                v-model="form.total_weight"
                readonly
                class="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            <!-- Allowable GVW -->
            <div>
              <label for="allowable_gvw" class="block text-sm font-medium text-gray-700 mb-1"
                >Allowable GVW (kgs):</label
              >
              <input
                type="text"
                id="allowable_gvw"
                v-model="form.allowable_gvw"
                readonly
                class="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            <!-- Excess Load per Axle -->
            <div>
              <label for="excess_load" class="block text-sm font-medium text-gray-700 mb-1"
                >Excess Load per Axle (kgs):</label
              >
              <input
                type="text"
                id="excess_load"
                v-model="form.excess_load"
                readonly
                class="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            <!-- Excess Load per GVW -->
            <div>
              <label for="excess_gvw" class="block text-sm font-medium text-gray-700 mb-1"
                >Excess Load per GVW (kgs):</label
              >
              <input
                type="text"
                id="excess_gvw"
                v-model="form.excess_gvw"
                readonly
                class="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            <!-- Number of Overloaded Axles -->
            <div>
              <label for="overloaded_axles" class="block text-sm font-medium text-gray-700 mb-1"
                >Number of Overloaded Axles:</label
              >
              <input
                type="number"
                id="overloaded_axles"
                v-model="form.overloaded_axles"
                :class="{ 'border-red-500': hasError('overloaded_axles') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="hasError('overloaded_axles')" class="mt-1 text-sm text-red-600">
                {{ getError('overloaded_axles') }}
              </p>
            </div>

            <!-- Overloaded -->
            <div>
              <label for="overloaded" class="block text-sm font-medium text-gray-700 mb-1"
                >Overloaded:</label
              >
              <select
                id="overloaded"
                v-model="form.overloaded"
                :class="{ 'border-red-500': hasError('overloaded') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select</option>
                <option value="both">Both (GVW & Axle)</option>
                <option value="gvw-only">GVW Only</option>
                <option value="axle-only">Axle Only</option>
              </select>
              <p v-if="hasError('overloaded')" class="mt-1 text-sm text-red-600">
                {{ getError('overloaded') }}
              </p>
            </div>

            <!-- Apprehended -->
            <div>
              <label for="apprehended" class="block text-sm font-medium text-gray-700 mb-1"
                >Apprehended:</label
              >
              <select
                id="apprehended"
                v-model="form.apprehended"
                required
                :class="{ 'border-red-500': hasError('apprehended') }"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <p v-if="hasError('apprehended')" class="mt-1 text-sm text-red-600">
                {{ getError('apprehended') }}
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          type="submit"
          class="inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="mr-2">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          <span v-else class="mr-2">
            <i class="fas fa-save"></i>
          </span>
          Update Log
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>