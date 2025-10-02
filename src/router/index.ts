import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SplashScreen from '@/views/SplashScreen.vue'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import EditProfileView from '@/views/EditProfileView.vue'
import VotingView from '@/views/VotingView.vue'
import CandidateSelectionView from '@/views/CandidateSelectionView.vue'
import ResultsView from '@/views/ResultsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import UserManagementView from '@/views/UserManagementView.vue'
import AddUserView from '@/views/AddUserView.vue'
import EditUserView from '@/views/EditUserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'splash',
      component: SplashScreen,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/edit',
      name: 'edit-profile',
      component: EditProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/vote',
      name: 'vote',
      component: VotingView,
      meta: { requiresAuth: true },
    },
    {
      path: '/candidate-selection/:id',
      name: 'candidate-selection',
      component: CandidateSelectionView,
      meta: { requiresAuth: true },
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'users',
      component: UserManagementView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/users/add',
      name: 'add-user',
      component: AddUserView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/users/:id/edit',
      name: 'edit-user',
      component: EditUserView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check if we need to validate authentication
  if (to.meta.requiresAuth || to.meta.requiresAdmin) {
    // First check if we have a valid token
    const hasValidToken = await authStore.checkAuth()

    if (!hasValidToken) {
      // No valid token, redirect to login
      next('/login')
      return
    }
  }

  // Get current authentication status after potential token validation
  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin
  const token = authStore.getToken()

  // Routes that require authentication
  if (to.meta.requiresAuth && (!isAuthenticated || !token)) {
    next('/login')
    return
  }

  // Routes that require admin role
  if (to.meta.requiresAdmin && (!isAuthenticated || !isAdmin || !token)) {
    // Redirect to profile if user is authenticated but not admin
    if (isAuthenticated && !isAdmin) {
      next('/profile')
      return
    }
    // Redirect to login if not authenticated
    next('/login')
    return
  }

  // Routes that require guest (not authenticated)
  if (to.meta.requiresGuest && isAuthenticated && token) {
    next('/profile')
    return
  }

  next()
})

export default router
