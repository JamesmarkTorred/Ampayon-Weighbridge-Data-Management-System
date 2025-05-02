<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const profile = ref(null)
const isLoading = ref(false)
const error = ref(null)

async function fetchProfile() {
  try {
    isLoading.value = true
    error.value = null
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error(authError?.message || 'No authenticated user')
    }

    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, updated_at')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) throw profileError
    
    profile.value = data || {}
  } catch (err) {
    console.error('Failed to fetch profile:', err)
    error.value = err.message || 'Failed to load profile'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center p-8 space-y-4">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-600">Loading your profile...</p>
    </div>
    
    <!-- Error state -->
    <div v-if="error" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
      <p class="font-medium">Error!</p>
      <p>{{ error }}</p>
    </div>
    
    <!-- Profile data -->
    <div v-if="profile && !isLoading" class="space-y-6">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {{ profile.full_name ? profile.full_name.charAt(0) : profile.email.charAt(0) }}
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ profile.full_name || 'Anonymous User' }}</h2>
          <p class="text-gray-600">{{ profile.role || 'No role specified' }}</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500">Personal Information</h3>
          <div class="mt-2 space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Full Name</span>
              <span class="font-medium text-gray-900">{{ profile.full_name || 'Not provided' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Email</span>
              <span class="font-medium text-gray-900">{{ profile.email || 'Not provided' }}</span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500">Account Details</h3>
          <div class="mt-2 space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">User Role</span>
              <span class="font-medium text-gray-900">{{ profile.role || 'Standard' }}</span>
            </div>
            <div class="flex justify-between" v-if="profile.updated_at">
              <span class="text-gray-600">Last Updated</span>
              <span class="font-medium text-gray-900">{{ new Date(profile.updated_at).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-if="!profile && !isLoading && !error" class="p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
        <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No profile data found</h3>
      <p class="mt-1 text-gray-500">We couldn't find any profile information for your account.</p>
      <div class="mt-6">
        <button @click="fetchProfile" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Retry
        </button>
      </div>
    </div>
  </div>
</template>