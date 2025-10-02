import apiClient from './axios.config'
import type { LoginRequest, LoginResponse, User } from '@/types/api.types'

class AuthService {
  /**
   * Login with NIS and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials)
    return response.data
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/api/auth/profile')
    return response.data
  }

  /**
   * Validate token and get user data
   */
  async validateToken(): Promise<User | null> {
    try {
      const user = await this.getProfile()
      return user
    } catch (error) {
      console.error("Error: ", error)
      return null
    }
  }
}

export default new AuthService()
