import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { resultsService, votingService, usersService } from '@/services/api'
import type { VoteStatistics, NonVotersResponse, Position } from '@/types/api.types'

export interface CandidateResult {
  candidateId: number
  candidateName: string
  positionNumber: number
  votes: number
  percentage: number
}

export interface PositionResult {
  positionId: number
  positionTitle: string
  totalVotes: number
  candidates: CandidateResult[]
  winner?: CandidateResult
  isComplete: boolean
}

export interface OverallResults {
  totalVoters: number
  totalVotes: number
  participationRate: number
  positions: PositionResult[]
  lastUpdated: string
}

export interface ResultsFilters {
  positionId?: number
  dateRange?: {
    start: string
    end: string
  }
}

export const useResultsStore = defineStore('results', () => {
  // State
  const results = ref<OverallResults>({
    totalVoters: 1000,
    totalVotes: 0,
    participationRate: 0,
    positions: [],
    lastUpdated: new Date().toISOString(),
  })

  const filters = ref<ResultsFilters>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const isRealTimeEnabled = ref(false)

  // Real-time simulation
  let realTimeInterval: NodeJS.Timeout | null = null

  // Getters
  const filteredResults = computed(() => {
    let filtered = results.value

    if (filters.value.positionId) {
      filtered = {
        ...filtered,
        positions: filtered.positions.filter(pos => pos.positionId === filters.value.positionId)
      }
    }

    return filtered
  })

  const quickResults = computed(() => {
    return results.value.positions
      .filter(pos => pos.isComplete)
      .map(pos => ({
        position: pos.positionTitle,
        winner: pos.winner?.candidateName || 'Belum ada pemenang',
        percentage: pos.winner?.percentage || 0,
        votes: pos.winner?.votes || 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)
  })

  const participationStats = computed(() => ({
    totalVoters: results.value.totalVoters,
    totalVotes: results.value.totalVotes,
    participationRate: results.value.participationRate,
    remainingVoters: results.value.totalVoters - results.value.totalVotes,
  }))

  const getResultsByPosition = computed(() => (positionId: number) => {
    return results.value.positions.find(pos => pos.positionId === positionId)
  })

  const isResultsComplete = computed(() => 
    results.value.positions.every(pos => pos.isComplete)
  )

  const topPerformers = computed(() => {
    const allCandidates = results.value.positions
      .flatMap(pos => pos.candidates)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)

    return allCandidates
  })

  // Actions
  const loadResults = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // Load positions first
      const positionsResponse = await votingService.getPositions({ 
        status: 'active',
        limit: 'no_limit' 
      })
      
      const positionResults: PositionResult[] = []
      let totalVotesCount = 0
      
      // Load statistics for each position
      for (const position of positionsResponse.data) {
        const statistics = await resultsService.getPositionStatistics(position.position_id)
        
        const candidates: CandidateResult[] = statistics.data.map(candidate => ({
          candidateId: 0, // API doesn't return candidate ID in statistics
          candidateName: candidate.name,
          positionNumber: candidate.candidate_number,
          votes: candidate.voters,
          percentage: statistics.total_votes > 0 
            ? Math.round((candidate.voters / statistics.total_votes) * 1000) / 10 
            : 0
        }))
        
        // Find winner
        const winner = candidates.length > 0 
          ? candidates.reduce((prev, current) => 
              current.votes > (prev?.votes || 0) ? current : prev, 
              candidates[0]
            )
          : undefined
        
        positionResults.push({
          positionId: position.position_id,
          positionTitle: position.name,
          totalVotes: statistics.total_votes,
          candidates,
          winner,
          isComplete: true
        })
        
        totalVotesCount += statistics.total_votes
      }
      
      // Calculate overall participation
      const usersCount = await usersService.getUsersCount({ role: 'voter' })
      const totalVoters = usersCount.count || 1000
      
      const mockResults: OverallResults = {
        totalVoters,
        totalVotes: totalVotesCount,
        participationRate: totalVoters > 0 ? Math.round((totalVotesCount / totalVoters) * 1000) / 10 : 0,
        positions: positionResults,
        lastUpdated: new Date().toISOString(),
      }

      results.value = mockResults
      lastUpdated.value = new Date()
    } catch (err: any) {
      error.value = err.message || 'Failed to load voting results'
      console.error('Error loading results:', err)
    } finally {
      isLoading.value = false
    }
  }

  const refreshResults = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Update last updated time
      results.value.lastUpdated = new Date().toISOString()

      // Simulate small changes in results
      results.value.positions.forEach(position => {
        position.candidates.forEach(candidate => {
          // Add random small changes to simulate real-time updates
          const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
          candidate.votes = Math.max(0, candidate.votes + change)
        })

        // Recalculate percentages
        const totalVotes = position.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
        position.candidates.forEach(candidate => {
          candidate.percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
        })

        // Update winner
        position.winner = position.candidates.reduce((prev, current) => 
          current.votes > prev.votes ? current : prev
        )
      })

      // Update overall stats
      results.value.totalVotes = results.value.positions.reduce(
        (sum, pos) => sum + pos.candidates.reduce((posSum, candidate) => posSum + candidate.votes, 0),
        0
      )
      results.value.participationRate = (results.value.totalVotes / results.value.totalVoters) * 100

    } catch (err) {
      error.value = 'Terjadi kesalahan saat memperbarui hasil'
    } finally {
      isLoading.value = false
    }
  }

  const startRealTimeUpdates = (): void => {
    if (realTimeInterval) return

    isRealTimeEnabled.value = true
    realTimeInterval = setInterval(() => {
      refreshResults()
    }, 5000) // Update every 5 seconds
  }

  const stopRealTimeUpdates = (): void => {
    if (realTimeInterval) {
      clearInterval(realTimeInterval)
      realTimeInterval = null
    }
    isRealTimeEnabled.value = false
  }

  const exportResults = async (format: 'csv' | 'excel' | 'pdf'): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real app, this would generate and download the file
      console.log(`Exporting results as ${format}`)
      
      return true
    } catch (err) {
      error.value = `Terjadi kesalahan saat mengexport hasil sebagai ${format}`
      return false
    } finally {
      isLoading.value = false
    }
  }

  const setFilters = (newFilters: ResultsFilters): void => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = (): void => {
    filters.value = {}
  }

  const clearError = (): void => {
    error.value = null
  }

  const generateReport = async (): Promise<string | null> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate a simple text report
      const report = `
LAPORAN HASIL PEMILIHAN
========================

Tanggal: ${new Date().toLocaleDateString('id-ID')}
Total Pemilih: ${results.value.totalVoters}
Total Suara: ${results.value.totalVotes}
Tingkat Partisipasi: ${results.value.participationRate.toFixed(1)}%

HASIL PER POSISI:
${results.value.positions.map(pos => `
${pos.positionTitle}:
${pos.candidates.map(candidate => 
  `  ${candidate.positionNumber}. ${candidate.candidateName}: ${candidate.votes} suara (${candidate.percentage.toFixed(1)}%)`
).join('\n')}
Pemenang: ${pos.winner?.candidateName} (${pos.winner?.percentage.toFixed(1)}%)
`).join('\n')}

Laporan ini dibuat pada: ${new Date().toLocaleString('id-ID')}
      `.trim()

      return report
    } catch (err) {
      error.value = 'Terjadi kesalahan saat membuat laporan'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Cleanup on store destruction
  const cleanup = (): void => {
    stopRealTimeUpdates()
  }

  return {
    // State
    results,
    filters,
    isLoading,
    error,
    isRealTimeEnabled,
    
    // Getters
    filteredResults,
    quickResults,
    participationStats,
    getResultsByPosition,
    isResultsComplete,
    topPerformers,
    
    // Actions
    loadResults,
    refreshResults,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    exportResults,
    setFilters,
    clearFilters,
    clearError,
    generateReport,
    cleanup,
  }
})
