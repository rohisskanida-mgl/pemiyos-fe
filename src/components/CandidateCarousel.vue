<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import CandidateCard from '@/components/CandidateCard.vue'

interface Candidate {
  id: number
  name: string
  positionNumber: number
  image: string[]
  profileHtml?: string
  visionHtml?: string
  missionHtml?: string
  programHtml?: string
}

interface Props {
  candidates: Candidate[]
  modelValue: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const selectedIndex = ref(props.modelValue)

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    selectedIndex.value = newValue
  },
)

// Create rotation pattern: [0,1,2], [1,2,0], [2,0,1]
const getRotationCards = computed(() => {
  const { candidates } = props
  if (candidates.length === 0) return []

  const current = selectedIndex.value
  const total = candidates.length

  // Calculate the three cards to show based on current index
  const cards = []
  for (let i = 0; i < 3; i++) {
    const index = (current + i) % total
    cards.push({
      candidate: candidates[index],
      originalIndex: index,
      displayIndex: i,
    })
  }

  return cards
})

const handleCardClick = (originalIndex: number) => {
  selectedIndex.value = originalIndex
  emit('update:modelValue', originalIndex)
}
</script>

<template>
  <div class="relative py-6">
    <div class="flex items-center justify-center px-4">
      <div class="flex items-center gap-2 relative">
        <!-- Left card (displayIndex 1) -->
        <div
          v-if="getRotationCards[1]"
          :key="`${getRotationCards[1].originalIndex}-${getRotationCards[1].displayIndex}`"
          class="flex-shrink-0 transition-all duration-300 cursor-pointer w-60"
          @click="handleCardClick(getRotationCards[1].originalIndex)"
        >
          <CandidateCard :candidate="getRotationCards[1].candidate" :is-focused="false" />
        </div>

        <!-- Center card (displayIndex 0) - focused -->
        <div
          v-if="getRotationCards[0]"
          :key="`${getRotationCards[0].originalIndex}-${getRotationCards[0].displayIndex}`"
          class="flex-shrink-0 transition-all duration-300 cursor-pointer w-80 z-10"
          @click="handleCardClick(getRotationCards[0].originalIndex)"
        >
          <CandidateCard :candidate="getRotationCards[0].candidate" :is-focused="true" />
        </div>

        <!-- Right card (displayIndex 2) -->
        <div
          v-if="getRotationCards[2]"
          :key="`${getRotationCards[2].originalIndex}-${getRotationCards[2].displayIndex}`"
          class="flex-shrink-0 transition-all duration-300 cursor-pointer w-60"
          @click="handleCardClick(getRotationCards[2].originalIndex)"
        >
          <CandidateCard :candidate="getRotationCards[2].candidate" :is-focused="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No additional styles needed for the new centered layout */
</style>
