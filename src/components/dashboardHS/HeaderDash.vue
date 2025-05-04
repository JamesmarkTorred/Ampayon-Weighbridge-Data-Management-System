<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase'; // Make sure to import if using Supabase

const router = useRouter();
const activeDropdown = ref(null);
const notificationTab = ref('notifications');
const recentSearches = ref([]); // For search functionality

const toggleDropdown = (dropdown) => {
  activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
};

const closeDropdowns = () => {
  activeDropdown.value = null;
};

const handleLogout = async () => {
  try {
    // Example with Supabase - adjust for your auth system
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    // Consider adding user feedback here
  }
};

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      closeDropdowns();
    }
  });
});
</script>

<template>
  <head>
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
  </head>
  <div class="py-2 px-6 bg-white flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
    <button 
      type="button" 
      aria-label="Toggle sidebar"
      class="text-lg text-gray-600 sidebar-toggle" 
      @click="$emit('toggle-sidebar')"
    >
      <i class="ri-menu-line"></i>
    </button>
    
    <!-- Breadcrumbs -->
    <ul class="flex items-center text-sm ml-4">
      <li class="mr-2">
        <router-link to="/" class="text-gray-400 hover:text-gray-600 font-medium">Weighbridge DMS</router-link>
      </li>
    </ul>
    
    <!-- Right side icons -->
    <ul class="ml-auto flex items-center">
    
      
      <!-- Profile Dropdown - Preserved as requested -->
      <li class="dropdown ml-3">
        <button 
          type="button" 
          class="dropdown-toggle flex items-center"
          @click.stop="toggleDropdown('profile')"
        >
          <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
            <i class="ri-user-line"></i>
          </div>
        </button>
        <ul 
          class="dropdown-menu shadow-md shadow-black/5 z-30 hidden md:absolute right-0 mt-2 py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]"
          :class="{ '!block': activeDropdown === 'profile' }"
        >
          <li>
            <router-link 
              to="/profile" 
              class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
              @click="closeDropdowns"
            >
              <i class="ri-user-line mr-2"></i> Profile
            </router-link>
          </li>
          
          <li class="border-t border-gray-100 mt-1 pt-1">
            <a 
              href="#" 
              class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
              @click.prevent="handleLogout"
            >
              <i class="ri-logout-box-r-line mr-2"></i> Logout
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown-menu {
  transition: all 0.2s ease;
}

.dropdown-toggle:focus + .dropdown-menu,
.dropdown-menu:hover {
  display: block;
}

.notification-tab button {
  transition: all 0.2s ease;
}
</style>