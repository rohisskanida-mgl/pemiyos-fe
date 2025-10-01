<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download } from 'lucide-vue-next'
import FormInput from '@/components/FormInput.vue'
import FileUpload from '@/components/FileUpload.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { success, error } = useToast()

const activeTab = ref<'form' | 'excel'>('form')
const isLoading = ref(false)

// Form data
const formData = ref({
  username: '',
  password: '',
  fullName: '',
  email: '',
  phone: '',
  division: '',
  position: '',
})

const formErrors = ref({
  username: '',
  password: '',
  fullName: '',
  email: '',
  phone: '',
  division: '',
  position: '',
})

// Division and position options
const divisions = ['IT', 'Marketing', 'Finance', 'HR', 'Operations', 'Research']

const positions = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Anggota']

// Form validation
const validateForm = () => {
  formErrors.value = {
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    division: '',
    position: '',
  }

  let isValid = true

  if (!formData.value.username) {
    formErrors.value.username = 'Username harus diisi'
    isValid = false
  }

  if (!formData.value.password) {
    formErrors.value.password = 'Password harus diisi'
    isValid = false
  } else if (formData.value.password.length < 6) {
    formErrors.value.password = 'Password minimal 6 karakter'
    isValid = false
  }

  if (!formData.value.fullName) {
    formErrors.value.fullName = 'Nama lengkap harus diisi'
    isValid = false
  }

  if (!formData.value.email) {
    formErrors.value.email = 'Email harus diisi'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    formErrors.value.email = 'Format email tidak valid'
    isValid = false
  }

  if (!formData.value.phone) {
    formErrors.value.phone = 'Nomor telepon harus diisi'
    isValid = false
  }

  if (!formData.value.division) {
    formErrors.value.division = 'Divisi harus dipilih'
    isValid = false
  }

  if (!formData.value.position) {
    formErrors.value.position = 'Jabatan harus dipilih'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    error('Mohon perbaiki error pada form')
    return
  }

  isLoading.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    success('Pengguna berhasil ditambahkan!')
    router.push('/user-management')
  } catch (err) {
    error('Gagal menambahkan pengguna')
  } finally {
    isLoading.value = false
  }
}

const handleFileSelect = (file: File) => {
  success(`File ${file.name} berhasil dipilih`)
  // Handle Excel file processing here
}

const handleFileClear = () => {
  success('File berhasil dihapus')
}

const downloadTemplate = () => {
  success('Template Excel berhasil didownload')
  // Handle template download here
}

const goBack = () => {
  router.push('/user-management')
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button
        @click="goBack"
        class="p-2 rounded-lg bg-text-light border border-divider hover:bg-light-bg transition-colors"
      >
        <ArrowLeft class="w-5 h-5 text-text-dark" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-text-dark">Tambah Pengguna</h1>
        <p class="text-text-dark mt-1">Tambahkan pengguna baru ke sistem</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-text-light rounded-xl shadow-sm mb-6">
      <div class="flex border-b border-divider">
        <button
          @click="activeTab = 'form'"
          :class="[
            'flex-1 px-6 py-4 text-sm font-medium transition-colors',
            activeTab === 'form'
              ? 'text-info-accent border-b-2 border-info-accent'
              : 'text-text-dark hover:text-text-dark',
          ]"
        >
          Form
        </button>
        <button
          @click="activeTab = 'excel'"
          :class="[
            'flex-1 px-6 py-4 text-sm font-medium transition-colors',
            activeTab === 'excel'
              ? 'text-info-accent border-b-2 border-info-accent'
              : 'text-text-dark hover:text-text-dark',
          ]"
        >
          Excel
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Form Tab -->
        <div v-if="activeTab === 'form'">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                v-model="formData.username"
                label="Username"
                type="text"
                placeholder="Masukkan username"
                :error="formErrors.username"
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
            </div>

            <FormInput
              v-model="formData.fullName"
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              :error="formErrors.fullName"
              required
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                label="No HP"
                type="tel"
                placeholder="081234567890"
                :error="formErrors.phone"
                required
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-text-dark">
                  Divisi <span class="text-error-accent">*</span>
                </label>
                <select
                  v-model="formData.division"
                  class="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
                  :class="{ 'border-error-accent': formErrors.division }"
                >
                  <option value="">Pilih Divisi</option>
                  <option v-for="division in divisions" :key="division" :value="division">
                    {{ division }}
                  </option>
                </select>
                <div v-if="formErrors.division" class="text-sm text-error-accent">
                  {{ formErrors.division }}
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-text-dark">
                  Jabatan <span class="text-error-accent">*</span>
                </label>
                <select
                  v-model="formData.position"
                  class="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
                  :class="{ 'border-error-accent': formErrors.position }"
                >
                  <option value="">Pilih Jabatan</option>
                  <option v-for="position in positions" :key="position" :value="position">
                    {{ position }}
                  </option>
                </select>
                <div v-if="formErrors.position" class="text-sm text-error-accent">
                  {{ formErrors.position }}
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Excel Tab -->
        <div v-else>
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-text-dark mb-2">Upload File Excel</h3>
            <p class="text-text-dark mb-4">Upload file Excel yang berisi data pengguna</p>

            <button
              @click="downloadTemplate"
              class="inline-flex items-center gap-2 px-4 py-2 text-info-accent border border-info-accent rounded-lg hover:bg-info-accent/10 transition-colors"
            >
              <Download class="w-4 h-4" />
              Download Template Excel
            </button>
          </div>

          <FileUpload @file-select="handleFileSelect" @file-clear="handleFileClear" />
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end">
      <button
        @click="handleSubmit"
        :disabled="isLoading"
        class="px-6 py-3 bg-info-accent text-text-light rounded-lg font-medium hover:brightness-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Memproses...</span>
        <span v-else>Tambah</span>
      </button>
    </div>
  </div>
</template>
