<script setup lang="ts">
import { ref, computed } from 'vue'
import { File, X } from 'lucide-vue-next'

interface Props {
  accept?: string
  maxSize?: number // in MB
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: '.xlsx,.xls',
  maxSize: 10, // 10MB default
  disabled: false,
})

const emit = defineEmits<{
  fileSelect: [file: File]
  fileClear: []
}>()

const isDragOver = ref(false)
const selectedFile = ref<File | null>(null)
const errorMessage = ref('')

const uploadClasses = computed(() => {
  const baseClasses =
    'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer'

  if (props.disabled) {
    return `${baseClasses} border-divider bg-light-bg cursor-not-allowed`
  }

  if (isDragOver.value) {
    return `${baseClasses} border-info-accent bg-info-accent/5`
  }

  if (errorMessage.value) {
    return `${baseClasses} border-error-accent bg-error-accent/5`
  }

  return `${baseClasses} border-divider hover:border-info-accent hover:bg-light-bg`
})

const isValidFile = (file: File): boolean => {
  const allowedTypes = ['.xlsx', '.xls']
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

  if (!allowedTypes.includes(fileExtension)) {
    errorMessage.value = 'Hanya file Excel (.xlsx, .xls) yang diperbolehkan'
    return false
  }

  if (file.size > props.maxSize * 1024 * 1024) {
    errorMessage.value = `Ukuran file maksimal ${props.maxSize}MB`
    return false
  }

  errorMessage.value = ''
  return true
}

const handleFileSelect = (file: File) => {
  if (props.disabled) return

  if (isValidFile(file)) {
    selectedFile.value = file
    emit('fileSelect', file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  if (props.disabled) return

  const files = event.dataTransfer?.files
  if (files && files.length > 0 && files[0]) {
    handleFileSelect(files[0])
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!props.disabled) {
    isDragOver.value = true
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0 && files[0]) {
    handleFileSelect(files[0])
  }
}

const handleUploadClick = () => {
  if (!props.disabled) {
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }
}

const clearFile = () => {
  selectedFile.value = null
  errorMessage.value = ''
  emit('fileClear')

  // Reset file input
  const fileInput = document.getElementById('file-input') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="space-y-2">
    <!-- Upload Area -->
    <div
      :class="uploadClasses"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @click="handleUploadClick"
    >
      <input
        id="file-input"
        type="file"
        :accept="accept"
        class="hidden"
        @change="handleFileInput"
      />

      <!-- Default State -->
      <div v-if="!selectedFile" class="space-y-3">
        <File class="w-12 h-12 mx-auto text-text-dark" />
        <div>
          <p class="text-sm font-medium text-text-dark">Pilih File Excel</p>
          <p class="text-xs text-text-dark mt-1">Drag & drop atau klik untuk memilih file</p>
          <p class="text-xs text-text-dark mt-1">Maksimal {{ maxSize }}MB</p>
        </div>
      </div>

      <!-- File Selected State -->
      <div v-else class="space-y-3">
        <File class="w-12 h-12 mx-auto text-success-accent" />
        <div>
          <p class="text-sm font-medium text-text-dark">{{ selectedFile.name }}</p>
          <p class="text-xs text-text-dark">
            {{ formatFileSize(selectedFile.size) }}
          </p>
        </div>
        <button
          @click.stop="clearFile"
          class="inline-flex items-center gap-1 px-3 py-1 text-xs text-error-accent hover:bg-error-accent/10 rounded-md transition-colors"
        >
          <X class="w-3 h-3" />
          Hapus
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="text-sm text-error-accent">
      {{ errorMessage }}
    </div>

    <!-- Help Text -->
    <p class="text-xs text-text-dark">Format yang didukung: .xlsx, .xls</p>
  </div>
</template>

<style scoped>
/* Smooth transitions for drag states */
.upload-area {
  transition: all 0.2s ease-in-out;
}
</style>
