<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormInput from '@/components/FormInput.vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const { success, error } = useToast()
const authStore = useAuthStore()

const userId = ref(route.params.id as string)
const isLoading = ref(false)
const isSubmitting = ref(false)

const userData = ref({
  username: '',
  fullName: '',
  email: '',
  phone: '',
  role: 'User' as 'Admin' | 'User',
  year: '',
  division: '',
  position: '',
  status: 'active' as 'active' | 'inactive',
})

onMounted(() => {
  // Load user data based on ID
  loadUserData()
})

const loadUserData = async () => {
  isLoading.value = true
  try {
    // Simulate API call to get user data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data
    userData.value = {
      username: 'user123',
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '081234567890',
      role: 'User',
      year: '2024/2025',
      division: 'Marketing',
      position: 'Anggota',
      status: 'active',
    }
  } catch (err) {
    error('Gagal memuat data pengguna')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!userData.value.username || !userData.value.fullName || !userData.value.email) {
    error('Username, nama lengkap, dan email harus diisi')
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call to update user
    await new Promise((resolve) => setTimeout(resolve, 1000))

    success('Data pengguna berhasil diperbarui')
    router.push('/users')
  } catch (err) {
    error('Gagal memperbarui data pengguna')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/users')
}
</script>

<template>
  <div class="min-h-screen bg-light-bg p-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="bg-text-light rounded-xl shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-text-dark">Edit Pengguna</h1>
            <p class="text-text-dark mt-1">Perbarui informasi pengguna</p>
          </div>
          <button
            @click="handleCancel"
            class="px-4 py-2 text-text-dark hover:text-text-dark transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p class="text-text-dark mt-2">Memuat data...</p>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              v-model="userData.username"
              label="Username"
              type="text"
              placeholder="Masukkan username"
              required
            />

            <FormInput
              v-model="userData.fullName"
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              required
            />

            <FormInput
              v-model="userData.email"
              label="Email"
              type="email"
              placeholder="Masukkan email"
              required
            />

            <FormInput
              v-model="userData.phone"
              label="Nomor Telepon"
              type="tel"
              placeholder="Masukkan nomor telepon"
            />

            <div>
              <label class="block text-sm font-medium text-text-dark mb-2">Role</label>
              <select
                v-model="userData.role"
                class="w-full px-3 py-2 border border-divider rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <FormInput v-model="userData.year" label="Tahun" type="text" placeholder="2024/2025" />

            <FormInput
              v-model="userData.division"
              label="Divisi"
              type="text"
              placeholder="Masukkan divisi"
            />

            <FormInput
              v-model="userData.position"
              label="Posisi"
              type="text"
              placeholder="Masukkan posisi"
            />

            <div>
              <label class="block text-sm font-medium text-text-dark mb-2">Status</label>
              <select
                v-model="userData.status"
                class="w-full px-3 py-2 border border-divider rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              @click="handleCancel"
              class="px-6 py-2 text-text-dark hover:text-text-dark transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-primary text-text-light rounded-lg hover:brightness-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">Menyimpan...</span>
              <span v-else>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
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
