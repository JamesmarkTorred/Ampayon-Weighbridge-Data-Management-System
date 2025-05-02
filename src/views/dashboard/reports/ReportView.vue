<template>
  <div class="container mx-auto px-4 py-8">
    <div class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Truck Logs Report</h1>
          <p class="text-sm text-gray-500 mt-1">Analyze and export log data</p>
        </div>
        
        <!-- Report Controls -->
        <div class="flex items-center gap-3">
          <!-- Date Range Picker -->
          <div class="flex items-center space-x-2">
            <input
              v-model="dateRange.start"
              type="date"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
            <span>to</span>
            <input
              v-model="dateRange.end"
              type="date"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          
          <!-- Export Button -->
          <button
            @click="exportReport"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
          >
            <i class="fas fa-file-export"></i>
            <span>Export</span>
          </button>
        </div>
      </div>

      <!-- Report Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Driver Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <select
              v-model="filters.driver"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Drivers</option>
              <option v-for="driver in uniqueDrivers" :value="driver">{{ driver }}</option>
            </select>
          </div>
          
          <!-- Truck Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Truck Type</label>
            <select
              v-model="filters.truckType"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option v-for="type in uniqueTruckTypes" :value="type">{{ type }}</option>
            </select>
          </div>
          
          <!-- Weight Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Weight Range (kg)</label>
            <div class="flex items-center space-x-2">
              <input
                v-model="filters.minWeight"
                type="number"
                placeholder="Min"
                class="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <input
                v-model="filters.maxWeight"
                type="number"
                placeholder="Max"
                class="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Total Logs -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Logs</p>
              <p class="text-2xl font-bold text-gray-800">{{ filteredReportData.length }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <i class="fas fa-clipboard-list text-blue-600"></i>
            </div>
          </div>
        </div>
        
        <!-- Total Weight -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Weight</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalWeight }} kg</p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <i class="fas fa-weight text-green-600"></i>
            </div>
          </div>
        </div>
        
        <!-- Excess Weight -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Excess Weight</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalExcessWeight }} kg</p>
            </div>
            <div class="bg-red-100 p-3 rounded-full">
              <i class="fas fa-exclamation-triangle text-red-600"></i>
            </div>
          </div>
        </div>
        
        <!-- Top Driver -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Most Active Driver</p>
              <p class="text-xl font-bold text-gray-800 truncate">{{ topDriver || 'N/A' }}</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <i class="fas fa-user-tie text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Report Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="5" class="px-6 py-4 text-center">
                  <div class="flex justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-else-if="filteredReportData.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  No logs found matching your filters
                </td>
              </tr>
              
              <!-- Data Rows -->
              <tr v-for="log in paginatedReportData" :key="log.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(log.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ log.driver_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ log.plate_number }} ({{ log.truck_type }})
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{'text-red-600': log.excess_gvw > 0}">
                    {{ log.total_weight }} kg
                  </span>
                  <span v-if="log.excess_gvw > 0" class="text-xs text-red-500 ml-1">
                    (+{{ log.excess_gvw }})
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="log.excess_gvw > 0" class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Overweight
                  </span>
                  <span v-else class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Normal
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700 mx-4 my-2">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> to
                <span class="font-medium">{{ Math.min(currentPage * perPage, filteredReportData.length) }}</span>
                of <span class="font-medium">{{ filteredReportData.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <i class="fas fa-chevron-left h-5 w-5"></i>
                </button>
                
                <template v-for="page in visiblePages" :key="page">
                  <button
                    @click="goToPage(page)"
                    :class="{
                      'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page,
                      'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': currentPage !== page
                    }"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    {{ page }}
                  </button>
                </template>
                
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <i class="fas fa-chevron-right h-5 w-5"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '@/supabase'

// Data state
const reportData = ref([])
const loading = ref(true)

// Filter state
const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default: 30 days ago
  end: new Date().toISOString().split('T')[0] // Default: today
})

const filters = ref({
  driver: '',
  truckType: '',
  minWeight: null,
  maxWeight: null
})

// Pagination
const perPage = ref(10)
const currentPage = ref(1)

// Fetch report data
const fetchReportData = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('truck_logs')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    reportData.value = data || []
    console.log('Fetched data:', data) // Debug log
  } catch (error) {
    console.error('Error fetching report data:', error)
  } finally {
    loading.value = false
  }
}

// Computed properties
const filteredReportData = computed(() => {
  let result = [...reportData.value]
  
  // Date range filter
  if (dateRange.value.start && dateRange.value.end) {
    const startDate = new Date(dateRange.value.start)
    const endDate = new Date(dateRange.value.end)
    endDate.setHours(23, 59, 59) // Include entire end day
    
    result = result.filter(log => {
      const logDate = new Date(log.date)
      return logDate >= startDate && logDate <= endDate
    })
  }
  
  // Driver filter
  if (filters.value.driver) {
    result = result.filter(log => log.driver_name === filters.value.driver)
  }
  
  // Truck type filter
  if (filters.value.truckType) {
    result = result.filter(log => log.truck_type === filters.value.truckType)
  }
  
  // Weight filters
  if (filters.value.minWeight) {
    result = result.filter(log => log.total_weight >= filters.value.minWeight)
  }
  
  if (filters.value.maxWeight) {
    result = result.filter(log => log.total_weight <= filters.value.maxWeight)
  }
  
  return result
})

const uniqueDrivers = computed(() => {
  const drivers = [...new Set(reportData.value.map(log => log.driver_name).filter(Boolean))]
  return drivers.sort()
})

const uniqueTruckTypes = computed(() => {
  const types = [...new Set(reportData.value.map(log => log.truck_type).filter(Boolean))]
  return types.sort()
})

const totalWeight = computed(() => {
  return filteredReportData.value.reduce((sum, log) => sum + (log.total_weight || 0), 0)
})

const totalExcessWeight = computed(() => {
  return filteredReportData.value.reduce((sum, log) => sum + (log.excess_gvw || 0), 0)
})

const topDriver = computed(() => {
  const driverCounts = {}
  filteredReportData.value.forEach(log => {
    if (log.driver_name) {
      driverCounts[log.driver_name] = (driverCounts[log.driver_name] || 0) + 1
    }
  })
  return Object.keys(driverCounts).reduce((a, b) => driverCounts[a] > driverCounts[b] ? a : b, null)
})

// Pagination computed properties
const totalPages = computed(() => {
  return Math.ceil(filteredReportData.value.length / perPage.value) || 1
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const paginatedReportData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredReportData.value.slice(start, start + perPage.value)
})

// Navigation methods
const goToPage = (page) => {
  currentPage.value = page
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Export function
const exportReport = () => {
  // This would be implemented based on your export needs
  console.log('Exporting data:', filteredReportData.value)
  alert('Export feature is dili pa available, sorryy huhu labyu, labyutoo mwa mwa')
}

// Formatting functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Watch for filter changes to reset pagination
watch([dateRange, filters], () => {
  currentPage.value = 1
}, { deep: true })

// Initialize
onMounted(() => {
  fetchReportData()
})
</script>

<style scoped>

</style>