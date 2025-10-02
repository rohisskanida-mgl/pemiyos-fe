import apiClient from './axios.config'
import type { VoteStatistics, NonVotersResponse } from '@/types/api.types'

class ResultsService {
  /**
   * Get vote statistics for all positions
   */
  async getAllStatistics(positionIds: number[]): Promise<VoteStatistics[]> {
    const promises = positionIds.map(id => this.getPositionStatistics(id))
    return Promise.all(promises)
  }

  /**
   * Get vote statistics for a specific position
   */
  async getPositionStatistics(positionId: number): Promise<VoteStatistics> {
    const response = await apiClient.get<VoteStatistics>(`/api/statistic/votes/${positionId}`)
    return response.data
  }

  /**
   * Get non-voters for a position
   */
  async getNonVoters(positionId: number): Promise<NonVotersResponse> {
    const response = await apiClient.get<NonVotersResponse>(
      `/api/statistic/votes/${positionId}?not_votes=true`
    )
    return response.data
  }

  /**
   * Get voting participation rate
   */
  async getParticipationRate(positionId: number): Promise<{
    totalVoters: number
    totalVoted: number
    participationRate: number
  }> {
    const [statistics, nonVoters] = await Promise.all([
      this.getPositionStatistics(positionId),
      this.getNonVoters(positionId)
    ])

    const totalVoted = statistics.total_votes
    const totalVoters = totalVoted + nonVoters.total_non_voters
    const participationRate = totalVoters > 0 ? (totalVoted / totalVoters) * 100 : 0

    return {
      totalVoters,
      totalVoted,
      participationRate: Math.round(participationRate * 100) / 100
    }
  }

  /**
   * Get winner for a position
   */
  async getPositionWinner(positionId: number): Promise<{
    winner: { candidate_number: number; name: string; voters: number } | null
    isTie: boolean
  }> {
    const statistics = await this.getPositionStatistics(positionId)
    
    if (statistics.data.length === 0) {
      return { winner: null, isTie: false }
    }

    // Sort by votes descending
    const sorted = [...statistics.data].sort((a, b) => b.voters - a.voters)
    
    // Check for tie
    const firstCandidate = sorted[0]
    const secondCandidate = sorted[1]
    const isTie = sorted.length > 1 && firstCandidate && secondCandidate && firstCandidate.voters === secondCandidate.voters || false
    
    return {
      winner: firstCandidate ?? null,
      isTie
    }
  }

  /**
   * Get overall voting summary
   */
  async getVotingSummary(positionIds: number[]): Promise<{
    totalPositions: number
    totalCandidates: number
    totalVotes: number
    averageParticipation: number
  }> {
    const allStatistics = await this.getAllStatistics(positionIds)
    
    const totalPositions = allStatistics.length
    const totalCandidates = allStatistics.reduce((sum, stat) => sum + stat.data.length, 0)
    const totalVotes = allStatistics.reduce((sum, stat) => sum + stat.total_votes, 0)
    
    // Calculate average participation
    const participationRates = await Promise.all(
      positionIds.map(id => this.getParticipationRate(id))
    )
    
    const averageParticipation = participationRates.reduce(
      (sum, rate) => sum + rate.participationRate, 0
    ) / participationRates.length

    return {
      totalPositions,
      totalCandidates,
      totalVotes,
      averageParticipation: Math.round(averageParticipation * 100) / 100
    }
  }
}

export default new ResultsService()
