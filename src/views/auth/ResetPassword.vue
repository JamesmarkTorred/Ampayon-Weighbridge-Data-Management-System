<template>
  <AuthLayout>
    <template #title>Reset your password</template>
    <template #subtitle>
      Enter your new password below
    </template>

    <AuthForm @submit="handleSubmit" :showRemember="false">
      <template #fields>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">New Password</label>
          <div class="mt-1">
            <input id="password" name="password" type="password" required
                   v-model="form.password"
                   class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <div class="mt-1">
            <input id="password_confirmation" name="password_confirmation" type="password" required
                   v-model="form.password_confirmation"
                   class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
        </div>
      </template>

      <template #button>
        <span v-if="loading">Processing...</span>
        <span v-else>Reset password</span>
      </template>
    </AuthForm>

    <!-- Status messages -->
    <div v-if="error" class="mt-4 text-center text-sm text-red-600">
      {{ error }}
    </div>
    <div v-if="success" class="mt-4 text-center text-sm text-green-600">
      Password updated successfully! You can now login with your new password.
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import AuthForm from '@/components/auth/AuthForm.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref(null)
const success = ref(false)

const form = ref({
  password: '',
  password_confirmation: '',
  token: route.hash.split('=')[1] // Extract token from URL hash
})

const handleSubmit = async () => {
  // Validate passwords match
  if (form.value.password !== form.value.password_confirmation) {
    error.value = "Passwords don't match"
    return
  }

  // Validate password strength (optional)
  if (form.value.password.length < 8) {
    error.value = "Password must be at least 8 characters"
    return
  }

  loading.value = true
  error.value = null
  success.value = false

  try {
    // Verify the token and update password
    const { error: authError } = await supabase.auth.updateUser({
      password: form.value.password
    })

    if (authError) throw authError

    success.value = true
    
    // Optional: Redirect after successful password reset
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = err.message || 'Failed to reset password'
    console.error('Password reset error:', err)
  } finally {
    loading.value = false
  }
}
</script>