<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="@/assets/logo.png" alt="Your Company" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Verify Your Email Address
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success State -->
        <div v-if="isVerified" class="rounded-md bg-green-50 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Email verified successfully!</h3>
              <div class="mt-2 text-sm text-green-700">
                <p>You can now access all features of the application.</p>
              </div>
              <div class="mt-4">
                <router-link
                  to="/dashboard"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Go to Dashboard
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="isLoading" class="flex justify-center py-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          ></div>
        </div>

        <!-- Verification Form -->
        <div v-else class="space-y-6">
          <div>
            <p class="text-sm text-gray-600">
              We've sent a verification link to <span class="font-medium">{{ email }}</span
              >. Please click the link in that email to verify your account.
            </p>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <span class="text-gray-600">Didn't receive an email?</span>
              <button
                @click="resendVerification"
                class="ml-1 font-medium text-blue-600 hover:text-blue-500"
                :disabled="isResending"
              >
                {{ isResending ? 'Sending...' : 'Resend verification' }}
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <ExclamationCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ error }}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const router = useRouter()

const email = ref(route.query.email || '')
const isVerified = ref(false)
const isLoading = ref(true)
const isResending = ref(false)
const error = ref(null)

// Verify the token from URL if present
const verifyToken = async () => {
  const token = route.query.token
  if (!token) {
    isLoading.value = false
    return
  }

  try {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: 'email',
      token_hash: token,
      email: email.value,
    })

    if (verifyError) throw verifyError

    isVerified.value = true
    // Redirect after 3 seconds
    setTimeout(() => router.push('/dashboard'), 3000)
  } catch (err) {
    error.value = err.message || 'Invalid or expired verification link'
  } finally {
    isLoading.value = false
  }
}

// Resend verification email
const resendVerification = async () => {
  isResending.value = true
  error.value = null

  try {
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email.value,
    })

    if (resendError) throw resendError

    error.value = 'Verification email resent successfully!'
  } catch (err) {
    error.value = err.message || 'Failed to resend verification email'
  } finally {
    isResending.value = false
  }
}

onMounted(() => {
  verifyToken()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
