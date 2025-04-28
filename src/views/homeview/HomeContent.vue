<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Simple Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold text-gray-800">
          DPWH Weighbridge System
        </h1>
        <button @click="handleLogout" class="text-gray-500 hover:text-blue-600">
          <i class="ri-logout-box-r-line"></i>
        </button>
      </div>
    </header>

    <!-- Basic Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-medium text-gray-800 mb-2">Welcome to the DPWH Weighbridge Station DMS</h2>
        <p class="text-gray-600 mb-6">
          This system supports efficient monitoring and recording of truck weights, violation tracking, and report generation at weighbridge stations.
        </p>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 class="text-blue-700 font-semibold mb-2">Daily Log Entry</h3>
            <p class="text-gray-600 text-sm">
              Record vehicle entries, weight measurements, and other essential data for daily operations.
            </p>
          </div>

          <div class="bg-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 class="text-yellow-700 font-semibold mb-2">Violation Tracking</h3>
            <p class="text-gray-600 text-sm">
              Monitor overloaded trucks, record violations, and generate apprehension letters.
            </p>
          </div>

          <div class="bg-green-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 class="text-green-700 font-semibold mb-2">Reports & Analytics</h3>
            <p class="text-gray-600 text-sm">
              Generate daily, monthly, or annual reports on vehicle volume, overload frequency, and more.
            </p>
          </div>

          <div class="bg-purple-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 class="text-purple-700 font-semibold mb-2">User Management</h3>
            <p class="text-gray-600 text-sm">
              Administer operator and admin accounts for secure access and control of system features.
            </p>
          </div>
        </div>

        <!-- Note or Footer Section -->
        <div class="mt-6 text-sm text-gray-500 text-center">
          Department of Public Works and Highways – Anti-Truck Overloading Operations
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  // Add your logout logic here
  console.log('Logging out...')
  router.push('/login')
}
</script>

<style scoped>
/* No additional styles needed */
</style>
