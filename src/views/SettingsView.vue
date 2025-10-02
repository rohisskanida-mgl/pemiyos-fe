<script setup lang="ts">
import { ref } from 'vue'
import FormInput from '@/components/FormInput.vue'
import { useToast } from '@/composables/useToast'

const { success, error } = useToast()

// Form data - Only Nama Lengkap and Password
const formData = ref({
  nama_lengkap: '',
  password: '',
})

const formErrors = ref({
  nama_lengkap: '',
  password: '',
})

// Form validation
const validateForm = () => {
  formErrors.value = { nama_lengkap: '', password: '' }

  if (!formData.value.nama_lengkap) {
    formErrors.value.nama_lengkap = 'Nama lengkap harus diisi'
  }

  if (!formData.value.password) {
    formErrors.value.password = 'Password harus diisi'
  } else if (formData.value.password.length < 6) {
    formErrors.value.password = 'Password minimal 6 karakter'
  }

  return !Object.values(formErrors.value).some((error) => error !== '')
}

const handleSubmit = () => {
  if (validateForm()) {
    success('Data berhasil disimpan!')
    // Handle form submission here
  } else {
    error('Mohon perbaiki error pada form')
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-text-dark mb-6">Settings</h1>

    <!-- Form Components Demo -->
    <div class="space-y-6">
      <!-- Account Settings Form -->
      <div class="bg-text-light rounded-lg p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-text-dark mb-4">Account Settings</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <FormInput
            v-model="formData.nama_lengkap"
            label="Nama Lengkap"
            type="text"
            placeholder="Masukkan nama lengkap"
            :error="formErrors.nama_lengkap"
            required
          />

          <FormInput
            v-model="formData.password"
            label="Password"
            type="password"
            placeholder="Minimal 6 karakter"
            :error="formErrors.password"
            required
          />

          <button
            type="submit"
            class="w-full py-3 bg-info-accent text-text-light rounded-lg font-medium hover:brightness-95 transition-colors"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>

      <!-- File Upload Demo - Temporarily hidden (not working properly)
      <div class="bg-text-light rounded-lg p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-text-dark mb-4">Upload Data</h2>
        <p class="text-sm text-text-dark mb-4">Upload file Excel untuk mengimpor data kandidat</p>

        <FileUpload @file-select="handleFileSelect" @file-clear="handleFileClear" />
      </div>
      -->

      <!-- Filter Demo - Temporarily hidden (not working properly)
      <div class="bg-text-light rounded-lg p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-text-dark mb-4">Filter Data</h2>
        <p class="text-sm text-text-dark mb-4">
          Gunakan filter untuk mencari data berdasarkan kriteria tertentu
        </p>

        <button
          @click="showFilterModal = true"
          class="px-4 py-2 bg-secondary text-text-light rounded-lg hover:brightness-95 transition-colors"
        >
          Buka Filter
        </button>
      </div>
      -->
    </div>

    <!-- Filter Modal - Temporarily hidden (not working properly)
    <FilterModal
      :is-open="showFilterModal"
      @close="showFilterModal = false"
      @apply="handleFilterApply"
      @reset="handleFilterReset"
    />
    -->
  </div>
</template>
