import HomeViewLayout from '@/components/HomeViewLayout.vue'
import HomeAbout from '@/views/homeview/HomeAbout.vue'
import HomeContent from '@/views/homeview/HomeContent.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/',
      component: HomeViewLayout,
      children: [
        {
          path: '/home',
          name: 'home',
          component: HomeContent,
        },
        {
          path: '/about',
          name: 'about',
          component: HomeAbout
        },

      ]
    },

  ],
})

export default router
