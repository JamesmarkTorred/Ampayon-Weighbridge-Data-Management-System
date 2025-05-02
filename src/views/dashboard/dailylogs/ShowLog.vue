<template>
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
      <h1 class="text-3xl font-bold mb-6 text-center">Log Details</h1>
  
      <div v-if="authLoading" class="text-center text-gray-500">Checking authentication...</div>
      <div v-else-if="!isAuthenticated" class="text-center text-red-600">
        Please <router-link to="/login" class="text-blue-600 underline">login</router-link> to view this log.
      </div>
      <div v-else>
        <div v-if="loading" class="text-center text-gray-500">Loading log details...</div>
        <div v-else-if="error" class="text-center text-red-600">Error: {{ error.message }}</div>
        <div v-else-if="!log.id" class="text-center text-yellow-600">Log not found</div>
        <div v-else class="space-y-4">
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">Date:</span>
            <span>{{ formatDate(log.date) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">Driver:</span>
            <span>{{ log.driver_name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">OTP</span>
            <span>{{log.driver_otp }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">Plate Number:</span>
            <span>{{ log.plate_number }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">Truck Type:</span>
            <span>{{ log.truck_type }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">Commodity:</span>
            <span>{{ log.commodity_carried }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">Origin:</span>
            <span>{{ log.origin }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">Destination:</span>
            <span>{{ log.destination }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">Total Weight:</span>
            <span>{{ log.total_weight }} kg</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">Overload:</span>
            <span :class="log.overloaded ? 'text-red-600 font-bold' : 'text-green-600'">
              {{ log.overloaded ? 'YES' : 'NO' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">Created by:</span>
            <span>{{ log.created_by }} </span>
          </div>
        </div>
  
        <div class="mt-6 text-center">
          <button
            @click="goBack"
            class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Daily Logs
          </button>

        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { supabase } from '@/supabase'
  
  const route = useRoute()
  const router = useRouter()
  
  // Authentication state
  const authLoading = ref(true)
  const isAuthenticated = ref(false)
  const userId = ref(null)
  const userRole = ref(null)
  
  // Log data state
  const log = ref({})
  const loading = ref(true)
  const error = ref(null)
  
  // Check if current user is owner or admin
  const isOwnerOrAdmin = computed(() => {
    return userRole.value === 'admin' || log.value.created_by === userId.value
  })
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }
  
  // Fetch authentication status
  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      isAuthenticated.value = !!user
      userId.value = user?.id || null
  
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        userRole.value = profile?.role || null
      }
    } catch (err) {
      console.error('Auth check error:', err)
    } finally {
      authLoading.value = false
    }
  }
  
  // Fetch single log data
  const fetchLog = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Debug: Check the route params
      console.log('Route params:', route.params)
      
      if (!route.params.id) {
        throw new Error('Log ID is missing from URL')
      }
  
      const { data, error: fetchError } = await supabase
        .from('truck_logs')
        .select('*')
        .eq('id', route.params.id)
        .single()
  
      if (fetchError) throw fetchError
      if (!data) throw new Error('Log not found')
      
      log.value = data
    } catch (err) {
      error.value = {
        message: err.message || 'Failed to load log details',
        details: err.details
      }
      console.error('Error fetching log:', err)
    } finally {
      loading.value = false
    }
  }
  
  
  
  const goBack = () => {
    router.push('/logs')
  }

  
  onMounted(async () => {
    await checkAuth()
    if (isAuthenticated.value) {
      await fetchLog()
    }
  })
  </script>