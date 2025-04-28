<script setup>
    import { ref, onMounted, onBeforeUnmount} from 'vue'
    import HeaderDash from '@/components/dashboardHS/HeaderDash.vue'
    import SidebarDash from '@/components/dashboardHS/SidebarDash.vue'

    const sidebarOpen = ref(false)
    const isMobile = ref(false)

    const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 768
    sidebarOpen.value = !isMobile.value
    }

    const handleResize = () => {
    checkScreenSize()
    }

    const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
    }

    onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <div class="text-gray-800 font-inter">
          <SidebarDash :is-open="sidebarOpen" @toggle="toggleSidebar" />
          
          <!-- Overlay for mobile -->
          <div 
            v-if="sidebarOpen && isMobile"
            class="fixed top-0 left-0 w-full h-full bg-black/50 z-40 lg:hidden"
            @click="toggleSidebar"
          ></div>
          
          <main
              class="w-full transition-all duration-300 ease-in-out"
              :class="{
                  'lg:w-[calc(100%-256px)] lg:ml-64': sidebarOpen,
                  'lg:ml-0 lg:w-full': !sidebarOpen
              }"
              >
              <HeaderDash @toggle-sidebar="toggleSidebar" />
                <div class="p-4 md:p-6">
                    <router-view></router-view>
                </div>
          </main>
    </div>
  </template>
  
  <style scoped>
  /* Optional transitions */
  .main {
    transition: margin-left 0.3s ease, width 0.3s ease;
  }
  </style>