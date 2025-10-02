<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Users, AlertCircle, Check, Loader2 } from 'lucide-vue-next'
import { useVotingStore } from '@/stores/voting'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const votingStore = useVotingStore()
const { error: showError } = useToast()

// Computed properties for reactive data
const votingPositions = computed(() => {
  return votingStore.activePositions.map(position => ({
    id: position.positionId,
    title: position.title,
    candidatesCount: position.candidatesCount,
    voted: votingStore.hasVotedForPosition(position.positionId),
  }))
})

const isLoading = computed(() => votingStore.isLoading)
const hasError = computed(() => votingStore.error)

// Load voting data on component mount
onMounted(async () => {
  try {
    await votingStore.loadVotingData()
  } catch {
    showError('Failed to load voting data')
  }
})

const handlePositionSelect = (positionId: number) => {
  router.push(`/candidate-selection/${positionId}`)
}

const retryLoading = async () => {
  votingStore.clearError()
  try {
    await votingStore.loadVotingData()
  } catch {
    showError('Failed to load voting data')
  }
}
</script>

<template>
  <div class="min-h-screen bg-light-bg">
    <!-- Content Area -->
    <div class="p-4 space-y-4">
      <!-- Loading State -->
      <div v-if="isLoading && votingPositions.length === 0" class="flex flex-col items-center justify-center py-12">
        <Loader2 class="w-8 h-8 text-primary animate-spin mb-4" />
        <p class="text-text-dark">Memuat data voting...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError && votingPositions.length === 0" class="bg-white rounded-xl shadow-sm p-6 text-center">
        <AlertCircle class="w-12 h-12 text-error mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-text-dark mb-2">Gagal Memuat Data</h3>
        <p class="text-text-muted mb-4">{{ hasError }}</p>
        <button 
          @click="retryLoading"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-95 transition-all"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && votingPositions.length === 0" class="bg-white rounded-xl shadow-sm p-6 text-center">
        <Users class="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-text-dark mb-2">Tidak Ada Posisi Voting</h3>
        <p class="text-text-muted">Belum ada posisi voting yang tersedia saat ini.</p>
      </div>

      <!-- Position Cards -->
      <div
        v-for="position in votingPositions"
        :key="position.id"
        class="bg-white rounded-xl shadow-sm p-4"
      >
        <!-- Card Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-text-dark">{{ position.title }}</h3>
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center"
            :class="position.voted ? 'bg-success-accent' : 'bg-info-accent'"
          >
            <AlertCircle v-if="!position.voted" class="w-4 h-4 text-white" />
            <Check v-else class="w-4 h-4 text-white" />
          </div>
        </div>

        <!-- Candidate Info -->
        <div class="flex items-center space-x-3 mb-4">
          <div class="flex -space-x-2">
            <div
              v-for="i in 3"
              :key="i"
              class="w-8 h-8 bg-text-dark rounded-full flex items-center justify-center"
            >
              <Users class="w-4 h-4 text-white" />
            </div>
          </div>
          <span class="text-text-dark font-medium">{{ position.candidatesCount }} Kandidat</span>
        </div>

        <!-- Select Button -->
        <button
          class="w-full py-3 bg-primary text-white font-medium rounded-lg hover:brightness-95 transition-all"
          @click="handlePositionSelect(position.id)"
        >
          Pilih
        </button>
      </div>
    </div>

  </div>
</template>
