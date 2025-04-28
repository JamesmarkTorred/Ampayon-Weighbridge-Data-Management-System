<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  isOpen: Boolean
});

const activeTab = ref('home');

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const handleLogout = () => {
  console.log('Logging out...');
  router.push('/login');
};
</script>

<template>
  <aside
    class="fixed left-0 top-0 w-64 h-full bg-gray-900 p-4 z-50 flex flex-col transition-transform duration-300 ease-in-out"
    :class="{ '-translate-x-full': !isOpen }"
    aria-label="Main navigation"
  >
    <!-- Brand/Logo Section -->
    <div class="pb-4 border-b border-gray-800">
      <router-link
        to="/home"
        class="flex items-center group"
        @click="setActiveTab('home')"
        aria-label="Home"
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
        <!-- Home -->
        <li>
          <router-link
            to="/home"
            class="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
            :class="{ 'bg-gray-800 text-white': activeTab === 'home' }"
            @click="setActiveTab('home')"
          >
            <i class="ri-home-2-line mr-3 text-lg"></i>
            <span>Home</span>
            <span 
              v-if="activeTab === 'home'"
              class="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"
              aria-hidden="true"
            ></span>
          </router-link>
        </li>

        <!-- About -->
        <li>
          <router-link
            to="/about"
            class="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
            :class="{ 'bg-gray-800 text-white': activeTab === 'about' }"
            @click="setActiveTab('about')"
          >
            <i class="ri-information-line mr-3 text-lg"></i>
            <span>About</span>
          </router-link>
        </li>

        <!-- Authentication Section -->
        <li class="pt-2 mt-2 border-t border-gray-800">
          <router-link
            to="/login"
            class="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
            :class="{ 'bg-gray-800 text-white': activeTab === 'login' }"
            @click="setActiveTab('login')"
          >
            <i class="ri-login-box-line mr-3 text-lg"></i>
            <span>Login</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/register"
            class="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
            :class="{ 'bg-gray-800 text-white': activeTab === 'register' }"
            @click="setActiveTab('register')"
          >
            <i class="ri-user-add-line mr-3 text-lg"></i>
            <span>Register</span>
          </router-link>
        </li>
      </ul>
    </nav>

   
  </aside>
</template>

<style scoped>

</style>