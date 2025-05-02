<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">User Profiles</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Browse and manage all user profiles in the system
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="n in 6"
          :key="n"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse"
        >
          <div class="p-6">
            <div class="flex items-center space-x-4">
              <div class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div class="space-y-3 flex-1">
                <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div class="flex gap-2">
                  <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                  <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <div class="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-20"></div>
              <div class="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-20"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      >
        <div class="p-6 flex items-start">
          <div class="flex-shrink-0">
            <svg
              class="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Error loading profiles
            </h3>
            <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <p>{{ error }}</p>
            </div>
            <div class="mt-4">
              <button
                @click="fetchProfiles"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="profiles.length === 0"
        class="max-w-lg mx-auto text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden p-8"
      >
        <svg
          class="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        <h3 class="mt-5 text-xl font-medium text-gray-900 dark:text-white">No profiles found</h3>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          There are currently no user profiles in the system.
        </p>
        <div class="mt-6">
          <button
            @click="fetchProfiles"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Success State -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="profile in profiles"
            :key="profile.id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
          >
            <div class="p-6">
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <div
                    class="w-20 h-20 rounded-full overflow-hidden ring-2 ring-indigo-500 ring-offset-2"
                  >
                    <img
                      v-if="profile.avatar_url"
                      :src="profile.avatar_url"
                      alt="Avatar"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <svg
                        class="h-10 w-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <span
                    v-if="profile.role"
                    class="absolute -bottom-1 -right-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {{ profile.role }}
                  </span>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ profile.full_name || 'Anonymous' }}
                  </h2>
                  <p class="text-gray-500 dark:text-gray-400 mt-1">
                    ID: {{ profile.id|| 'No email provided' }}
                  </p>
                  <div v-if="profile.skills" class="mt-3 flex flex-wrap gap-1.5">
                    <span
                      v-for="(skill, index) in profile.skills.split(',').slice(0, 3)"
                      :key="index"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                    >
                      {{ skill.trim() }}
                    </span>
                    <span
                      v-if="profile.skills.split(',').length > 3"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      +{{ profile.skills.split(',').length - 3 }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-6 flex justify-end space-x-3">
                <router-link
                  :to="`/ShowUser/${profile.id}`"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  View Profile
                </router-link>
                <button
                  v-if="isAdmin"
                  @click.stop="confirmDelete(profile.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  :disabled="isDeleting && profileToDelete === profile.id"
                >
                  <span
                    v-if="isDeleting && profileToDelete === profile.id"
                    class="inline-flex items-center"
                  >
                    <svg
                      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                  <span v-else>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalProfiles > pageSize" class="mt-12 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="page === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="page === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing <span class="font-medium">{{ (page - 1) * pageSize + 1 }}</span> to
                <span class="font-medium">{{ Math.min(page * pageSize, totalProfiles) }}</span> of
                <span class="font-medium">{{ totalProfiles }}</span> results
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="prevPage"
                  :disabled="page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
                >
                  <span class="sr-only">Previous</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  v-for="p in visiblePages"
                  :key="p"
                  @click="page = p"
                  :class="{
                    'z-10 bg-indigo-50 border-indigo-500 text-indigo-600': p === page,
                    'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': p !== page,
                  }"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {{ p }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="page === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
                >
                  <span class="sr-only">Next</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showDeleteModal" class="fixed z-50 inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <!-- Modal content -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
            >&#8203;</span
          >

          <transition name="modal-slide">
            <div
              class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <svg
                      class="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Delete Profile
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this user profile? This action cannot be
                        undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
              >
                <button
                  @click="deleteProfile"
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  :disabled="isDeleting"
                >
                  <span v-if="isDeleting" class="inline-flex items-center">
                    <svg
                      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                  <span v-else>Delete</span>
                </button>
                <button
                  @click="cancelDelete"
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  :disabled="isDeleting"
                >
                  Cancel
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'

// Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// State
const profiles = ref([])
const loading = ref(true)
const error = ref(null)
const page = ref(1)
const pageSize = ref(9)
const totalProfiles = ref(0)
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const profileToDelete = ref(null)
const currentUser = ref(null)
const isAdmin = ref(false)

// Computed
const totalPages = computed(() => Math.ceil(totalProfiles.value / pageSize.value))
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, page.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const fetchCurrentUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    currentUser.value = user

    if (user) {
      // Check if user has admin role
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()

      isAdmin.value = data?.role === 'admin'
    }
  } catch (err) {
    console.error('Error fetching current user:', err)
  }
}

const fetchProfiles = async () => {
  try {
    loading.value = true
    error.value = null

    // Get total count
    const { count } = await supabase.from('profiles').select('*', { count: 'exact' })

    totalProfiles.value = count || 0

    // Get paginated data
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page.value - 1) * pageSize.value, page.value * pageSize.value - 1)

    if (fetchError) throw fetchError

    profiles.value = data || []
  } catch (err) {
    error.value = err.message
    console.error('Error fetching profiles:', err)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (profileId) => {
  if (!isAdmin.value) return
  profileToDelete.value = profileId
  showDeleteModal.value = true
}

const deleteProfile = async () => {
  if (!profileToDelete.value || !isAdmin.value) return

  try {
    isDeleting.value = true

    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profileToDelete.value)

    if (deleteError) throw deleteError

    // Remove from local state
    profiles.value = profiles.value.filter((p) => p.id !== profileToDelete.value)
    totalProfiles.value -= 1

    // Close modal
    showDeleteModal.value = false
  } catch (err) {
    error.value = err.message
    console.error('Error deleting profile:', err)
  } finally {
    isDeleting.value = false
    profileToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  profileToDelete.value = null
}

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
    fetchProfiles()
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchProfiles()
  }
}

// Lifecycle
onMounted(async () => {
  await fetchCurrentUser()
  await fetchProfiles()
})
</script>

<style>
/* Modal transition styles */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.3s ease;
}

.modal-slide-enter-from,
.modal-slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
