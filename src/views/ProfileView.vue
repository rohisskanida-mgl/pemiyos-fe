<script setup lang="ts">
import { useRouter } from 'vue-router'
import { User, Bell, LogOut, Edit3 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { success, error } = useToast()

const userData = {
  name: 'John Doe',
  role: 'Admin',
  year: '2024/2025',
  avatar: null,
}

const handleEditProfile = () => {
  router.push('/settings')
}

const handleHelp = () => {
  success('Fitur bantuan akan segera tersedia')
}

const handleLogout = () => {
  // Handle logout logic here
  success('Logout berhasil')
  router.push('/login')
}
</script>

<template>
  <div class="p-6">
    <!-- Avatar Section -->
    <div class="text-center mb-8">
      <div class="relative inline-block">
        <div
          class="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-3xl font-bold text-white">{{ userData.name.charAt(0) }}</span>
        </div>
        <button
          @click="handleEditProfile"
          class="absolute bottom-0 right-0 w-8 h-8 bg-info-accent rounded-full flex items-center justify-center hover:brightness-95 transition-colors"
        >
          <Edit3 class="w-4 h-4 text-white" />
        </button>
      </div>

      <h1 class="text-xl font-semibold text-text-dark">{{ userData.name }}</h1>
      <p class="text-sm text-text-dark">{{ userData.role }} • {{ userData.year }}</p>
    </div>

    <!-- Menu Cards -->
    <div class="space-y-4 mb-8">
      <!-- Akun Saya Card -->
      <div
        @click="handleEditProfile"
        class="bg-text-light rounded-xl shadow-sm p-4 flex items-center gap-4 hover:bg-light-bg transition-colors cursor-pointer"
      >
        <div class="w-12 h-12 bg-info-accent rounded-lg flex items-center justify-center">
          <User class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-text-dark">Akun Saya</h3>
          <p class="text-sm text-text-dark">Kelola informasi profil Anda</p>
        </div>
      </div>

      <!-- Bantuan & Saran Card -->
      <div
        @click="handleHelp"
        class="bg-text-light rounded-xl shadow-sm p-4 flex items-center gap-4 hover:bg-light-bg transition-colors cursor-pointer"
      >
        <div class="w-12 h-12 bg-warn-accent rounded-lg flex items-center justify-center">
          <Bell class="w-6 h-6 text-text-dark" />
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-text-dark">Bantuan & Saran</h3>
          <p class="text-sm text-text-dark">Dapatkan bantuan dan kirim saran</p>
        </div>
      </div>
    </div>

    <!-- Logout Button -->
    <button
      @click="handleLogout"
      class="w-full py-3 bg-error-accent text-text-light rounded-lg font-medium hover:brightness-95 transition-colors flex items-center justify-center gap-2"
    >
      <LogOut class="w-5 h-5" />
      Log Out
    </button>
  </div>
</template>
