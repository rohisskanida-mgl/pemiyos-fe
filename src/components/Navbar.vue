<script lang="ts">
export default {
  name: 'AppNavbar'
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, User, LogOut } from 'lucide-vue-next'

interface Props {
  pageTitle?: string
  username?: string
  userRole?: string
}

withDefaults(defineProps<Props>(), {
  pageTitle: 'Dashboard',
  username: 'John Doe',
  userRole: 'User',
})

const emit = defineEmits<{
  toggleSidebar: []
  logout: []
}>()

const router = useRouter()
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleLogout = () => {
  showDropdown.value = false
  emit('logout')
}

const handleProfile = () => {
  showDropdown.value = false
  router.push('/profile')
}

// Close dropdown when clicking outside
const closeDropdown = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    showDropdown.value = false
  }
}

// Add click outside listener
if (typeof window !== 'undefined') {
  document.addEventListener('click', closeDropdown)
}
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-40 bg-primary h-16 flex items-center justify-between px-4 safe-area-padding"
  >
    <!-- Burger Menu Button -->
    <button
      @click="emit('toggleSidebar')"
      class="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label="Toggle sidebar"
    >
      <Menu class="w-6 h-6 text-white" />
    </button>

    <!-- Page Title -->
    <h1 class="text-lg font-semibold text-white text-center flex-1 mx-4 truncate">
      {{ pageTitle }}
    </h1>

    <!-- Avatar Button with Dropdown -->
    <div class="dropdown-container relative">
      <button
        @click="toggleDropdown"
        class="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="User menu"
      >
        <User class="w-6 h-6 text-white" />
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showDropdown"
        class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-divider py-2 z-50"
      >
        <!-- Profile Option -->
        <button
          @click="handleProfile"
          class="w-full px-4 py-3 text-left hover:bg-light-bg transition-colors duration-200 flex items-center gap-3"
        >
          <User class="w-5 h-5 text-text-dark" />
          <div>
            <div class="font-medium text-text-dark">{{ username }}</div>
            <div class="text-sm text-text-dark">{{ userRole }}</div>
          </div>
        </button>

        <!-- Divider -->
        <div class="border-t border-divider my-1"></div>

        <!-- Logout Button -->
        <button
          @click="handleLogout"
          class="w-full px-4 py-3 text-left hover:bg-error-accent/10 transition-colors duration-200 flex items-center gap-3 text-error-accent"
        >
          <LogOut class="w-5 h-5" />
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-padding {
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
  padding-top: max(0.5rem, env(safe-area-inset-top));
}

/* Ensure dropdown appears above other content */
.dropdown-container {
  z-index: 1000;
}
</style>
