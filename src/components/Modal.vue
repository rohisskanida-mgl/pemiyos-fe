<script lang="ts">
export default {
  name: 'ConfirmModal'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  isOpen: boolean
  type?: 'info' | 'confirm'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  type: 'info',
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const backdropClasses = computed(() => [
  'fixed inset-0 bg-dark-bg/50 transition-opacity duration-300 ease-in-out z-40',
  props.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
])

const sheetClasses = computed(() => [
  'fixed left-0 right-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out',
  props.isOpen ? 'translate-y-0' : 'translate-y-full',
])
</script>

<template>
  <!-- Backdrop -->
  <div :class="backdropClasses" @click="emit('close')" />

  <!-- Modal -->
  <div :class="sheetClasses">
    <div class="mx-auto bg-secondary rounded-2xl shadow-xl p-8">
      <!-- Handle -->
      <div class="h-1 w-12 bg-text-light rounded-full mx-auto mb-6" />

      <!-- Question mark icon -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-text-light rounded-full flex items-center justify-center">
          <span class="text-2xl font-bold text-text-dark">?</span>
        </div>
      </div>

      <!-- Title and Subtitle -->
      <div class="text-center mb-8">
        <h3 class="text-2xl font-bold text-text-light mb-2" v-if="title">{{ title }}</h3>
        <p class="text-lg text-text-light" v-if="subtitle">{{ subtitle }}</p>
      </div>

      <!-- Custom content slot -->
      <div class="mb-6">
        <slot />
      </div>

      <!-- Confirm actions -->
      <div v-if="type === 'confirm'" class="flex flex-col gap-3">
        <button
          class="px-6 py-3 rounded-lg border border-text-light text-text-light hover:bg-dark-bg transition-colors"
          @click="emit('close')"
        >
          Tidak
        </button>
        <button
          class="px-6 py-3 rounded-lg bg-primary text-text-light shadow-lg hover:brightness-95 transition-colors"
          @click="emit('confirm')"
        >
          Ya
        </button>
      </div>
    </div>
  </div>
</template>
