<template>
    <div class="user-profile-page">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-6 animate-pulse">
        <div class="flex flex-col items-center">
          <div class="w-32 h-32 rounded-full bg-gray-200 mb-4"></div>
          <div class="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div class="space-y-4">
          <div v-for="n in 3" :key="n" class="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error loading profile: {{ error }}</span>
        </div>
        <button @click="fetchUserProfile" class="btn btn-sm">Retry</button>
      </div>
      
      <!-- Success State -->
      <div v-else-if="profile" class="max-w-3xl mx-auto">
        <div class="flex flex-col items-center mb-8">
          <img
            v-if="profile.avatar_url"
            :src="profile.avatar_url"
            alt="Profile picture"
            class="w-32 h-32 rounded-full object-cover border-4 border-primary mb-4"
          />
          <div v-else class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-primary mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-center">{{ profile.full_name || 'Anonymous' }}</h1>
          <p class="text-lg text-gray-600">{{ profile.role }}</p>
          <p v-if="profile.bio" class="text-gray-500 mt-2 text-center max-w-lg">{{ profile.bio }}</p>
        </div>
        
        <div class="bg-base-100 rounded-lg shadow-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Username</h3>
                <p class="mt-1">{{ profile.username || 'Not specified' }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Email</h3>
                <p class="mt-1">{{ profile.email || 'Not specified' }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Member Since</h3>
                <p class="mt-1">{{ formattedDate(profile.created_at) }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Website</h3>
                <a v-if="profile.website" :href="profile.website" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                  {{ profile.website }}
                </a>
                <p v-else>Not specified</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Location</h3>
                <p class="mt-1">{{ profile.location || 'Not specified' }}</p>
              </div>
              <div v-if="profile.skills">
                <h3 class="text-sm font-medium text-gray-500">Skills</h3>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span v-for="(skill, index) in profile.skills.split(',')" :key="index" class="badge badge-primary">
                    {{ skill.trim() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-8 flex justify-center">
          <router-link to="/" class="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Profiles
          </router-link>
        </div>
      </div>
      
      <!-- Not Found State -->
      <div v-else class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="mt-4 text-2xl font-bold">Profile Not Found</h2>
        <p class="mt-2 text-gray-600">The user profile you're looking for doesn't exist or may have been removed.</p>
        <router-link to="/" class="btn btn-primary mt-6">
          Browse All Profiles
        </router-link>
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
  
  const route = useRoute()
  const username = route.params.username
  
  // State
  const profile = ref(null)
  const loading = ref(true)
  const error = ref(null)
  
  // Methods
  const fetchUserProfile = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
  
      if (fetchError) throw fetchError
  
      profile.value = data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching user profile:', err)
    } finally {
      loading.value = false
    }
  }
  
  const formattedDate = (dateString) => {
    if (!dateString) return 'Unknown'
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Lifecycle
  onMounted(() => {
    fetchUserProfile()
  })
  </script>
  
  <style scoped>
  
  </style>