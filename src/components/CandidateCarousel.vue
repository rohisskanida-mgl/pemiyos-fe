<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
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
const isTransitioning = ref(false)

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue !== selectedIndex.value) {
      isTransitioning.value = true
      selectedIndex.value = newValue
      await nextTick()
      setTimeout(() => {
        isTransitioning.value = false
      }, 300) // Match transition duration
    }
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
    const candidate = candidates[index]
    
    // Only add card if candidate exists
    if (candidate) {
      cards.push({
        candidate,
        originalIndex: index,
        displayIndex: i,
        position: i === 0 ? 'center' : i === 1 ? 'left' : 'right'
      })
    }
  }

  return cards
})

const handleCardClick = async (originalIndex: number) => {
  if (originalIndex === selectedIndex.value || isTransitioning.value) return
  
  isTransitioning.value = true
  selectedIndex.value = originalIndex
  emit('update:modelValue', originalIndex)
  
  await nextTick()
  setTimeout(() => {
    isTransitioning.value = false
  }, 300) // Match transition duration
}
</script>

<template>
  <div class="relative py-6 overflow-hidden">
    <!-- Container with max width and centered -->
    <div class="max-w-full mx-auto px-4">
      <div class="relative flex items-center justify-center min-h-[300px]">
        <!-- Carousel container with fixed width to prevent overflow -->
        <div class="relative w-full max-w-[600px] flex items-center justify-center">
          <!-- All cards positioned absolutely for smooth transitions -->
          <div 
            v-for="card in getRotationCards" 
            :key="card.originalIndex"
            class="absolute transition-all duration-500 ease-in-out cursor-pointer"
            :class="{
              // Center position
              'z-20 transform translate-x-0': card.position === 'center',
              // Left position  
              'z-10 transform -translate-x-32 scale-75 opacity-60': card.position === 'left',
              // Right position
              'z-10 transform translate-x-32 scale-75 opacity-60': card.position === 'right',
              // Disable pointer events during transition
              'pointer-events-none': isTransitioning
            }"
            @click="handleCardClick(card.originalIndex)"
          >
            <div 
              class="w-64 sm:w-72 md:w-80 transition-all duration-500"
              :class="{
                'hover:scale-105': card.position === 'center' && !isTransitioning,
                'hover:scale-80': card.position !== 'center' && !isTransitioning
              }"
            >
              <CandidateCard 
                :candidate="card.candidate" 
                :is-focused="card.position === 'center'" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation dots -->
    <div class="flex justify-center mt-4 gap-2">
      <button
        v-for="(candidate, index) in candidates"
        :key="candidate.id"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="{
          'bg-primary scale-125': index === selectedIndex,
          'bg-gray-300 hover:bg-gray-400': index !== selectedIndex
        }"
        @click="handleCardClick(index)"
      />
    </div>
  </div>
</template>

<style scoped>
/* Ensure smooth transitions and prevent layout shifts */
.carousel-container {
  perspective: 1000px;
}

/* Prevent text selection during transitions */
.carousel-container * {
  user-select: none;
}

/* Ensure cards don't cause horizontal overflow on small screens */
@media (max-width: 640px) {
  .absolute.transform.-translate-x-32 {
    transform: translateX(-6rem) scale(0.7);
  }
  
  .absolute.transform.translate-x-32 {
    transform: translateX(6rem) scale(0.7);
  }
}

@media (max-width: 480px) {
  .absolute.transform.-translate-x-32 {
    transform: translateX(-4rem) scale(0.6);
  }
  
  .absolute.transform.translate-x-32 {
    transform: translateX(4rem) scale(0.6);
  }
}
</style>
