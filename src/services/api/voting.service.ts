import apiClient, { buildQueryString, extractPaginatedData } from './axios.config'
import type { 
  Position, 
  Candidate, 
  Vote, 
  Election,
  VoteStatistics,
  NonVotersResponse,
  QueryParams,
  PaginatedResponse
} from '@/types/api.types'

class VotingService {
  /**
   * Get all positions
   */
  async getPositions(params?: QueryParams): Promise<PaginatedResponse<Position>> {
    const queryString = params ? buildQueryString(params) : ''
    const response = await apiClient.get(`/api/positions${queryString}`)
    return extractPaginatedData<Position>(response)
  }

  /**
   * Get position by ID
   */
  async getPosition(id: string): Promise<Position> {
    const response = await apiClient.get<Position>(`/api/positions/${id}`)
    return response.data
  }

  /**
   * Get all elections
   */
  async getElections(params?: QueryParams): Promise<PaginatedResponse<Election>> {
    const queryString = params ? buildQueryString(params) : ''
    const response = await apiClient.get(`/api/elections${queryString}`)
    return extractPaginatedData<Election>(response)
  }

  /**
   * Get current active election
   */
  async getCurrentElection(): Promise<Election | null> {
    const response = await this.getElections({ 
      status: 'ongoing',
      limit: 1 
    })
    
    if (response.data.length > 0) {
      return response.data[0] ?? null
    }
    
    // Fallback to latest closed election
    const closedResponse = await this.getElections({ 
      status: 'closed',
      limit: 1 
    })
    
    return closedResponse.data.length > 0 ? (closedResponse.data[0] ?? null) : null
  }

  /**
   * Get all candidates
   */
  async getCandidates(params?: QueryParams): Promise<PaginatedResponse<Candidate>> {
    const queryString = params ? buildQueryString(params) : ''
    const response = await apiClient.get(`/api/candidates${queryString}`)
    return extractPaginatedData<Candidate>(response)
  }

  /**
   * Get candidates by position
   */
  async getCandidatesByPosition(positionId: number, includeRelations = true): Promise<Candidate[]> {
    const response = await this.getCandidates({
      position_id: positionId,
      include_relations: includeRelations,
      limit: 'no_limit'
    })
    return response.data
  }

  /**
   * Get candidate by ID
   */
  async getCandidate(id: string): Promise<Candidate> {
    const response = await apiClient.get<Candidate>(`/api/candidates/${id}`)
    return response.data
  }

  /**
   * Submit a vote
   */
  async submitVote(voteData: Omit<Vote, '_id' | 'created_at' | 'updated_at'>): Promise<Vote> {
    const response = await apiClient.post<Vote>('/api/votes', voteData)
    return response.data
  }

  /**
   * Get user's votes
   */
  async getUserVotes(userId: string, params?: QueryParams): Promise<PaginatedResponse<Vote>> {
    const queryString = buildQueryString({ ...params, user_id: userId })
    const response = await apiClient.get(`/api/votes${queryString}`)
    return extractPaginatedData<Vote>(response)
  }

  /**
   * Get vote statistics for a position
   */
  async getVoteStatistics(positionId: number): Promise<VoteStatistics> {
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
   * Check if user has voted for a position
   */
  async hasUserVoted(userId: string, positionId: number, periodStart: number, periodEnd: number): Promise<boolean> {
    try {
      const response = await this.getUserVotes(userId, {
        position_id: positionId,
        period_start: periodStart,
        period_end: periodEnd,
        limit: 1
      })
      return response.data.length > 0
    } catch {
      return false
    }
  }
}

export default new VotingService()
