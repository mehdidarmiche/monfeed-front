import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/login/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue')
    },
    {
      path: '/dashboard/calendar',
      name: 'calendar',
      component: () => import('../views/dashboard/CalendarView.vue')
    },
    {
      path: '/dashboard/new-post',
      name: 'new-post',
      component: () => import('../views/dashboard/NewPostView.vue')
    },
    {
      path: '/dashboard/engagement',
      name: 'engagement',
      component: () => import('../views/dashboard/EngagementView.vue')
    },
    {
      path: '/dashboard/social-accounts',
      name: 'social-accounts',
      component: () => import('../views/dashboard/SocialAccountsView.vue')
    },
    {
      path: '/dashboard/settings',
      name: 'settings',
      component: () => import('../views/dashboard/SettingsView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt')

  if (to.path.startsWith('/dashboard')) {
    if (token) {
      next()
    } else {
      // Pas de token -> redirection vers /login
      next('/login')
    }
  } else {
    // Toutes les autres routes sont accessibles librement
    next()
  }
})

export default router
