import axios, { AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import axiosRetry from 'axios-retry'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import router from '@/router'
import type { PaginationInfo } from '@/types/api.types'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://pemiyos-be-production-up.railway.app',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  withCredentials: true, // ← ADD THIS LINE!
  headers: {
    'Content-Type': 'application/json',
  },
})

// Configure retry logic
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 503
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Extract pagination from headers if present
    const paginationHeader = response.headers['x-pagination']
    if (paginationHeader) {
      try {
        const pagination: PaginationInfo = JSON.parse(paginationHeader)
        // Attach pagination to response data
        if (response.data && Array.isArray(response.data)) {
          return {
            ...response,
            data: {
              data: response.data,
              pagination,
            },
          }
        }
      } catch (e) {
        console.error('Failed to parse pagination header:', e)
      }
    }
    
    return response
  },
  async (error: AxiosError) => {
    const { error: showError } = useToast()
    const authStore = useAuthStore()
    
    if (error.response) {
      const { status, data } = error.response as { status: number; data?: { error?: string } }
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          await authStore.logout()
          router.push('/login')
          showError('Session expired. Please login again.')
          break
          
        case 403:
          // Forbidden
          showError('You do not have permission to perform this action.')
          router.push('/home')
          break
          
        case 404:
          // Not found
          showError(data?.error || 'Resource not found.')
          break
          
        case 409:
          // Conflict (duplicate entry)
          showError(data?.error || 'Duplicate entry detected.')
          break
          
        case 422:
        case 400:
          // Validation error
          showError(data?.error || 'Invalid request. Please check your input.')
          break
          
        case 500:
        case 502:
        case 503:
          // Server error
          showError('Server error. Please try again later.')
          break
          
        default:
          showError(data?.error || 'An unexpected error occurred.')
      }
    } else if (error.request) {
      // Network error
      showError('Network error. Please check your connection.')
    } else {
      // Other errors
      showError('An unexpected error occurred.')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

// Helper function to build query string
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

// Helper function to handle paginated responses
export function extractPaginatedData<T>(response: { data?: { data?: T[]; pagination?: PaginationInfo } | T[] }): { data: T[]; pagination?: PaginationInfo } {
  if (response.data && typeof response.data === 'object' && 'data' in response.data && 'pagination' in response.data) {
    return {
      data: response.data.data || [],
      pagination: response.data.pagination,
    }
  }
  
  return {
    data: Array.isArray(response.data) ? response.data : [],
    pagination: undefined,
  }
}