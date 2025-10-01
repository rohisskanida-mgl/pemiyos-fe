<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  onPrevious: () => void
  onNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex items-center justify-center gap-4">
    <!-- Previous Button -->
    <button
      class="w-12 h-12 rounded-full bg-light-bg flex items-center justify-center hover:bg-primary transition-colors"
      :disabled="!canGoPrevious"
      @click="onPrevious"
    >
      <ChevronLeft class="w-6 h-6 text-text-dark" />
    </button>

    <!-- Next Button -->
    <button
      class="w-12 h-12 rounded-full bg-light-bg flex items-center justify-center hover:bg-primary transition-colors"
      :disabled="!canGoNext"
      @click="onNext"
    >
      <ChevronRight class="w-6 h-6 text-text-dark" />
    </button>
  </div>
</template>
