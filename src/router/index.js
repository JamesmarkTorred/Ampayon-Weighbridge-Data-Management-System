import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/components/DashboardLayout.vue'
import HomeViewLayout from '@/components/HomeViewLayout.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import HomeAbout from '@/views/homeview/HomeAbout.vue'
import HomeContent from '@/views/homeview/HomeContent.vue'
import DailyLogs from '@/views/dashboard/dailylogs/DailyLogs.vue'
import CreateLogs from '@/views/dashboard/dailylogs/CreateLogs.vue'
import { supabase } from '@/supabase'
import ShowLog from '@/views/dashboard/dailylogs/ShowLog.vue'
import EditLog from '@/views/dashboard/dailylogs/EditLog.vue' // Add this import
import VerifyEmail from '@/views/auth/VerifyEmail.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import Unauthorized from '@/views/Unauthorized.vue'
import Profile from '@/views/profile/Profile.vue'
import User from '@/views/dashboard/user/User.vue'
import ReportView from '@/views/dashboard/reports/ReportView.vue'

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
          component: HomeAbout,
        },
        {
          path: '/login',
          name: 'login',
          component: Login,
          meta: { requiresAuth: false }
        },
        {
          path: '/register',
          name: 'register',
          component: Register,
          meta: { requiresAuth: false }
        },
        {
          path: '/forgot-password',
          name: 'forgotPassword',
          component: ForgotPassword,
          meta: { requiresAuth: false }
        },
        {
          path: '/verify-email',
          name: 'verifyEmail',
          component: VerifyEmail,
          meta: { requiresAuth: false }
        },
        {
          path: '/reset-password',
          name: 'resetPassword',
          component: ResetPassword,
          meta: { requiresAuth: false }
        },
      ],
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
          meta: { requiresAuth: true }
        },
        // Updated log routes to follow RESTful conventions
        {
          path: '/logs',
          name: 'logs',
          component: DailyLogs,
          meta: { requiresAuth: true }
        },
        {
          path: '/logs/create',
          name: 'create-log',
          component: CreateLogs,
          meta: { requiresAuth: true }
        },
        {
          path: '/logs/:id',
          name: 'show-log',
          component: ShowLog,
          meta: { requiresAuth: true },
          props: true // Pass route params as props
        },
        {
          path: '/logs/:id/edit',
          name: 'edit-log',
          component: EditLog,
          meta: { requiresAuth: true },
          props: true // Pass route params as props
        },
        {
          path: '/profile',
          name: 'profile',
          component: Profile,
          meta: { requiresAuth: true},
          props: true
        },
        {
          path: '/user',
          name: 'user',
          component: User,
          meta: { requiresAuth: true},
          props: true
        },
        {
          path: '/reports',
          name: 'reports',
          component: ReportView,
          meta: { requiresAuth: true},
          props: true,
        },
      ],
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: Unauthorized
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ],
})

router.beforeEach(async (to) => {
  // Get current user
  const { data: { user }, error } = await supabase.auth.getUser()
  
  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // If route is protected and no user is logged in
  if (requiresAuth && !user) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }
  
  // If user is logged in but tries to access auth pages
  if ((to.path === '/login' || to.path === '/register') && user) {
    return '/dashboard'
  }
  
  // Optional: Check for specific roles if needed
  if (to.meta.roles) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      
    if (!to.meta.roles.includes(profile?.role)) {
      return '/unauthorized'
    }
  }
})

export default router