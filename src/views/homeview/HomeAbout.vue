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
        <h2 class="text-lg font-medium text-gray-800 mb-2">Overview of the System</h2>
        <p class="text-gray-600 mb-4">
          The <strong>DPWH Weighbridge Management System</strong> is a digital solution designed to streamline the recording and evaluation of cargo vehicle weights at designated weighbridge stations. By leveraging technology, it ensures accurate weight checks, prevents road wear and tear, and supports compliance with national regulations on load limits.
        </p>

        <p class="text-gray-600 mb-6">
          The system empowers station operators with real-time monitoring tools, provides administrators with automated reporting features, and supports enforcement units in flagging and documenting overloaded vehicles. It’s a complete ecosystem for modern, efficient highway load management.
        </p>

        <!-- Feature Highlights -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 class="text-blue-700 font-semibold mb-2">Real-Time Weighing</h3>
            <p class="text-gray-600 text-sm">
              Capture and store vehicle weight data instantly as trucks pass through the weighbridge to ensure precise measurement and fast processing.
            </p>
          </div>

          <div class="bg-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 class="text-yellow-700 font-semibold mb-2">Automated Alerts</h3>
            <p class="text-gray-600 text-sm">
              Instantly flag overloaded vehicles and notify the operator to initiate proper action, from documentation to issuing violations.
            </p>
          </div>

          <div class="bg-green-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 class="text-green-700 font-semibold mb-2">Analytics Dashboard</h3>
            <p class="text-gray-600 text-sm">
              View charts and summaries of traffic patterns, load trends, and station performance using built-in analytics and reporting tools.
            </p>
          </div>

          <div class="bg-purple-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 class="text-purple-700 font-semibold mb-2">User-Friendly Access</h3>
            <p class="text-gray-600 text-sm">
              Operators and administrators can access the system through a secure, easy-to-navigate interface tailored for efficiency and control.
            </p>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="mt-6 text-sm text-gray-500 text-center">
          Developed to support safe highways and sustainable infrastructure under the Department of Public Works and Highways.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
function handleLogout() {
  // Placeholder logout logic
  alert('Logging out...');
}
</script>
