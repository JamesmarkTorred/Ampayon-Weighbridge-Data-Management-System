<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-xl font-semibold text-gray-800">
            About – DPWH Weighbridge System
          </h1>
          <button @click="handleLogout" class="text-gray-500 hover:text-blue-600">
            <i class="ri-logout-box-r-line"></i>
          </button>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-medium text-gray-800 mb-2">What is the DPWH Weighbridge DMS?</h2>
          <p class="text-gray-600 mb-4">
            The <strong>DPWH Weighbridge Station Record Management System</strong> is designed to enhance the monitoring and enforcement of truck load limits across national highways. It plays a critical role in preventing road damage and ensuring safety by tracking the weight of cargo vehicles in real time.
          </p>
  
          <p class="text-gray-600 mb-6">
            Built to support operators and administrators, this system ensures that vehicle data is properly recorded, violations are monitored and addressed, and reports are generated for proper documentation and review.
          </p>
  
          <!-- Feature Highlights -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 class="text-blue-700 font-semibold mb-2">Daily Log Entry</h3>
              <p class="text-gray-600 text-sm">
                Record time-stamped vehicle entries, truck details, and axle weight data in an organized and searchable manner.
              </p>
            </div>
  
            <div class="bg-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 class="text-yellow-700 font-semibold mb-2">Violation Tracking</h3>
              <p class="text-gray-600 text-sm">
                Track overloaded trucks, store violation records, and generate official citation letters efficiently.
              </p>
            </div>
  
            <div class="bg-green-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 class="text-green-700 font-semibold mb-2">Reports & Analytics</h3>
              <p class="text-gray-600 text-sm">
                Visualize data trends by exporting daily, monthly, and yearly reports on traffic and overload patterns.
              </p>
            </div>
  
            <div class="bg-purple-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 class="text-purple-700 font-semibold mb-2">User Roles & Access</h3>
              <p class="text-gray-600 text-sm">
                Secure the system with role-based access for operators and admins to manage and oversee operations responsibly.
              </p>
            </div>
          </div>
  
          <!-- Footer Note -->
          <div class="mt-6 text-sm text-gray-500 text-center">
            A system initiative of the Department of Public Works and Highways – Anti-Truck Overloading Operations Program.
          </div>
        </div>
      </main>
    </div>
  </template>
  