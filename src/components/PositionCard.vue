<script setup lang="ts">
import { computed } from 'vue'
import { Users, Info, Check } from 'lucide-vue-next'

interface Props {
  title: string
  candidatesCount: number
  voted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  voted: false,
})

const emit = defineEmits<{
  select: []
  info: []
}>()

const badgeClasses = computed(() => (props.voted ? 'text-success-accent' : 'text-text-dark'))
</script>

<template>
  <div
    class="relative bg-white rounded-xl shadow-sm p-4 border border-transparent hover:border-divider transition-colors"
  >
    <button
      class="absolute top-3 right-3 p-2 rounded-full hover:bg-light-bg"
      @click.stop="emit('info')"
      aria-label="Info"
    >
      <Info class="w-5 h-5 text-text-dark" />
    </button>

    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
        <Users class="w-6 h-6 text-white" />
      </div>
      <div class="flex-1">
        <h3 class="text-base font-semibold text-text-dark">{{ title }}</h3>
        <p class="text-sm text-text-dark">{{ candidatesCount }} kandidat</p>
      </div>

      <div v-if="props.voted" class="flex items-center gap-1 text-success-accent">
        <Check class="w-5 h-5" />
        <span class="text-sm font-medium">Voted</span>
      </div>
    </div>

    <div class="mt-4">
      <button
        class="px-4 py-2 rounded-lg bg-info-accent text-white font-medium hover:brightness-95"
        @click="emit('select')"
      >
        Pilih
      </button>
    </div>
  </div>
</template>
