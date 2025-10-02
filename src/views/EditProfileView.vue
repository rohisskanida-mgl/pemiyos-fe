<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '@/components/FormInput.vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { usersService } from '@/services/api'
import type { User } from '@/types/api.types'

const router = useRouter()
const { success, error: showError } = useToast()
const authStore = useAuthStore()

const isSubmitting = ref(false)
const isLoading = ref(false)

const profileData = ref({
  nis: '',
  nama_lengkap: '',
  password: '', // Optional for update
  class: '',
  gender: 'L' as 'L' | 'P',
})

const classOptions = [
  'X PPLG 1', 'X PPLG 2', 'X PPLG 3',
  'X PM 1', 'X PM 2',
  'X MPLB 1', 'X MPLB 2', 'X MPLB 3',
  'X AKL 1', 'X AKL 2', 'X AKL 3',
  'XI PPLG 1', 'XI PPLG 2', 'XI PPLG 3',
  'XI PM 1', 'XI PM 2',
  'XI MPLB 1', 'XI MPLB 2', 'XI MPLB 3',
  'XI AKL 1', 'XI AKL 2', 'XI AKL 3',
  'XII PPLG 1', 'XII PPLG 2', 'XII PPLG 3',
  'XII PM 1', 'XII PM 2',
  'XII MPLB 1', 'XII MPLB 2', 'XII MPLB 3',
  'XII AKL 1', 'XII AKL 2', 'XII AKL 3',
]

onMounted(async () => {
  // Load current user data from API
  isLoading.value = true
  try {
    const response = await usersService.getCurrentUser()
    const user = response.data
    
    profileData.value = {
      nis: user.nis,
      nama_lengkap: user.nama_lengkap,
      password: '', // Don't show existing password
      class: user.class || '',
      gender: user.gender,
    }
  } catch (err: any) {
    showError('Gagal memuat data profil')
    router.push('/profile')
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  if (!profileData.value.nama_lengkap) {
    showError('Nama lengkap harus diisi')
    return
  }

  isSubmitting.value = true

  try {
    // Prepare update data (exclude password if empty)
    const updateData: Partial<User> = {
      nis: profileData.value.nis,
      nama_lengkap: profileData.value.nama_lengkap,
      class: profileData.value.class || null,
      gender: profileData.value.gender,
    }

    // Only include password if it's provided
    if (profileData.value.password) {
      updateData.password = profileData.value.password
    }

    // Get current user ID from auth store
    const userId = authStore.userInfo._id
    
    await usersService.updateUser(userId, updateData)
    
    // Update auth store with new data
    await authStore.refreshProfile()
    
    success('Profil berhasil diperbarui')
    router.push('/profile')
  } catch (err: any) {
    showError(err.response?.data?.error || 'Gagal memperbarui profil')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="min-h-screen bg-light-bg p-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="bg-text-light rounded-xl shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-text-dark">Edit Profil</h1>
            <p class="text-text-dark mt-1">Perbarui informasi profil Anda</p>
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
          <div class="space-y-4">
            <FormInput
              v-model="profileData.nis"
              label="NIS"
              type="text"
              placeholder="NIS"
              disabled
            />

            <FormInput
              v-model="profileData.nama_lengkap"
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              required
            />

            <FormInput
              v-model="profileData.password"
              label="Password Baru (Opsional)"
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah"
            />

            <div>
              <label class="block text-sm font-medium text-text-dark mb-2">Kelas</label>
              <select
                v-model="profileData.class"
                class="w-full px-3 py-2 border border-divider rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Pilih Kelas (Opsional)</option>
                <option v-for="cls in classOptions" :key="cls" :value="cls">
                  {{ cls }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-text-dark mb-2">Jenis Kelamin</label>
              <select
                v-model="profileData.gender"
                class="w-full px-3 py-2 border border-divider rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
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
