<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, RotateCcw } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  apply: [filters: FilterData]
  reset: []
}>()

interface FilterData {
  dateFrom: string
  dateTo: string
  sortBy: string
}

const dateFrom = ref('')
const dateTo = ref('')
const sortBy = ref('terbaru')

const quickFilters = [
  { key: 'today', label: 'Hari Ini' },
  { key: 'week', label: 'Minggu Ini' },
  { key: 'month', label: 'Bulan Ini' },
]

const sortOptions = [
  { value: 'terbaru', label: 'Terbaru ke Terlama' },
  { value: 'terlama', label: 'Terlama ke Terbaru' },
  { value: 'nama', label: 'Nama A-Z' },
  { value: 'nama_desc', label: 'Nama Z-A' },
]

const backdropClasses = computed(() => [
  'fixed inset-0 bg-dark-bg/50 transition-opacity duration-300 ease-in-out z-40',
  props.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
])

const sheetClasses = computed(() => [
  'fixed left-0 right-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out',
  props.isOpen ? 'translate-y-0' : 'translate-y-full',
])

const applyQuickFilter = (filter: string) => {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  switch (filter) {
    case 'today':
      dateFrom.value = startOfDay.toISOString().split('T')[0]
      dateTo.value = today.toISOString().split('T')[0]
      break
    case 'week':
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      dateFrom.value = startOfWeek.toISOString().split('T')[0]
      dateTo.value = today.toISOString().split('T')[0]
      break
    case 'month':
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      dateFrom.value = startOfMonth.toISOString().split('T')[0]
      dateTo.value = today.toISOString().split('T')[0]
      break
  }
}

const applyFilters = () => {
  const filters: FilterData = {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    sortBy: sortBy.value,
  }

  emit('apply', filters)
  emit('close')
}

const resetFilters = () => {
  dateFrom.value = ''
  dateTo.value = ''
  sortBy.value = 'terbaru'
  emit('reset')
}

const closeModal = () => {
  emit('close')
}

const handleBackdropClick = () => {
  closeModal()
}
</script>

<template>
  <!-- Backdrop -->
  <div :class="backdropClasses" @click="handleBackdropClick" />

  <!-- Bottom Sheet Modal -->
  <div :class="sheetClasses">
    <div class="max-w-[430px] mx-auto bg-white rounded-t-2xl shadow-xl p-6">
      <!-- Handle -->
      <div class="h-1 w-12 bg-divider rounded-full mx-auto mb-6" />

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-text-dark">Filter Data</h3>
        <button @click="closeModal" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <RotateCcw class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Date Range -->
      <div class="space-y-4 mb-6">
        <h4 class="text-sm font-medium text-text-dark">Rentang Tanggal</h4>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <label class="text-xs text-text-dark">Dari</label>
            <div class="relative">
              <input
                v-model="dateFrom"
                type="date"
                class="w-full px-3 py-2 text-sm border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
              />
              <Calendar
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-dark pointer-events-none"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs text-text-dark">Sampai</label>
            <div class="relative">
              <input
                v-model="dateTo"
                type="date"
                class="w-full px-3 py-2 text-sm border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
              />
              <Calendar
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-dark pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Filters -->
      <div class="space-y-4 mb-6">
        <h4 class="text-sm font-medium text-text-dark">Filter Cepat</h4>
        <div class="flex gap-2">
          <button
            v-for="filter in quickFilters"
            :key="filter.key"
            @click="applyQuickFilter(filter.key)"
            class="px-3 py-2 text-sm bg-secondary text-white rounded-lg hover:brightness-95 transition-colors"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Sort Options -->
      <div class="space-y-4 mb-6">
        <h4 class="text-sm font-medium text-text-dark">Urutkan</h4>
        <select
          v-model="sortBy"
          class="w-full px-3 py-2 text-sm border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-4 border-t border-divider">
        <button
          @click="resetFilters"
          class="flex-1 px-4 py-3 text-sm font-medium text-text-dark border border-divider rounded-lg hover:bg-light-bg transition-colors"
        >
          Reset All
        </button>
        <button
          @click="applyFilters"
          class="flex-1 px-4 py-3 text-sm font-medium text-white bg-info-accent rounded-lg hover:brightness-95 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>
