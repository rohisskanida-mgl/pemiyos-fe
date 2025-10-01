<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { success, error } = useToast()
const authStore = useAuthStore()

const loginData = ref({
  username: '',
  password: '',
})

const handleLogin = async () => {
  if (!loginData.value.username || !loginData.value.password) {
    error('Username dan password harus diisi')
    return
  }

  try {
    const loginSuccess = await authStore.login(loginData.value)

    if (loginSuccess) {
      success('Login berhasil!')
      router.push('/profile')
    } else {
      error(authStore.error || 'Login gagal. Periksa username dan password Anda.')
    }
  } catch {
    error('Login gagal. Periksa username dan password Anda.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-light-bg flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Illustration -->
      <div class="text-center mb-8">
        <div
          class="w-48 h-48 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-lg"
        >
          <!-- Login Illustration Image -->
          <img
            src="/login-illustration.png"
            alt="Login Illustration"
            class="w-32 h-32 object-contain"
          />
        </div>
        <h1 class="text-2xl font-bold text-text-dark mb-2">Masuk Sekarang</h1>
        <p class="text-text-dark">Silakan Melakukan Login Untuk Melanjutkan</p>
      </div>

      <!-- Login Form -->
      <div class="space-y-4">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Username Field -->
          <div>
            <label class="block text-sm font-medium text-text-dark mb-2">Username</label>
            <input
              v-model="loginData.username"
              type="text"
              placeholder="Username"
              required
              class="w-full px-4 py-3 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-text-light"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-medium text-text-dark mb-2">Password</label>
            <input
              v-model="loginData.password"
              type="password"
              placeholder="******"
              required
              class="w-full px-4 py-3 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-text-light"
            />
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-3 bg-primary text-text-light rounded-lg font-medium hover:brightness-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <span v-if="authStore.isLoading">Memproses...</span>
            <span v-else>Masuk</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
