<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormInput from '@/components/FormInput.vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { usersService } from '@/services/api'
import type { User } from '@/types/api.types'

const route = useRoute()
const router = useRouter()
const { success, error: showError } = useToast()
const authStore = useAuthStore()

const userId = ref(route.params.id as string)
const isLoading = ref(false)
const isSubmitting = ref(false)

const userData = ref({
  nis: '',
  nama_lengkap: '',
  password: '', // Optional for update
  role: 'voter' as 'voter' | 'admin',
  class: '',
  gender: 'L' as 'L' | 'P',
  status: 'active' as 'active' | 'inactive',
})

onMounted(() => {
  // Load user data based on ID
  loadUserData()
})

const loadUserData = async () => {
  isLoading.value = true
  try {
    const user = await usersService.getUser(userId.value)
    
    // Map API data to form data
    userData.value = {
      nis: user.nis,
      nama_lengkap: user.nama_lengkap,
      password: '', // Don't show existing password
      role: user.role,
      class: user.class || '',
      gender: user.gender,
      status: user.status,
    }
  } catch (err: any) {
    showError(err.message || 'Gagal memuat data user')
    router.push('/users')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!userData.value.nis || !userData.value.nama_lengkap) {
    showError('NIS dan nama lengkap harus diisi')
    return
  }

  isSubmitting.value = true
  try {
    // Prepare update data (exclude password if empty)
    const updateData: Partial<User> = {
      nis: userData.value.nis,
      nama_lengkap: userData.value.nama_lengkap,
      role: userData.value.role,
      class: userData.value.class || null,
      gender: userData.value.gender,
      status: userData.value.status,
    }

    // Only include password if it's provided
    if (userData.value.password) {
      updateData.password = userData.value.password
    }

    await usersService.updateUser(userId.value, updateData)
    success('User berhasil diperbarui!')
    router.push('/users')
  } catch (err: any) {
    showError(err.message || 'Gagal memperbarui user')
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
              v-model="userData.nis"
              label="NIS"
              type="text"
              placeholder="Masukkan NIS"
              required
            />

            <FormInput
              v-model="userData.nama_lengkap"
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              required
            />

            <FormInput
              v-model="userData.password"
              label="Password (Opsional)"
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah"
            />

            <FormInput
              v-model="userData.class"
              label="Kelas"
              type="text"
              placeholder="Contoh: XI PPLG 1"
            />

            <div>
              <label class="block text-sm font-medium text-text-dark mb-2">Role</label>
              <select
                v-model="userData.role"
                class="w-full px-3 py-2 border border-divider rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="voter">Voter</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-text-dark mb-2">Jenis Kelamin</label>
              <select
                v-model="userData.gender"
                class="w-full px-3 py-2 border border-divider rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

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
