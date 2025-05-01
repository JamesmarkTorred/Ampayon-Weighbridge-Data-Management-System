<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p class="text-lg text-gray-600 mb-6">You don't have permission to access this page.</p>
      <router-link
        to="/home"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Return to Dashboard
      </router-link>
    </div>
  </div>
</template>
