<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const router = useRouter()

// Data state
const dailyLogs = ref([])
const loading = ref(true)
const successMessage = ref('')

// UI state
const showDeleteModal = ref(false)
const logToDelete = ref(null)

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
    dailyLogs.value = data
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
    const { error } = await supabase.from('truck_logs').delete().eq('id', logToDelete.value)

    if (error) throw error

    successMessage.value = 'Log deleted successfully'
    setTimeout(() => (successMessage.value = ''), 3000)
    fetchLogs() // Refresh the list
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
      log.truck_type?.toLowerCase().includes(query),
  )
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / perPage))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredLogs.value.slice(start, start + perPage)
})

// Formatting functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  return timeString.substring(0, 5) // HH:MM format
}

// Navigation
const goToShow = (id) => {
  router.push({ name: 'show-log', params: { id } })
}

const goToEdit = (id) => {
  router.push({ name: 'edit-log', params: { id } })
}

const confirmDelete = (id) => {
  logToDelete.value = id
  showDeleteModal.value = true
}

// Pagination controls
const goToPage = (page) => {
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
  <head>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      rel="stylesheet"
    />
  </head>
  <div class="container mx-auto px-4 py-8">
    <div class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Daily Logs Management</h1>
          <p class="text-sm text-gray-500 mt-1">Total {{ filteredLogs.length }} logs found</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Search Input -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search logs..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
            <div class="absolute left-3 top-2.5 text-gray-400">
              <i class="fas fa-search"></i>
            </div>
          </div>

          <!-- Add New Button -->
          <router-link
            :to="{ name: 'create-log' }"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
          >
            <i class="fas fa-plus"></i>
            <span>Add New</span>
          </router-link>
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
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredLogs.length === 0"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
      >
        <i class="fas fa-clipboard-list text-4xl text-gray-300 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-700">No logs found</h3>
        <p class="text-gray-500 mt-1">Create your first daily log to get started</p>
        <router-link
          to="/logs/create"
          class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-plus mr-2"></i> Add New Log
        </router-link>
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
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
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
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="goToShow(log.id)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      @click="goToEdit(log.id)"
                      class="text-indigo-600 hover:text-indigo-900 transition-colors"
                      title="Edit"
                    >
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      @click="confirmDelete(log.id)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
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
                <button
                  v-for="page in 5"
                  :key="page"
                  @click="goToPage(page)"
                  :class="{
                    'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page,
                    'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': currentPage !== page,
                  }"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {{ page }}
                </button>
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

    <!-- Delete Confirmation Modal -->
    <transition name="modal">
      <div v-if="showDeleteModal" class="fixed z-50 inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="false"
            >&#8203;</span
          >
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <i class="fas fa-exclamation-triangle text-red-600"></i>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Log</h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete this log? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="deleteLog"
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                @click="showDeleteModal = false"
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
