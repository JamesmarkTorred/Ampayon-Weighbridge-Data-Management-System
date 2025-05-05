<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import AuthForm from '@/components/auth/AuthForm.vue'
import { supabase } from '@/supabase'

const router = useRouter()
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  name: '',
  email: '',
  role: '',
  password: '',
  password_confirmation: '',
})

const errors = ref({})

const validateForm = () => {
  errors.value = {}

  // Name validation
  if (!form.value.name.trim()) {
    errors.value.name = 'Full name is required'
  } else if (form.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
  }

  // Email validation
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  // Role validation
  if (!form.value.role) {
    errors.value.role = 'Please select a role'
  }

  // Password validation
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else if (!/[A-Z]/.test(form.value.password)) {
    errors.value.password = 'Include at least one uppercase letter'
  } else if (!/[0-9]/.test(form.value.password)) {
    errors.value.password = 'Include at least one number'
  }

  // Confirm password validation
  if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = 'Passwords do not match'
  }

  return Object.keys(errors.value).length === 0
}

const passwordStrength = computed(() => {
  if (!form.value.password) return 0
  let strength = 0
  if (form.value.password.length >= 8) strength += 1
  if (/[A-Z]/.test(form.value.password)) strength += 1
  if (/[0-9]/.test(form.value.password)) strength += 1
  if (/[^A-Za-z0-9]/.test(form.value.password)) strength += 1
  return strength
})

const strengthColor = computed(() => {
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  return colors[passwordStrength.value - 1] || 'bg-gray-200'
})

const strengthText = computed(() => {
  const texts = ['Weak', 'Fair', 'Good', 'Strong']
  return texts[passwordStrength.value - 1] || ''
})

const handleRegister = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errors.value.apiError = ''

  try {
    const { data, error } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          full_name: form.value.name,
          role: form.value.role,
        },
      },
    })

    if (error) throw error

    if (data.user?.identities?.length === 0) {
      throw new Error('Email already registered')
    }

    if (data.user && !data.user.confirmed_at) {
      router.push({
        path: '/verify-email',
        query: { email: form.value.email },
      })
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Registration error:', error)
    errors.value.apiError = error.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <template #title>Create a new account</template>
    <template #subtitle>
      Or
      <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
        sign in to your existing account
      </router-link>
    </template>

    <AuthForm @submit="handleRegister" :showRemember="false">
      <template #fields>
        <!-- Name Field -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Full name</label>
          <div class="mt-1 relative">
            <input
              id="name"
              name="name"
              type="text"
              autocomplete="name"
              required
              v-model="form.name"
              :class="{ 'border-red-500': errors.name }"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <div class="mt-1 relative">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="form.email"
              :class="{ 'border-red-500': errors.email }"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Role Field -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
          <div class="mt-1">
            <select
              id="role"
              name="role"
              required
              v-model="form.role"
              :class="{ 'border-red-500': errors.role }"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="" disabled selected>Select a role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1 relative">
            <input
              :id="`password`"
              :name="`password`"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              v-model="form.password"
              :class="{ 'border-red-500': errors.password }"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clip-rule="evenodd"
                />
                <path
                  d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div v-if="form.password" class="mt-2">
            <div class="flex gap-1">
              <div
                v-for="i in 4"
                :key="i"
                :class="passwordStrength >= i ? strengthColor : 'bg-gray-200'"
                class="h-1 flex-1 rounded"
              ></div>
            </div>
            <p
              class="text-xs mt-1"
              :class="{
                'text-red-500': passwordStrength <= 1,
                'text-yellow-500': passwordStrength === 2,
                'text-blue-500': passwordStrength === 3,
                'text-green-500': passwordStrength >= 4,
              }"
            >
              {{ strengthText }} password
            </p>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div class="mt-1 relative">
            <input
              id="password_confirmation"
              name="password_confirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              v-model="form.password_confirmation"
              :class="{ 'border-red-500': errors.password_confirmation }"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <span class="material-icons-outlined text-sm">
                {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
          <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">
            {{ errors.password_confirmation }}
          </p>
        </div>

        <!-- API Error Message -->
        <div v-if="errors.apiError" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ errors.apiError }}</h3>
            </div>
          </div>
        </div>
      </template>

      <template #button>
        <div class="flex items-center justify-center">
          <svg
            v-if="isLoading"
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
          <span>{{ isLoading ? 'Creating account...' : 'Create account' }}</span>
        </div>
      </template>
    </AuthForm>
  </AuthLayout>
</template>
