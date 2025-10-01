<script setup lang="ts">
import { computed } from 'vue'
import {
  X,
  Home,
  BarChart3,
  Settings,
  User,
  Vote,
  Users,
  UserPlus,
  UserEdit,
} from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  username?: string
  userRole?: string
}

const props = withDefaults(defineProps<Props>(), {
  username: 'John Doe',
  userRole: 'User',
})

const emit = defineEmits<{
  close: []
  navigate: [route: string]
}>()

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home, route: '/home' },
  { id: 'profile', label: 'Profile', icon: User, route: '/profile' },
  { id: 'vote', label: 'Voting', icon: Vote, route: '/vote' },
  { id: 'results', label: 'Results', icon: BarChart3, route: '/results' },
  { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
  { id: 'users', label: 'User Management', icon: Users, route: '/users' },
  { id: 'add-user', label: 'Add User', icon: UserPlus, route: '/users/add' },
]

const handleBackdropClick = () => {
  emit('close')
}

const handleNavigation = (route: string) => {
  emit('navigate', route)
  emit('close')
}

const sidebarClasses = computed(() => {
  return [
    'z-50 fixed top-0 left-0 h-full w-80 bg-text-light shadow-xl transform transition-transform duration-300 ease-in-out z-40',
    props.isOpen ? 'translate-x-0' : '-translate-x-full',
  ]
})

const backdropClasses = computed(() => {
  return [
    'fixed inset-0 bg-dark-bg/50 transition-opacity duration-300 ease-in-out z-30',
    props.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
  ]
})
</script>

<template>
  <!-- Backdrop -->
  <div :class="backdropClasses" @click="handleBackdropClick" v-if="isOpen"></div>

  <!-- Sidebar -->
  <aside :class="sidebarClasses">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-divider">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <User class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="font-semibold text-text-dark">{{ username }}</h2>
          <p class="text-sm text-text-dark">{{ userRole }}</p>
        </div>
      </div>
      <button
        @click="emit('close')"
        class="p-2 rounded-lg hover:bg-light-bg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Close sidebar"
      >
        <X class="w-5 h-5 text-text-dark" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 py-4">
      <ul class="space-y-1">
        <li v-for="item in navigationItems" :key="item.id">
          <button
            @click="handleNavigation(item.route)"
            class="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-light-bg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-light-bg"
          >
            <component :is="item.icon" class="w-5 h-5 text-text-dark" />
            <span class="font-medium text-text-dark">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-6 border-t border-divider">
      <div class="text-xs text-text-dark text-center">PEMIYOS</div>
    </div>
  </aside>
</template>

<style scoped>
/* Ensure sidebar appears above other content */
aside {
  z-index: 40;
}

/* Smooth transitions for backdrop */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 300ms ease-in-out;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Smooth transitions for sidebar */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 300ms ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}
</style>
