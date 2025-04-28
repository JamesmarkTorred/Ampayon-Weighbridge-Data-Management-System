<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import AuthForm from '@/components/auth/AuthForm.vue'
import { supabase } from '@/supabase'

const router = useRouter()
const form = ref({
  email: '',
  password: ''
})
const errors = ref({})
const isLoading = ref(false)
const showPassword = ref(false)
const apiError = ref('')

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  apiError.value = ''

  try {
    // 1. Authenticate user with email/password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('No user returned from authentication')

    // 2. Fetch user profile - using .maybeSingle() for safety
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', authData.user.id)
      .maybeSingle() // Returns null instead of error if no rows

    if (profileError) throw profileError
    if (!profile) {
      // If no profile exists, create one with default role
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: authData.user.email,
          role: 'user', // Default role
          full_name: authData.user.user_metadata?.full_name || ''
        })

      if (upsertError) throw upsertError
      router.push('/dashboard')
      return
    }

    console.log('Login successful. User role:', profile.role)
    
    // 3. Redirect based on role with fallback
    const redirectPath = profile?.role === 'admin' ? '/admin' : '/dashboard'
    router.push(redirectPath)

  } catch (error) {
    console.error('Login error:', error)
    
    // Handle specific error cases
    if (error.message.includes('JSON object requested, multiple')) {
      apiError.value = 'Account configuration error. Please contact support.'
      console.error('Multiple profiles found for user. Database integrity issue.')
    } else if (error.message.includes('Invalid login credentials')) {
      apiError.value = 'Invalid email or password'
    } else {
      apiError.value = error.message || 'Login failed. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <template #title>Sign in to your account</template>
    <template #subtitle>
      Or <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
        register for a new account
      </router-link>
    </template>

    <AuthForm @submit="handleLogin">
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
              :class="{'border-red-500': errors.email}"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1 relative">
            <input 
              :id="`password`" 
              :name="`password`" 
              :type="showPassword ? 'text' : 'password'" 
              autocomplete="current-password" 
              required
              v-model="form.password"
              :class="{'border-red-500': errors.password}"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <!-- API Error Message -->
        <div v-if="apiError" class="rounded-md bg-red-50 p-4 mt-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ apiError }}</h3>
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
          <span>{{ isLoading ? 'Signing in...' : 'Sign in' }}</span>
        </div>
      </template>
    </AuthForm>
  </AuthLayout>
</template>