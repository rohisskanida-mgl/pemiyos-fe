import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVotingStore, type Position, type Candidate, type Vote, type VotingStatus } from '@/stores/voting'
import { useToast } from './useToast'
import { useAuth } from './useAuth'

export function useVoting() {
  const votingStore = useVotingStore()
  const router = useRouter()
  const { success, error, warning } = useToast()
  const { isAuthenticated } = useAuth()

  // Computed properties
  const positions = computed(() => votingStore.positions)
  const candidates = computed(() => votingStore.candidates)
  const selectedVotes = computed(() => votingStore.selectedVotes)
  const votingStatus = computed(() => votingStore.votingStatus)
  const isLoading = computed(() => votingStore.isLoading)
  const votingError = computed(() => votingStore.error)

  const activePositions = computed(() => votingStore.activePositions)
  const votedPositions = computed(() => votingStore.votedPositions)
  const votingProgress = computed(() => votingStore.votingProgress)
  const isVotingComplete = computed(() => votingStore.isVotingComplete)

  // Voting actions
  const submitVote = async (positionId: number, candidateId: number): Promise<boolean> => {
    if (!isAuthenticated.value) {
      error('Anda harus login untuk melakukan voting')
      return false
    }

    try {
      const success = await votingStore.submitVote(positionId, candidateId)
      if (success) {
        success('Vote berhasil disimpan!')
        return true
      } else {
        error(votingStore.error || 'Gagal menyimpan vote')
        return false
      }
    } catch (err) {
      error('Terjadi kesalahan saat menyimpan vote')
      return false
    }
  }

  const removeVote = async (positionId: number): Promise<boolean> => {
    if (!isAuthenticated.value) {
      error('Anda harus login untuk mengubah vote')
      return false
    }

    try {
      const success = await votingStore.removeVote(positionId)
      if (success) {
        warning('Vote telah dihapus')
        return true
      } else {
        error(votingStore.error || 'Gagal menghapus vote')
        return false
      }
    } catch (err) {
      error('Terjadi kesalahan saat menghapus vote')
      return false
    }
  }

  const loadVotingData = async (): Promise<void> => {
    try {
      await votingStore.loadVotingData()
    } catch (err) {
      error('Gagal memuat data voting')
    }
  }

  const clearError = () => {
    votingStore.clearError()
  }

  const resetVotes = () => {
    votingStore.resetVotes()
    warning('Semua vote telah direset')
  }

  // Helper functions
  const getCandidatesByPosition = (positionId: number): Candidate[] => {
    return votingStore.getCandidatesByPosition(positionId)
  }

  const getVoteForPosition = (positionId: number): Vote | undefined => {
    return votingStore.getVoteForPosition(positionId)
  }

  const hasVotedForPosition = (positionId: number): boolean => {
    return votingStore.hasVotedForPosition(positionId)
  }

  const getPositionById = (positionId: number): Position | undefined => {
    return positions.value.find(p => p.id === positionId)
  }

  const getCandidateById = (candidateId: number): Candidate | undefined => {
    return candidates.value.find(c => c.id === candidateId)
  }

  // Voting status helpers
  const canVote = (): boolean => {
    return votingStatus.value.canVote && isAuthenticated.value
  }

  const hasVoted = (): boolean => {
    return votingStatus.value.hasVoted
  }

  const isVotingActive = (): boolean => {
    return votingStatus.value.votingPeriod === 'active'
  }

  const isVotingEnded = (): boolean => {
    return votingStatus.value.votingPeriod === 'ended'
  }

  const isVotingUpcoming = (): boolean => {
    return votingStatus.value.votingPeriod === 'upcoming'
  }

  const getRemainingTime = (): string | undefined => {
    return votingStatus.value.remainingTime
  }

  // Position helpers
  const getPositionTitle = (positionId: number): string => {
    const position = getPositionById(positionId)
    return position?.title || 'Unknown Position'
  }

  const getPositionDescription = (positionId: number): string | undefined => {
    const position = getPositionById(positionId)
    return position?.description
  }

  const isPositionActive = (positionId: number): boolean => {
    const position = getPositionById(positionId)
    return position?.isActive || false
  }

  // Candidate helpers
  const getCandidateName = (candidateId: number): string => {
    const candidate = getCandidateById(candidateId)
    return candidate?.name || 'Unknown Candidate'
  }

  const getCandidatePositionNumber = (candidateId: number): number => {
    const candidate = getCandidateById(candidateId)
    return candidate?.positionNumber || 0
  }

  const getCandidatePhotos = (candidateId: number): string[] => {
    const candidate = getCandidateById(candidateId)
    return candidate?.photos || []
  }

  const getCandidateProfile = (candidateId: number): string | undefined => {
    const candidate = getCandidateById(candidateId)
    return candidate?.profileHtml
  }

  const getCandidateVision = (candidateId: number): string | undefined => {
    const candidate = getCandidateById(candidateId)
    return candidate?.visionHtml
  }

  const getCandidateMission = (candidateId: number): string | undefined => {
    const candidate = getCandidateById(candidateId)
    return candidate?.missionHtml
  }

  const getCandidateProgram = (candidateId: number): string | undefined => {
    const candidate = getCandidateById(candidateId)
    return candidate?.programHtml
  }

  // Navigation helpers
  const goToVoting = () => {
    if (isAuthenticated.value) {
      router.push('/vote')
    } else {
      error('Anda harus login untuk mengakses halaman voting')
      router.push('/login')
    }
  }

  const goToCandidateSelection = (positionId: number) => {
    if (isAuthenticated.value) {
      const position = getPositionById(positionId)
      if (position) {
        router.push(`/vote/${position.title.toLowerCase().replace(/\s+/g, '-')}`)
      }
    } else {
      error('Anda harus login untuk mengakses halaman voting')
      router.push('/login')
    }
  }

  const goToResults = () => {
    if (isAuthenticated.value) {
      router.push('/results')
    } else {
      error('Anda harus login untuk mengakses hasil voting')
      router.push('/login')
    }
  }

  // Validation helpers
  const validateVote = (positionId: number, candidateId: number): boolean => {
    if (!isAuthenticated.value) {
      error('Anda harus login untuk melakukan voting')
      return false
    }

    if (!canVote()) {
      error('Voting tidak tersedia saat ini')
      return false
    }

    const position = getPositionById(positionId)
    if (!position || !position.isActive) {
      error('Posisi tidak valid atau tidak aktif')
      return false
    }

    const candidate = getCandidateById(candidateId)
    if (!candidate || !candidate.isActive || candidate.positionId !== positionId) {
      error('Kandidat tidak valid atau tidak aktif')
      return false
    }

    return true
  }

  const canChangeVote = (positionId: number): boolean => {
    return isVotingActive() && hasVotedForPosition(positionId)
  }

  return {
    // State
    positions,
    candidates,
    selectedVotes,
    votingStatus,
    isLoading,
    votingError,
    activePositions,
    votedPositions,
    votingProgress,
    isVotingComplete,

    // Actions
    submitVote,
    removeVote,
    loadVotingData,
    clearError,
    resetVotes,

    // Helper functions
    getCandidatesByPosition,
    getVoteForPosition,
    hasVotedForPosition,
    getPositionById,
    getCandidateById,

    // Voting status helpers
    canVote,
    hasVoted,
    isVotingActive,
    isVotingEnded,
    isVotingUpcoming,
    getRemainingTime,

    // Position helpers
    getPositionTitle,
    getPositionDescription,
    isPositionActive,

    // Candidate helpers
    getCandidateName,
    getCandidatePositionNumber,
    getCandidatePhotos,
    getCandidateProfile,
    getCandidateVision,
    getCandidateMission,
    getCandidateProgram,

    // Navigation helpers
    goToVoting,
    goToCandidateSelection,
    goToResults,

    // Validation helpers
    validateVote,
    canChangeVote,
  }
}
