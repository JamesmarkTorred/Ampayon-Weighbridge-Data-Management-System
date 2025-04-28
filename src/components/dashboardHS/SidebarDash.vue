<script setup>
import { supabase } from '@/supabase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  isOpen: Boolean,
})

const user = ref(null)
const activeTab = ref('dashboard')
const isLoggingOut = ref(false)

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 w-64 h-full bg-gray-900 p-4 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-xl"
    :class="{ '-translate-x-full': !isOpen }"
    aria-label="Main navigation"
  >
    <!-- Brand/Logo Section -->
    <div class="pb-4 border-b border-gray-800">
      <router-link
        to="/dashboard"
        class="flex items-center group"
        @click="setActiveTab('dashboard')"
        aria-label="Dashboard"
      >
        <img 
          src="@/assets/logo.png" 
          alt="DPWH Logo" 
          class="w-8 h-8 rounded object-cover transition-transform group-hover:scale-105"
        />
        <span class="text-lg font-bold text-white ml-3">DPWH Portal</span>
      </router-link>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1">
        <!-- Dashboard -->
        <li>
          <router-link
            to="/dashboard"
            class="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
            :class="{ 'bg-gray-800 text-white': activeTab === 'dashboard' }"
            @click="setActiveTab('dashboard')"
          >
            <i class="ri-dashboard-2-line mr-3 text-lg"></i>
            <span>Dashboard</span>
            <span 
              v-if="activeTab === 'dashboard'"
              class="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"
              aria-hidden="true"
            ></span>
          </router-link>
        </li>

        <!-- Logs Management -->
        <li>
          <router-link
            to="/logs"
            class="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
            :class="{ 'bg-gray-800 text-white': activeTab === 'logs' }"
            @click="setActiveTab('logs')"
          >
            <i class="ri-file-list-line mr-3 text-lg"></i>
            <span>Logs Management</span>
          </router-link>
        </li>

        <!-- Violation Tracking -->
        <li>
          <router-link
            to="/violations"
            class="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
            :class="{ 'bg-gray-800 text-white': activeTab === 'violations' }"
            @click="setActiveTab('violations')"
          >
            <i class="ri-alert-line mr-3 text-lg"></i>
            <span>Violation Tracking</span>
          </router-link>
        </li>

        <!-- Reports -->
        <li>
          <router-link
            to="/reports"
            class="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
            :class="{ 'bg-gray-800 text-white': activeTab === 'reports' }"
            @click="setActiveTab('reports')"
          >
            <i class="ri-file-chart-line mr-3 text-lg"></i>
            <span>Reports</span>
          </router-link>
        </li>

        <!-- User Management -->
        <li class="pt-2 mt-2 border-t border-gray-800">
          <router-link
            to="/user"
            class="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
            :class="{ 'bg-gray-800 text-white': activeTab === 'users' }"
            @click="setActiveTab('users')"
          >
            <i class="ri-user-settings-line mr-3 text-lg"></i>
            <span>User Management</span>
          </router-link>
        </li>

        <!-- Roles & Permissions -->
        <li>
          <router-link
            to="/roles"
            class="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
            :class="{ 'bg-gray-800 text-white': activeTab === 'roles' }"
            @click="setActiveTab('roles')"
          >
            <i class="ri-shield-user-line mr-3 text-lg"></i>
            <span>Roles & Permissions</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Logout Section -->
    <div class="mt-auto pt-4 border-t border-gray-800">
      <button
        type="button"
        class="w-full flex items-center justify-center py-3 px-4 text-gray-300 hover:bg-red-900/30 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleLogout"
        :disabled="isLoggingOut"
        :aria-busy="isLoggingOut"
      >
        <i
          class="ri-logout-box-r-line mr-3 text-lg transition-all"
          :class="{ 'animate-spin': isLoggingOut }"
        ></i>
        <span>
          {{ isLoggingOut ? 'Signing out...' : 'Sign Out' }}
        </span>
      </button>
    </div>
  </aside>
</template>

<style scoped>

</style>