import apiClient, { buildQueryString, extractPaginatedData } from './axios.config'
import type { User, QueryParams, PaginatedResponse } from '@/types/api.types'

class UsersService {
  /**
   * Get all users with pagination
   */
  async getUsers(params?: QueryParams): Promise<PaginatedResponse<User>> {
    const queryString = params ? buildQueryString(params) : ''
    const response = await apiClient.get(`/api/users${queryString}`)
    return extractPaginatedData<User>(response)
  }

  /**
   * Get user by ID
   */
  async getUser(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/api/users/${id}`)
    return response.data
  }

  /**
   * Create a new user
   */
  async createUser(userData: Omit<User, '_id' | 'created_at' | 'updated_at'>): Promise<User> {
    const response = await apiClient.post<User>('/api/users', userData)
    return response.data
  }

  /**
   * Bulk create users
   */
  async bulkCreateUsers(users: Omit<User, '_id' | 'created_at' | 'updated_at'>[]): Promise<{
    message: string
    insertedCount: number
    insertedIds: Record<string, string>
  }> {
    const response = await apiClient.post('/api/users/bulk', users)
    return response.data
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    // Remove read-only fields
    const { _id, created_at, ...updateData } = userData
    const response = await apiClient.put<User>(`/api/users/${id}`, updateData)
    return response.data
  }

  /**
   * Soft delete user (admin only)
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/api/users/${id}`)
    return response.data
  }

  /**
   * Hard delete user (admin only)
   */
  async hardDeleteUser(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/api/users/${id}/hard`)
    return response.data
  }

  /**
   * Search users
   */
  async searchUsers(searchTerm: string, params?: Omit<QueryParams, 'search'>): Promise<PaginatedResponse<User>> {
    return this.getUsers({
      ...params,
      search: searchTerm
    })
  }

  /**
   * Get users count
   */
  async getUsersCount(params?: QueryParams): Promise<{ count: number }> {
    const queryString = params ? buildQueryString({ ...params, is_count: true }) : '?is_count=true'
    const response = await apiClient.get<{ count: number }>(`/api/users${queryString}`)
    return response.data
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<{ data: User }> {
    const response = await apiClient.get<User>('/api/auth/profile')
    return { data: response.data }
  }

  /**
   * Get voters only
   */
  async getVoters(params?: QueryParams): Promise<PaginatedResponse<User>> {
    return this.getUsers({
      ...params,
      role: 'voter'
    })
  }

  /**
   * Get admins only
   */
  async getAdmins(params?: QueryParams): Promise<PaginatedResponse<User>> {
    return this.getUsers({
      ...params,
      role: 'admin'
    })
  }
}

export default new UsersService()
