<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Check if user is already authenticated
  const isAuthenticated = await authStore.checkAuth()

  // Show splash screen for 2 seconds
  setTimeout(() => {
    if (isAuthenticated) {
      router.push('/profile')
    } else {
      router.push('/login')
    }
  }, 2000)
})
</script>

<template>
  <div class="min-h-screen bg-light-bg flex items-center justify-center">
    <div class="text-center">
      <!-- Ballot Box Icon -->
      <div class="w-32 h-32 mx-auto flex items-center justify-center mb-8">
        <img src="/Logo IYOS.png" alt="Logo IYOS" class="w-32 h-32 object-contain" />
      </div>

      <!-- App Name -->
      <h1 class="text-4xl font-bold text-text-dark mb-4">PEMIYOS</h1>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
