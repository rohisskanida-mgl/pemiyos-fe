<script setup lang="ts">
import { ref } from 'vue'
import FormInput from '@/components/FormInput.vue'
import FileUpload from '@/components/FileUpload.vue'
import FilterModal from '@/components/FilterModal.vue'
import { useToast } from '@/composables/useToast'

const { success, error } = useToast()

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
})

const formErrors = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
})

const showFilterModal = ref(false)

// Form validation
const validateForm = () => {
  formErrors.value = { name: '', email: '', phone: '', password: '' }

  if (!formData.value.name) {
    formErrors.value.name = 'Nama harus diisi'
  }

  if (!formData.value.email) {
    formErrors.value.email = 'Email harus diisi'
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    formErrors.value.email = 'Format email tidak valid'
  }

  if (!formData.value.phone) {
    formErrors.value.phone = 'Nomor telepon harus diisi'
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

const handleFileSelect = (file: File) => {
  success(`File ${file.name} berhasil dipilih`)
}

const handleFileClear = () => {
  success('File berhasil dihapus')
}

const handleFilterApply = (filters: any) => {
  success('Filter berhasil diterapkan')
  console.log('Applied filters:', filters)
}

const handleFilterReset = () => {
  success('Filter berhasil direset')
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
            v-model="formData.name"
            label="Nama Lengkap"
            type="text"
            placeholder="Masukkan nama lengkap"
            :error="formErrors.name"
            required
          />

          <FormInput
            v-model="formData.email"
            label="Email"
            type="email"
            placeholder="contoh@email.com"
            :error="formErrors.email"
            required
          />

          <FormInput
            v-model="formData.phone"
            label="Nomor Telepon"
            type="tel"
            placeholder="081234567890"
            :error="formErrors.phone"
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

      <!-- File Upload Demo -->
      <div class="bg-text-light rounded-lg p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-text-dark mb-4">Upload Data</h2>
        <p class="text-sm text-text-dark mb-4">Upload file Excel untuk mengimpor data kandidat</p>

        <FileUpload @file-select="handleFileSelect" @file-clear="handleFileClear" />
      </div>

      <!-- Filter Demo -->
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
    </div>

    <!-- Filter Modal -->
    <FilterModal
      :is-open="showFilterModal"
      @close="showFilterModal = false"
      @apply="handleFilterApply"
      @reset="handleFilterReset"
    />
  </div>
</template>
