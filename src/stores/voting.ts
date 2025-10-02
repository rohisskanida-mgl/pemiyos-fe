import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { votingService } from '@/services/api'
import { useAuthStore } from './auth'
import type { 
  Candidate as ApiCandidate, 
  Election
} from '@/types/api.types'

// Transform API types to local types
export interface Position {
  id: string
  positionId: number
  title: string
  description?: string
  candidatesCount: number
  isActive: boolean
  votingStartDate?: string
  votingEndDate?: string
}

export interface Candidate {
  id: string
  name: string
  positionNumber: number
  positionId: number
  image: string[]
  profile?: string
  vision?: string
  mission?: string
  programKerja?: string
  isActive: boolean
}

export interface Vote {
  positionId: number
  candidateId: string
  votedAt: string
}

export interface VotingStatus {
  hasVoted: boolean
  canVote: boolean
  votingPeriod: 'upcoming' | 'active' | 'ended'
  remainingTime?: string
}

export const useVotingStore = defineStore('voting', () => {
  
  // State
  const positions = ref<Position[]>([])
  const candidates = ref<Candidate[]>([])
  const currentElection = ref<Election | null>(null)
  const selectedVotes = ref<Map<number, Vote>>(new Map())
  const votingStatus = ref<VotingStatus>({
    hasVoted: false,
    canVote: true,
    votingPeriod: 'active',
    remainingTime: undefined,
  })
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Helper functions to transform API data
  const transformPosition = (apiPosition: Record<string, unknown> | Position): Position => {
    // If it's already a Position type, return it as is
    if ('id' in apiPosition && 'positionId' in apiPosition && 'title' in apiPosition) {
      return apiPosition as Position
    }
    
    // Otherwise, transform from API format
    return {
      id: String(apiPosition.id || apiPosition._id || ''),
      positionId: Number(apiPosition.positionId || apiPosition.position_id || 0),
      title: String(apiPosition.title || apiPosition.name || ''),
      description: apiPosition.description as string | undefined,
      candidatesCount: Number(apiPosition.candidatesCount || 0),
      isActive: Boolean(apiPosition.isActive !== undefined ? apiPosition.isActive : (apiPosition.status === 'active')),
      votingStartDate: apiPosition.votingStartDate as string | undefined,
      votingEndDate: apiPosition.votingEndDate as string | undefined,
    }
  }

  const transformCandidate = (apiCandidate: ApiCandidate): Candidate => {
    return {
      id: apiCandidate._id,
      name: apiCandidate.name,
      positionNumber: apiCandidate.candidate_number,
      positionId: apiCandidate.position_id,
      image: apiCandidate.image ? [apiCandidate.image] : [],
      profile: apiCandidate.profile,
      vision: apiCandidate.vision_mission?.vision,
      mission: apiCandidate.vision_mission?.mission,
      programKerja: apiCandidate.program_kerja,
      isActive: apiCandidate.status === 'active',
    }
  }

  // Getters
  const activePositions = computed(() => 
    positions.value.filter(position => position.isActive)
  )

  const votedPositions = computed(() => 
    Array.from(selectedVotes.value.keys())
  )

  const votingProgress = computed(() => {
    const totalPositions = activePositions.value.length
    const votedCount = votedPositions.value.length
    return {
      voted: votedCount,
      total: totalPositions,
      percentage: totalPositions > 0 ? (votedCount / totalPositions) * 100 : 0,
    }
  })

  const isVotingComplete = computed(() => 
    votedPositions.value.length === activePositions.value.length
  )

  const getCandidatesByPosition = computed(() => (positionId: number) => 
    candidates.value.filter(candidate => 
      candidate.positionId === positionId && candidate.isActive
    )
  )

  // Group candidates by position for easier access
  const candidatesByPosition = computed(() => {
    const grouped: Record<number, Candidate[]> = {}
    candidates.value.forEach(candidate => {
      if (!grouped[candidate.positionId]) {
        grouped[candidate.positionId] = []
      }
      const group = grouped[candidate.positionId]
      if (group) {
        group.push(candidate)
      }
    })
    return grouped
  })

  const getVoteForPosition = computed(() => (positionId: number) => 
    selectedVotes.value.get(positionId)
  )

  const hasVotedForPosition = computed(() => (positionId: number) => 
    selectedVotes.value.has(positionId)
  )

  // Actions
  const loadPositions = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await votingService.getPositions({ 
        status: 'active',
        limit: 'no_limit' 
      })
      
      const transformedPositions = response.data.map((pos: any) => transformPosition(pos))
      
      // Calculate candidates count for each position
      for (const position of transformedPositions) {
        const candidatesResponse = await votingService.getCandidatesByPosition(position.positionId, false)
        position.candidatesCount = candidatesResponse.length
      }
      
      positions.value = transformedPositions
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to load positions'
      console.error('Error loading positions:', err)
    } finally {
      isLoading.value = false
    }
  }

  const loadSinglePosition = async (positionId: number): Promise<void> => {
    try {
      // Check if position is already loaded
      const existingPosition = positions.value.find(p => p.positionId === positionId)
      if (existingPosition) {
        return // Position already loaded
      }

      // Load positions with filter to find the specific position
      // We can't use getPosition(id) because it expects MongoDB _id, not positionId
      const response = await votingService.getPositions({ 
        status: 'active',
        limit: 'no_limit' 
      })
      
      // Find the position with matching positionId
      const targetPosition = response.data.find((pos: any) => 
        Number(pos.positionId || pos.position_id) === positionId
      )
      
      if (targetPosition) {
        const transformedPosition = transformPosition(targetPosition as unknown as Record<string, unknown>)
        
        // Get candidates count for this position
        const candidatesResponse = await votingService.getCandidatesByPosition(positionId, false)
        transformedPosition.candidatesCount = candidatesResponse.length
        
        // Add to positions array if not already present
        if (!positions.value.find(p => p.positionId === positionId)) {
          positions.value.push(transformedPosition)
        }
      }
    } catch (err: unknown) {
      console.error('Error loading single position:', err)
      // Don't throw error to avoid breaking the component
    }
  }

  const loadCandidates = async (positionId?: number): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      if (positionId) {
        // Load candidates for specific position
        const response = await votingService.getCandidatesByPosition(positionId, true)
        const transformedCandidates = response.map(transformCandidate)
        
        // Update or add candidates for this position
        candidates.value = [
          ...candidates.value.filter(c => c.positionId !== positionId),
          ...transformedCandidates
        ]
      } else {
        // Load all candidates
        const response = await votingService.getCandidates({
          include_relations: true,
          limit: 'no_limit'
        })
        candidates.value = response.data.map(transformCandidate)
      }
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to load candidates'
      console.error('Error loading candidates:', err)
    } finally {
      isLoading.value = false
    }
  }

  const submitVote = async (positionId: number, candidateId: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      if (!currentElection.value) {
        error.value = 'No active election found'
        return false
      }

      const authStore = useAuthStore()
      const userId = authStore.user?.id

      if (!userId) {
        error.value = 'User not authenticated'
        return false
      }

      // Submit vote to API
      const voteData = {
        user_id: userId,
        candidate_id: candidateId,
        position_id: positionId,
        period_start: currentElection.value.period_start,
        period_end: currentElection.value.period_end,
      }

      await votingService.submitVote(voteData)

      // Store the vote locally
      const vote: Vote = {
        positionId,
        candidateId,
        votedAt: new Date().toISOString(),
      }

      selectedVotes.value.set(positionId, vote)
      votingStatus.value.hasVoted = votedPositions.value.length > 0

      return true
    } catch (err: unknown) {
      error.value = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to submit vote'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const removeVote = async (positionId: number): Promise<boolean> => {
    // Note: The backend doesn't support removing votes
    // This is just for local state management
    selectedVotes.value.delete(positionId)
    votingStatus.value.hasVoted = votedPositions.value.length > 0
    return true
  }

  const loadVotingData = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // Load current election
      const election = await votingService.getCurrentElection()
      currentElection.value = election

      if (!election) {
        votingStatus.value.canVote = false
        votingStatus.value.votingPeriod = 'ended'
        return
      }

      // Check voting period
      const now = new Date()
      const startDate = election.voting_start ? new Date(election.voting_start) : null
      const endDate = election.voting_end ? new Date(election.voting_end) : null

      if (startDate && endDate) {
        if (now < startDate) {
          votingStatus.value.votingPeriod = 'upcoming'
          votingStatus.value.canVote = false
        } else if (now > endDate) {
          votingStatus.value.votingPeriod = 'ended'
          votingStatus.value.canVote = false
        } else {
          votingStatus.value.votingPeriod = 'active'
          votingStatus.value.canVote = true
          
          // Calculate remaining time
          const timeDiff = endDate.getTime() - now.getTime()
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          votingStatus.value.remainingTime = `${days} hari ${hours} jam`
        }
      }

      // Load positions and candidates
      await Promise.all([
        loadPositions(),
        loadCandidates()
      ])

      // Check user's existing votes
      const authStore = useAuthStore()
      if (authStore.user?.id) {
        const userVotes = await votingService.getUserVotes(authStore.user.id, {
          period_start: election.period_start,
          period_end: election.period_end,
          limit: 'no_limit'
        })

        // Store existing votes
        userVotes.data.forEach(vote => {
          if (vote.position_id && vote.candidate_id) {
            selectedVotes.value.set(vote.position_id, {
              positionId: vote.position_id,
              candidateId: vote.candidate_id,
              votedAt: vote.created_at || new Date().toISOString()
            })
          }
        })

        votingStatus.value.hasVoted = selectedVotes.value.size > 0
      }
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to load voting data'
      console.error('Error loading voting data:', err)
    } finally {
      isLoading.value = false
    }
  }

  const getUserVotes = async (): Promise<Array<{ position_id: number; candidate_id: string; created_at?: string }>> => {
    try {
      const authStore = useAuthStore()
      if (!authStore.user?.id || !currentElection.value) {
        return []
      }

      const response = await votingService.getUserVotes(authStore.user.id, {
        period_start: currentElection.value.period_start,
        period_end: currentElection.value.period_end,
        limit: 'no_limit'
      })

      return response.data
    } catch (err) {
      console.error('Error getting user votes:', err)
      return []
    }
  }

  const clearError = () => {
    error.value = null
  }

  const resetVotes = () => {
    selectedVotes.value.clear()
    votingStatus.value.hasVoted = false
  }

  return {
    // State
    positions,
    candidates,
    currentElection,
    selectedVotes,
    votingStatus,
    isLoading,
    error,
    
    // Getters
    activePositions,
    votedPositions,
    votingProgress,
    isVotingComplete,
    getCandidatesByPosition,
    candidatesByPosition,
    getVoteForPosition,
    hasVotedForPosition,
    
    // Actions
    loadPositions,
    loadSinglePosition,
    loadCandidates,
    submitVote,
    removeVote,
    loadVotingData,
    getUserVotes,
    clearError,
    resetVotes,
  }
})
