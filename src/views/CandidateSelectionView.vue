<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'
import CandidateCarousel from '@/components/CandidateCarousel.vue'
import Accordion from '@/components/Accordion.vue'
import VoteButton from '@/components/VoteButton.vue'
import Modal from '@/components/Modal.vue'
import { useToast } from '@/composables/useToast'
import { useVotingStore } from '@/stores/voting'
import { useAuthStore } from '@/stores/auth'
import type { Candidate } from '@/types/api.types'

const router = useRouter()
const route = useRoute()
const { success, error: showError } = useToast()
const votingStore = useVotingStore()
const authStore = useAuthStore()

const positionId = computed(() => Number(route.params.id))
const showConfirmModal = ref(false)
const selectedCandidate = ref<Candidate | null>(null)
const selectedFocused = ref(0) // Start with first candidate
const isLoading = ref(false)
const isSubmitting = ref(false)
const hasVoted = ref(false)
const votedCandidateId = ref<string | null>(null)

// Candidates from store
const candidates = computed(() => {
  const positionCandidates = votingStore.candidatesByPosition[positionId.value] || []
  // Transform candidates for display - using the transformed structure
  return positionCandidates.map(candidate => ({
    id: candidate.id,  // Already transformed from _id
    name: candidate.name,
    positionNumber: candidate.positionNumber,  // Already transformed from candidate_number
    image: candidate.image && candidate.image.length > 0 ? candidate.image : [
      'https://via.placeholder.com/300x300/cccccc/666666?text=' + encodeURIComponent(candidate.name)
    ],
    profileHtml: `<p>${candidate.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - ${candidate.profile || 'Profil tidak tersedia'}</p>`,
    visionHtml: candidate.vision 
      ? `<p>${candidate.vision.split('\n').map(m => ` ${m}`).join('<br>')}</p>`
      : '<p>Visi tidak tersedia</p>',
    missionHtml: candidate.mission
      ? `<p>${candidate.mission.split('\n').map(m => ` ${m}`).join('<br>')}</p>`
      : '<p>Misi tidak tersedia</p>',
    programHtml: candidate.programKerja
      ? `<p>${candidate.programKerja.split('\n').map(p => ` ${p}`).join('<br>')}</p>`
      : '<p>Program kerja tidak tersedia</p>',
  }))
})

// Get position title from store
const currentPosition = computed(() => {
  return votingStore.positions.find(p => p.positionId === positionId.value) || null
})

const currentPositionTitle = computed(() => {
  return currentPosition.value?.title || 'Posisi Tidak Diketahui'
})

const currentCandidate = computed(() => {
  if (candidates.value.length === 0) {
    return null
  }
  return candidates.value[selectedFocused.value] || candidates.value[0]
})

// Load candidates and check if user has voted
onMounted(async () => {
  isLoading.value = true
  try {
    // Load candidates for this position
    await votingStore.loadCandidates(positionId.value)
    
    // Check if user has already voted for this position
    const userVotes = await votingStore.getUserVotes()
    const existingVote = userVotes.find(v => v.position_id === positionId.value)
    
    if (existingVote) {
      hasVoted.value = true
      votedCandidateId.value = existingVote.candidate_id
      // Find and select the voted candidate
      const votedIndex = candidates.value.findIndex(c => c.id === existingVote.candidate_id)
      if (votedIndex !== -1) {
        selectedFocused.value = votedIndex
      }
    }
  } catch (err: any) {
    showError(err.message || 'Failed to load candidates')
  } finally {
    isLoading.value = false
  }
})

const handleVote = (candidate: any) => {
  if (!candidate) return

  // Find the original candidate data using the transformed id
  const originalCandidate = votingStore.candidatesByPosition[positionId.value]?.find(
    c => c.id === candidate.id
  )
  if (originalCandidate) {
    selectedCandidate.value = originalCandidate
    showConfirmModal.value = true
  }
}

const confirmVote = async () => {
  if (!selectedCandidate.value) return
  
  isSubmitting.value = true
  try {
    await votingStore.submitVote(positionId.value, selectedCandidate.value.id)
    
    // Update UI to show vote has been cast/changed
    hasVoted.value = true
    votedCandidateId.value = selectedCandidate.value.id
    
    success(
      hasVoted.value 
        ? `Vote berhasil diubah ke ${selectedCandidate.value.name}!`
        : `Vote untuk ${selectedCandidate.value.name} berhasil!`
    )
    showConfirmModal.value = false
    
    // Stay on the page to allow changing vote
    // router.push('/vote')
  } catch (err: any) {
    showError(err.message || 'Gagal menyimpan vote')
  } finally {
    isSubmitting.value = false
  }
}

const cancelVote = () => {
  showConfirmModal.value = false
  selectedCandidate.value = null
}

const goBack = () => {
  router.push('/vote')
}

const goToPrevious = () => {
  if (candidates.value.length === 0) return
  selectedFocused.value =
    selectedFocused.value === 0 ? candidates.value.length - 1 : selectedFocused.value - 1
}

const goToNext = () => {
  if (candidates.value.length === 0) return
  selectedFocused.value = (selectedFocused.value + 1) % candidates.value.length
}

// For infinite rotation, navigation buttons are always enabled
const canGoPrevious = computed(() => candidates.value.length > 0)
const canGoNext = computed(() => candidates.value.length > 0)
</script>

<template>
  <div class="min-h-screen bg-light-bg flex flex-col">
    <!-- Header -->
    <div class="bg-secondary text-text-light mt-3 p-2">
      <div class="flex items-center justify-between">
        <div class="flex flex-row items-center gap-3">
          <button @click="goBack" class="p-2 rounded-lg hover:brightness-95 transition-colors">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <h1 class="text-xl font-semibold">{{ currentPositionTitle }}</h1>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <Loader2 class="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
        <p class="text-text-dark">Memuat data kandidat...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && candidates.length === 0" class="flex-1 flex items-center justify-center px-4">
      <div class="text-center">
        <p class="text-text-dark mb-4">Tidak ada kandidat untuk posisi ini</p>
        <button @click="goBack" class="px-4 py-2 bg-primary text-white rounded-lg">
          Kembali
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex-1 pb-20">
      <!-- Candidate Carousel -->
      <CandidateCarousel :candidates="candidates" v-model="selectedFocused" />

      <!-- Accordion -->
      <div class="px-4 mb-6">
        <Accordion v-if="currentCandidate" :candidate="currentCandidate" />
      </div>
    </div>

    <!-- Fixed Bottom Navigation and Vote -->
    <div class="fixed bottom-0 left-0 right-0 bg-text-light border-t border-divider px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Left Navigation -->
        <button
          @click="goToPrevious"
          :disabled="!canGoPrevious"
          class="w-12 h-12 rounded-full bg-light-bg flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft class="w-6 h-6 text-text-dark" />
        </button>

        <!-- Center Vote Button -->
        <div class="flex-1 max-w-xs mx-4">
          <button
            @click="handleVote(currentCandidate)"
            :disabled="isSubmitting || !currentCandidate"
            class="w-full py-3 px-6 rounded-lg font-medium transition-all"
            :class="[
              votedCandidateId === currentCandidate?.id
                ? 'bg-success-accent text-white'
                : hasVoted
                ? 'bg-warn-accent text-white hover:brightness-95'
                : 'bg-primary text-white hover:brightness-95'
            ]"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin" />
              Menyimpan...
            </span>
            <span v-else-if="votedCandidateId === currentCandidate?.id">
              ✓ Sudah Dipilih
            </span>
            <span v-else-if="hasVoted">
              Ubah Pilihan
            </span>
            <span v-else>
              Pilih Kandidat
            </span>
          </button>
        </div>

        <!-- Right Navigation -->
        <button
          @click="goToNext"
          :disabled="!canGoNext"
          class="w-12 h-12 rounded-full bg-light-bg flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight class="w-6 h-6 text-text-dark" />
        </button>
      </div>
    </div>

    <!-- Vote Confirmation Modal -->
    <Modal
      :is-open="showConfirmModal"
      title="Konfirmasi Vote"
      subtitle="Apakah Anda yakin ingin memilih kandidat ini?"
      type="confirm"
      @close="cancelVote"
      @confirm="confirmVote"
    >
      <div v-if="selectedCandidate" class="text-center py-4">
        <div
          class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3"
        >
          <span class="text-xl font-bold text-white">{{ selectedCandidate.name.charAt(0) }}</span>
        </div>
        <h3 class="font-semibold text-text-dark">{{ selectedCandidate.name }}</h3>
        <p class="text-sm text-text-dark">No. Urut {{ selectedCandidate.positionNumber }}</p>
      </div>
    </Modal>
  </div>
</template>
