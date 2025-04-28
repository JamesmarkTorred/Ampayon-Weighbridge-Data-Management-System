<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import Sidebar from '@/components/homeviewHS/Sidebar.vue'
    import Header from '@/components/homeviewHS/Header.vue'

    const sidebarOpen = ref(false) // Start closed on mobile
    const isMobile = ref(false)

    // Check screen size and handle sidebar state
    const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 768 // Tailwind's md breakpoint
    sidebarOpen.value = !isMobile.value // Open on desktop, closed on mobile
    }

    // Handle window resize
    const handleResize = () => {
    checkScreenSize()
    }

    // Initialize and clean up event listeners
    onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    })

    const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
    }
</script>

<template>
  <div class="text-gray-800 font-inter">
    <Sidebar :is-open="sidebarOpen" @toggle="toggleSidebar" />

    <!-- Overlay for mobile -->
    <div
      class="fixed top-0 left-0 w-full h-full bg-black/50 z-40 lg:hidden sidebar-overlay"
      v-if="sidebarOpen && isMobile"
      @click="toggleSidebar"
    ></div>

    <main
      class="w-full transition-all duration-300 ease-in-out main"
      :class="{
        'lg:w-[calc(100%-256px)] lg:ml-64': sidebarOpen,
        'lg:ml-0 lg:w-full': !sidebarOpen,
      }"
    >
      <Header @toggle-sidebar="toggleSidebar" />
      <div class="p-4 md:p-6">
        <router-view /> <!-- This is where content from parent components will go -->
      </div>
    </main>
  </div>
</template>

<style scoped>
    /* Optional: Add smooth transitions */
    .main {
    transition:
        margin-left 0.3s ease,
        width 0.3s ease;
    }

    .sidebar-overlay {
    transition: opacity 0.3s ease;
    }
</style>
