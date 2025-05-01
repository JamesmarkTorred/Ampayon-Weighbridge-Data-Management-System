<template>
  <AuthLayout>
    <template #title>Forgot your password?</template>
    <template #subtitle>
      Remember your password? <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">Sign in here</router-link>
    </template>

    <AuthForm @submit="handleSubmit" :showRemember="false">
      <template #fields>
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <div class="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="form.email"
              :class="{ 'border-red-500': errors.email }"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errors.general" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{{ errors.general }}</p>
            </div>
          </div>
        </div>
      </template>

      <template #button>
        <div class="flex items-center justify-center">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? 'Sending...' : 'Send reset link' }}</span>
        </div>
      </template>
    </AuthForm>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import AuthForm from '@/components/auth/AuthForm.vue'

const router = useRouter()

const form = ref({
  email: ''
})

const errors = ref({
  email: '',
  general: ''
})

const successMessage = ref('')
const isLoading = ref(false)

const validateForm = () => {
  errors.value = { email: '', general: '' }
  let isValid = true

  // Email validation
  if (!form.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errors.value.general = ''
  successMessage.value = ''

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(form.value.email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error

    successMessage.value = 'Password reset link sent! Check your email for instructions.'
    form.value.email = ''
    
    // Optional: Redirect after success
    setTimeout(() => router.push('/login'), 5000)
  } catch (error) {
    console.error('Password reset error:', error)
    errors.value.general = error.message || 'Failed to send reset link. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>