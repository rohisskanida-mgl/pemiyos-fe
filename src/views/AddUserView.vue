<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download, Loader2 } from 'lucide-vue-next'
import FormInput from '@/components/FormInput.vue'
import FileUpload from '@/components/FileUpload.vue'
import { useToast } from '@/composables/useToast'
import { usersService } from '@/services/api'
import type { User } from '@/types/api.types'

const router = useRouter()
const { success, error: showError } = useToast()

const activeTab = ref<'form' | 'excel'>('form')
const isLoading = ref(false)

// Form data
const formData = ref({
  nis: '',
  password: '',
  nama_lengkap: '',
  class: '',
  gender: 'L' as 'L' | 'P',
  role: 'voter' as 'voter' | 'admin',
  status: 'active' as 'active' | 'inactive',
})

const formErrors = ref({
  nis: '',
  password: '',
  nama_lengkap: '',
  class: '',
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
];


// Form validation
const validateForm = () => {
  formErrors.value = {
    nis: '',
    password: '',
    nama_lengkap: '',
    class: '',
  }

  let isValid = true

  if (!formData.value.nis) {
    formErrors.value.nis = 'NIS harus diisi'
    isValid = false
  }

  if (!formData.value.password) {
    formErrors.value.password = 'Password harus diisi'
    isValid = false
  } else if (formData.value.password.length < 6) {
    formErrors.value.password = 'Password minimal 6 karakter'
    isValid = false
  }

  if (!formData.value.nama_lengkap) {
    formErrors.value.nama_lengkap = 'Nama lengkap harus diisi'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Mohon perbaiki error pada form')
    return
  }

  isLoading.value = true

  try {
    const newUser: Omit<User, '_id' | 'created_at' | 'updated_at'> = {
      nis: formData.value.nis,
      password: formData.value.password,
      nama_lengkap: formData.value.nama_lengkap,
      role: formData.value.role,
      class: formData.value.class || null,
      gender: formData.value.gender,
      status: formData.value.status,
    }

    await usersService.createUser(newUser)
    success('Pengguna berhasil ditambahkan!')
    router.push('/users')
  } catch (err: any) {
    showError(err.response?.data?.error || 'Gagal menambahkan pengguna')
  } finally {
    isLoading.value = false
  }
}

const handleFileUpload = async (file: File) => {
  isLoading.value = true

  try {
    // Parse Excel file and bulk create users
    // This would require a library like xlsx to parse the file
    showError('Bulk upload belum diimplementasikan')
  } catch (err: any) {
    showError('Gagal memproses file')
  } finally {
    isLoading.value = false
  }
}

const handleFileClear = () => {
  success('File berhasil dihapus')
}

const downloadTemplate = () => {
  // Create and download Excel template
  const templateData = 'NIS,Password,Nama Lengkap,Kelas,Jenis Kelamin (L/P),Role (voter/admin)\n'
  const blob = new Blob([templateData], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'template_users.csv'
  a.click()
  URL.revokeObjectURL(url)
  success('Template berhasil didownload!')
}

const goBack = () => {
  router.push('/users')
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
                v-model="formData.nis"
                label="NIS"
                type="text"
                placeholder="Masukkan NIS"
                :error="formErrors.nis"
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
              v-model="formData.nama_lengkap"
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              :error="formErrors.nama_lengkap"
              required
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-text-dark">
                  Kelas
                </label>
                <select
                  v-model="formData.class"
                  class="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
                  :class="{ 'border-error-accent': formErrors.class }"
                >
                  <option value="">Pilih Kelas (Opsional)</option>
                  <option v-for="cls in classOptions" :key="cls" :value="cls">
                    {{ cls }}
                  </option>
                </select>
                <div v-if="formErrors.class" class="text-sm text-error-accent">
                  {{ formErrors.class }}
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-text-dark">
                  Jenis Kelamin <span class="text-error-accent">*</span>
                </label>
                <select
                  v-model="formData.gender"
                  class="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-text-dark">
                  Role <span class="text-error-accent">*</span>
                </label>
                <select
                  v-model="formData.role"
                  class="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
                >
                  <option value="voter">Voter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-text-dark">
                  Status <span class="text-error-accent">*</span>
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-4 py-3 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end mt-6">
              <button
                type="submit"
                :disabled="isLoading"
                class="px-6 py-3 bg-success-accent text-white rounded-lg hover:brightness-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                <span>{{ isLoading ? 'Menyimpan...' : 'Simpan Pengguna' }}</span>
              </button>
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

          <FileUpload @file-select="handleFileUpload" @file-clear="handleFileClear" />
        </div>
      </div>
    </div>

    <!-- Submit Button for Excel Tab -->
    <div v-if="activeTab === 'excel'" class="flex justify-end">
      <button
        @click="handleFileUpload"
        :disabled="isLoading"
        class="px-6 py-3 bg-info-accent text-text-light rounded-lg font-medium hover:brightness-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Memproses...</span>
        <span v-else>Tambah</span>
      </button>
    </div>
  </div>
</template>
