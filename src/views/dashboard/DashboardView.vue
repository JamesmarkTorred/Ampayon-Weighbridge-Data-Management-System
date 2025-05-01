<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'

interface Log {
  id: string
  created_at: string
  date: string
  time: string
  driver_name: string
  driver_license: string
  plate_number: string
  truck_type: string
  total_weight: number
  excess_gvw: number
  apprehended: 'yes' | 'no'
}

const router = useRouter()

// Data state
const dailyLogs = ref<Log[]>([])
const loading = ref(true)
const successMessage = ref('')

// UI state
const showDeleteModal = ref(false)
const logToDelete = ref<string | null>(null)

// Search and filter
const searchQuery = ref('')
const sortField = ref('created_at')
const sortDirection = ref('desc')

// Pagination
const perPage = 10
const currentPage = ref(1)

// Fetch logs from Supabase
const fetchLogs = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('truck_logs')
      .select('*')
      .order(sortField.value, { ascending: sortDirection.value === 'asc' })

    if (error) throw error
    dailyLogs.value = data as Log[]
  } catch (error) {
    console.error('Error fetching logs:', error)
  } finally {
    loading.value = false
  }
}

// Delete log from Supabase
const deleteLog = async () => {
  if (!logToDelete.value) return

  try {
    const { error } = await supabase
      .from('truck_logs')
      .delete()
      .eq('id', logToDelete.value)

    if (error) throw error

    successMessage.value = 'Log deleted successfully'
    setTimeout(() => (successMessage.value = ''), 3000)
    fetchLogs()
  } catch (error) {
    console.error('Error deleting log:', error)
  } finally {
    showDeleteModal.value = false
    logToDelete.value = null
  }
}

// Computed properties
const filteredLogs = computed(() => {
  if (!searchQuery.value) return dailyLogs.value

  const query = searchQuery.value.toLowerCase()
  return dailyLogs.value.filter(
    (log) =>
      log.driver_name?.toLowerCase().includes(query) ||
      log.plate_number?.toLowerCase().includes(query) ||
      log.truck_type?.toLowerCase().includes(query)
  )
})

const totalPages = computed(() => 
  Math.max(Math.ceil(filteredLogs.value.length / perPage), 1)
)

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredLogs.value.slice(start, start + perPage)
})

const visiblePages = computed(() => {
  const range = 2
  const start = Math.max(1, currentPage.value - range)
  const end = Math.min(totalPages.value, currentPage.value + range)
  
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  if (start > 1) pages.unshift(1)
  if (end < totalPages.value) pages.push(totalPages.value)
  
  return pages
})

// Formatting functions
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (timeString: string) => {
  if (!timeString) return ''
  return timeString.substring(0, 5)
}

// Navigation
const goToShow = (id: string) => {
  router.push({ name: 'show-log', params: { id } })
}

const goToEdit = (id: string) => {
  router.push({ name: 'edit-log', params: { id } })
}

const confirmDelete = (id: string) => {
  logToDelete.value = id
  showDeleteModal.value = true
}

// Pagination controls
const goToPage = (page: number) => {
  currentPage.value = page
}

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Initialize
onMounted(() => {
  fetchLogs()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p class="text-sm text-gray-500 mt-1">Total {{ filteredLogs.length }} logs found</p>
        </div>
      </div>

      <!-- Success Message -->
      <transition name="fade">
        <div v-if="successMessage" class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div class="flex items-center">
            <div class="flex-shrink-0 text-green-500">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">{{ successMessage }}</p>
            </div>
          </div>
        </div>
      </transition>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredLogs.length === 0"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
      >
        <i class="fas fa-clipboard-list text-4xl text-gray-300 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-700">No logs found</h3>
      </div>

      <!-- Logs Table -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date/Time
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Driver
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vehicle
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Weight (kg)
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="log in paginatedLogs"
                :key="log.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ formatDate(log.date) }}</div>
                  <div class="text-sm text-gray-500">{{ formatTime(log.time) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ log.driver_name }}</div>
                  <div class="text-sm text-gray-500">{{ log.driver_license }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ log.plate_number }}</div>
                  <div class="text-sm text-gray-500">{{ log.truck_type }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ log.total_weight }} kg</div>
                  <div v-if="log.excess_gvw > 0" class="text-sm text-red-600">
                    (+{{ log.excess_gvw }} kg excess)
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': log.apprehended === 'no',
                      'bg-red-100 text-red-800': log.apprehended === 'yes',
                    }"
                  >
                    {{ log.apprehended === 'yes' ? 'Apprehended' : 'Compliant' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> to
                <span class="font-medium">{{
                  Math.min(currentPage * perPage, filteredLogs.length)
                }}</span>
                of <span class="font-medium">{{ filteredLogs.length }}</span> results
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <i class="fas fa-chevron-left"></i>
                </button>
                
                <template v-for="(page, index) in visiblePages" :key="page">
                  <span
                    v-if="index > 0 && page - visiblePages[index-1] > 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                  <button
                    @click="goToPage(page)"
                    :aria-current="currentPage === page ? 'page' : undefined"
                    :class="{
                      'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page,
                      'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': currentPage !== page,
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
                  <i class="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>