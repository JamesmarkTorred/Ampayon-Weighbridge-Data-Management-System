<template>
    <form class="space-y-6" @submit.prevent="submit">
      <slot name="fields"></slot>
      
      <div v-if="showRemember" class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" 
                 class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
        </div>
  
        <div class="text-sm">
          <router-link to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </router-link>
        </div>
      </div>
  
      <div>
        <button type="submit" 
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <slot name="button"></slot>
        </button>
      </div>
    </form>
  
    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">
            <slot name="footer-text"></slot>
          </span>
        </div>
      </div>
  
      <div class="mt-6 grid grid-cols-1 gap-3">
        <slot name="social-auth"></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    showRemember: {
      type: Boolean,
      default: true
    }
  })
  
  const emit = defineEmits(['submit'])
  
  const submit = () => {
    emit('submit')
  }
  </script>