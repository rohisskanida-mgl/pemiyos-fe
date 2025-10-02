<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import Toast from './components/Toast.vue'
import { useToast } from './composables/useToast'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)
const currentPageTitle = ref('Dashboard')

// Hide navbar and sidebar on splash and login screens
const shouldShowNavbar = computed(() => {
  return route.name !== 'splash' && route.name !== 'login'
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const handleNavigation = (route: string) => {
  router.push(route)
  // Update page title based on route
  switch (route) {
    case '/':
      currentPageTitle.value = 'Splash'
      break
    case '/home':
      currentPageTitle.value = 'Home'
      break
    case '/profile':
      currentPageTitle.value = 'Profile'
      break
    case '/profile/edit':
      currentPageTitle.value = 'Edit Profile'
      break
    case '/vote':
      currentPageTitle.value = 'Voting'
      break
    case '/results':
      currentPageTitle.value = 'Results'
      break
    case '/settings':
      currentPageTitle.value = 'Settings'
      break
    case '/users':
      currentPageTitle.value = 'User Management'
      break
    case '/users/add':
      currentPageTitle.value = 'Add User'
      break
    default:
      currentPageTitle.value = 'Dashboard'
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="min-h-screen bg-light-bg text-text-dark">
    <!-- Toasts Renderer -->
    <div
      class="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center space-y-2 pointer-events-none"
    >
      <Toast
        v-for="t in toasts"
        :key="t.id"
        :id="t.id"
        :message="t.message"
        :type="t.type"
        @dismiss="dismiss"
      />
    </div>
    <!-- Navbar -->
    <Navbar
      v-if="shouldShowNavbar"
      :page-title="currentPageTitle"
      :username="authStore.userInfo.fullName || authStore.userInfo.nis"
      :user-role="authStore.userInfo.role === 'admin' ? 'Admin' : 'Voter'"
      @toggle-sidebar="toggleSidebar"
      @logout="handleLogout"
    />

    <!-- Sidebar -->
    <Sidebar
      v-if="shouldShowNavbar"
      :is-open="sidebarOpen"
      :username="authStore.userInfo.fullName || authStore.userInfo.nis"
      :user-role="authStore.userInfo.role === 'admin' ? 'Admin' : 'Voter'"
      @close="closeSidebar"
      @navigate="handleNavigation"
    />

    <!-- Main Content -->
    <main
      :class="[
        'min-h-screen',
        shouldShowNavbar ? 'pt-16' : '',
        route.name === 'results' ? 'w-full' : 'max-w-[430px] mx-auto'
      ]"
    >
      <RouterView />
    </main>
  </div>
</template>
