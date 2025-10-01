<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-vue-next'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Props {
  id: number
  message: string
  type?: ToastType
  durationMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  durationMs: 3000,
})

const emit = defineEmits<{
  dismiss: [id: number]
}>()

const typeToIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircle
    case 'error':
      return XCircle
    case 'warning':
      return AlertTriangle
    default:
      return Info
  }
})

const typeToClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-success-accent text-white'
    case 'error':
      return 'bg-error-accent text-white'
    case 'warning':
      return 'bg-warn-accent text-text-dark'
    default:
      return 'bg-info-accent text-white'
  }
})

onMounted(() => {
  setTimeout(() => emit('dismiss', props.id), props.durationMs)
})
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
    <div
      class="mt-4 px-4 w-full max-w-[430px] transition-transform duration-300 ease-in-out transform"
    >
      <div
        :class="[
          'rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 pointer-events-auto',
          typeToClasses,
        ]"
      >
        <component :is="typeToIcon" class="w-5 h-5" />
        <div class="flex-1 text-sm">{{ message }}</div>
        <button class="text-white/90 hover:text-white" @click="emit('dismiss', id)">×</button>
      </div>
    </div>
  </div>
</template>
