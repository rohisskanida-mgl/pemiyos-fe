<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '@/components/FormInput.vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { success, error } = useToast()
const authStore = useAuthStore()

const isSubmitting = ref(false)

const profileData = ref({
  fullName: '',
  email: '',
  phone: '',
  division: '',
  position: '',
})

onMounted(() => {
  // Load current user data
  if (authStore.user) {
    profileData.value = {
      fullName: authStore.user.fullName,
      email: authStore.user.email,
      phone: authStore.user.phone,
      division: authStore.user.division,
      position: authStore.user.position,
    }
  }
})

const handleSubmit = async () => {
  if (!profileData.value.fullName || !profileData.value.email) {
    error('Nama lengkap dan email harus diisi')
    return
  }

  isSubmitting.value = true

  try {
    const success = await authStore.updateProfile(profileData.value)

    if (success) {
      success('Profil berhasil diperbarui')
      router.push('/profile')
    } else {
      error('Gagal memperbarui profil')
    }
  } catch (err) {
    error('Gagal memperbarui profil')
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
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-4">
            <FormInput
              v-model="profileData.fullName"
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              required
            />

            <FormInput
              v-model="profileData.email"
              label="Email"
              type="email"
              placeholder="Masukkan email"
              required
            />

            <FormInput
              v-model="profileData.phone"
              label="Nomor Telepon"
              type="tel"
              placeholder="Masukkan nomor telepon"
            />

            <FormInput
              v-model="profileData.division"
              label="Divisi"
              type="text"
              placeholder="Masukkan divisi"
            />

            <FormInput
              v-model="profileData.position"
              label="Posisi"
              type="text"
              placeholder="Masukkan posisi"
            />
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
