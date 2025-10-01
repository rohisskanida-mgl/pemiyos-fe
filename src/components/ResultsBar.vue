<script setup lang="ts">
import { computed } from 'vue'

interface CandidateData {
  name: string
  percentage: number
  votes?: number
}

interface Props {
  data: CandidateData[]
  showWinnerHighlight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showWinnerHighlight: true,
})

// Sort data by percentage descending
const sortedData = computed(() => {
  return [...props.data].sort((a, b) => b.percentage - a.percentage)
})

// Get the winner (highest percentage)
const winner = computed(() => {
  if (sortedData.value.length === 0) return null
  return sortedData.value[0]
})

// Determine bar color based on whether it's the winner
const getBarColor = (candidate: CandidateData) => {
  if (props.showWinnerHighlight && candidate === winner.value) {
    return 'bg-success-accent'
  }

  // Use different colors for other candidates
  const colors = [
    'bg-primary',
    'bg-warn-accent',
    'bg-error-accent',
    'bg-info-accent',
    'bg-secondary',
  ]

  const index = sortedData.value.indexOf(candidate)
  return colors[index % colors.length] || 'bg-divider'
}

// Format percentage for display
const formatPercentage = (percentage: number) => {
  return `${percentage.toFixed(1)}%`
}
</script>

<template>
  <div class="bg-text-light rounded-xl shadow-sm p-4">
    <h3 class="text-lg font-semibold text-text-dark mb-4">Voting Results</h3>

    <div v-if="sortedData.length === 0" class="text-center text-text-dark py-8">
      <p>No data available</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="(candidate, index) in sortedData" :key="candidate.name" class="space-y-2">
        <!-- Candidate info -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-text-dark">{{ candidate.name }}</span>
            <span
              v-if="showWinnerHighlight && candidate === winner"
              class="text-xs bg-success-accent text-white px-2 py-1 rounded-full"
            >
              Winner
            </span>
          </div>
          <span class="text-sm font-semibold text-text-dark">
            {{ formatPercentage(candidate.percentage) }}
          </span>
        </div>

        <!-- Progress bar -->
        <div class="relative">
          <div class="w-full bg-divider rounded-full h-3 overflow-hidden">
            <div
              :class="[
                'h-full transition-all duration-500 ease-out rounded-full',
                getBarColor(candidate),
              ]"
              :style="{ width: `${Math.min(candidate.percentage, 100)}%` }"
            />
          </div>

          <!-- Percentage text overlay for small bars -->
          <div
            v-if="candidate.percentage < 15"
            class="absolute inset-0 flex items-center justify-center"
          >
            <span class="text-xs font-medium text-white drop-shadow-sm">
              {{ formatPercentage(candidate.percentage) }}
            </span>
          </div>
        </div>

        <!-- Additional info if votes are provided -->
        <div v-if="candidate.votes !== undefined" class="text-xs text-text-dark">
          {{ candidate.votes.toLocaleString() }} votes
        </div>
      </div>
    </div>

    <!-- Summary stats -->
    <div v-if="sortedData.length > 0" class="mt-6 pt-4 border-t border-divider">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-text-dark">Total Candidates:</span>
          <span class="font-medium text-text-dark ml-1">{{ sortedData.length }}</span>
        </div>
        <div>
          <span class="text-text-dark">Leading:</span>
          <span class="font-medium text-text-dark ml-1">{{ winner?.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth animation for progress bars */
.progress-bar {
  transition: width 0.5s ease-out;
}
</style>
