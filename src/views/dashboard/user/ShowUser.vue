<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <div class="mb-6">
        <router-link 
          to="/User" 
          class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back to profiles
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
        <div class="p-8">
          <div class="flex flex-col items-center">
            <div class="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 mb-6"></div>
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-8"></div>
          </div>
          <div class="space-y-6">
            <div v-for="n in 5" :key="n" class="h-4 bg-gray-200 dark:bg-gray-700 rounded" :class="n % 2 ? 'w-full' : 'w-5/6'"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div class="p-8 flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Error loading profile</h3>
            <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <p>{{ error }}</p>
            </div>
            <div class="mt-4">
              <button @click="fetchProfile" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Data -->
      <div v-else-if="profile" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center">
          <div class="flex justify-center">
            <div class="relative">
              <div class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 ring-offset-2 mx-auto">
                <img 
                  v-if="profile.avatar_url" 
                  :src="profile.avatar_url" 
                  alt="Avatar"
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
              </div>
              <span v-if="profile.role" class="absolute bottom-0 right-0 bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-3 py-1 rounded-full shadow">
                {{ profile.role }}
              </span>
            </div>
          </div>
          <h1 class="mt-6 text-3xl font-bold text-white">
            {{ profile.full_name || 'Anonymous' }}
          </h1>
          <p class="mt-2 text-indigo-100">
            {{ profile.email || 'No email provided' }}
          </p>
          <div v-if="profile.bio" class="mt-4 max-w-2xl mx-auto text-indigo-100">
            {{ profile.bio }}
          </div>
        </div>

        <!-- Profile Details -->
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Personal Information -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                Personal Information
              </h2>
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                  <p class="mt-1 text-gray-900 dark:text-white">
                    {{ profile.full_name || 'Not specified' }}
                  </p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                  <p class="mt-1 text-gray-900 dark:text-white">
                    {{ profile.email || 'Not specified' }}
                  </p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                  <p class="mt-1 text-gray-900 dark:text-white">
                    {{ profile.id || 'Not specified' }}
                  </p>
                </div>
        
              </div>
            </div>

            <!-- Additional Information -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                Additional Information
              </h2>
              <div class="space-y-4">
        
                <div v-if="profile.created_at">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</h3>
                  <p class="mt-1 text-gray-900 dark:text-white">
                    {{ new Date(profile.created_at).toLocaleDateString() }}
                  </p>
                </div>
                <div v-if="profile.updated_at">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                  <p class="mt-1 text-gray-900 dark:text-white">
                    {{ new Date(profile.updated_at).toLocaleDateString() }}
                  </p>
                </div>
                
              </div>
            </div>
          </div>

          
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden text-center p-12">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="mt-5 text-xl font-medium text-gray-900 dark:text-white">Profile not found</h3>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          The profile you're looking for doesn't exist or may have been removed.
        </p>
        <div class="mt-6">
          <router-link to="/profiles" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Browse All Profiles
          </router-link>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { createClient } from '@supabase/supabase-js'

// Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// State
const profile = ref(null)
const loading = ref(true)
const error = ref(null)
const isDeleting = ref(false)
const profileToDelete = ref(null)

// Get route params
const route = useRoute()
const profileId = route.params.id

// Methods
const fetchProfile = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single()

    if (fetchError) throw fetchError

    profile.value = data
  } catch (err) {
    error.value = err.message
    console.error('Error fetching profile:', err)
  } finally {
    loading.value = false
  }
}



// Lifecycle
onMounted(() => {
  fetchProfile()
})
</script>