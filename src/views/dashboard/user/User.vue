<template>
  <div class="profile-page">
    <h1 class="text-3xl font-bold mb-6 text-center">Public Profiles</h1>
    
    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="profile-card p-4 border rounded animate-pulse">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 rounded-full bg-gray-200"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading profiles: {{ error }}</span>
      </div>
      <button @click="fetchProfiles" class="btn btn-sm">Retry</button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="profiles.length === 0" class="text-center py-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium">No profiles found</h3>
      <p class="mt-1 text-gray-500">There are no public profiles to display.</p>
    </div>
    
    <!-- Success State -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link
          v-for="profile in profiles"
          :key="profile.id"
          :to="`/ShowUser`"
          class="profile-card p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex items-center space-x-4">
            <img
              v-if="profile.avatar_url"
              :src="profile.avatar_url"
              alt="Avatar"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div v-else class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="text-lg font-semibold">{{ profile.full_name || 'Anonymous' }}</p>
              <p class="text-sm text-gray-600">{{ profile.role }}</p>
             
            </div>
          </div>
        </router-link>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalProfiles > pageSize" class="flex justify-center mt-8">
        <div class="btn-group">
          <button 
            @click="prevPage" 
            :disabled="page === 1" 
            class="btn"
            :class="{ 'btn-disabled': page === 1 }"
          >
            Previous
          </button>
          <button class="btn">Page {{ page }} of {{ totalPages }}</button>
          <button 
            @click="nextPage" 
            :disabled="page === totalPages" 
            class="btn"
            :class="{ 'btn-disabled': page === totalPages }"
          >
            Next
          </button>
        </div>
      </div>
    </div>
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
const pageSize = ref(6)
const totalProfiles = ref(0)

// Computed
const totalPages = computed(() => Math.ceil(totalProfiles.value / pageSize.value))

// Methods
const fetchProfiles = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Get total count
    const { count } = await supabase
      .from('profiles')
      .select('*')
    
    totalProfiles.value = count

    // Get paginated data
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page.value - 1) * pageSize.value, page.value * pageSize.value - 1)

    if (fetchError) throw fetchError

    profiles.value = data
  } catch (err) {
    error.value = err.message
    console.error('Error fetching profiles:', err)
  } finally {
    loading.value = false
  }
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
onMounted(() => {
  fetchProfiles()
})
</script>

<style scoped>

</style>ate>