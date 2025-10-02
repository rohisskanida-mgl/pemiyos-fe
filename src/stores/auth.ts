import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/api/auth.service'
import type { User as ApiUser, LoginRequest } from '@/types/api.types'

export interface User {
  id: string
  nis: string
  fullName: string
  email?: string
  phone?: string
  role: 'admin' | 'voter'
  class?: string | null
  gender: 'L' | 'P'
  status: 'active' | 'inactive'
  avatar?: string
}

export interface LoginCredentials {
  nis: string
  password: string
}

export interface ProfileUpdate {
  nama_lengkap?: string
  email?: string
  phone?: string
  class?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const token = ref<string | null>(null)

  // Getters
  const username = computed(() => user.value?.nis || '')
  const role = computed(() => user.value?.role || 'voter')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userInfo = computed(() => ({
    nis: user.value?.nis || '',
    fullName: user.value?.fullName || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    role: user.value?.role || 'voter',
    class: user.value?.class || '',
    gender: user.value?.gender || 'L',
    status: user.value?.status || 'active',
    avatar: user.value?.avatar,
  }))

  // Token management functions
  const saveToken = (authToken: string) => {
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
  }

  const getToken = (): string | null => {
    if (token.value) return token.value
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      token.value = storedToken
      return storedToken
    }
    return null
  }

  const removeToken = () => {
    token.value = null
    localStorage.removeItem('auth_token')
  }

  const saveUserData = (userData: User) => {
    user.value = userData
    localStorage.setItem('user_data', JSON.stringify(userData))
  }

  const getUserData = (): User | null => {
    if (user.value) return user.value
    const storedUser = localStorage.getItem('user_data')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        user.value = userData
        return userData
      } catch (err) {
        localStorage.removeItem('user_data')
        return null
      }
    }
    return null
  }

  const removeUserData = () => {
    user.value = null
    localStorage.removeItem('user_data')
  }

  // Helper function to convert API user to local user format
  const convertApiUser = (apiUser: ApiUser): User => {
    return {
      id: apiUser._id,
      nis: apiUser.nis,
      fullName: apiUser.nama_lengkap,
      role: apiUser.role,
      class: apiUser.class,
      gender: apiUser.gender,
      status: apiUser.status,
      email: undefined,
      phone: undefined,
      avatar: undefined,
    }
  }

  // Actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const loginRequest: LoginRequest = {
        nis: credentials.nis,
        password: credentials.password,
      }

      const response = await authService.login(loginRequest)
      
      if (response.token && response.user) {
        // Convert and save user data
        const userData = convertApiUser(response.user)
        saveUserData(userData)
        saveToken(response.token)
        isAuthenticated.value = true
        return true
      } else {
        error.value = 'Invalid response from server'
        return false
      }
    } catch (err: any) {
      // Error handling is done in axios interceptor
      // Just set the error message here
      error.value = err.response?.data?.error || 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    isLoading.value = true

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Clear user data
      user.value = null
      isAuthenticated.value = false
      error.value = null

      // Clear all stored data
      removeToken()
      removeUserData()
      sessionStorage.clear()
    } catch (err) {
      error.value = 'Terjadi kesalahan saat logout'
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData: ProfileUpdate): Promise<boolean> => {
    if (!user.value) return false

    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user data
      user.value = {
        ...user.value,
        ...profileData,
      }

      return true
    } catch (err) {
      error.value = 'Terjadi kesalahan saat memperbarui profil'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    // Check for stored authentication token
    const storedToken = getToken()
    const storedUser = getUserData()

    if (storedToken && storedUser) {
      try {
        // Validate token with backend
        const apiUser = await authService.validateToken()
        
        if (apiUser) {
          // Update user data from API
          const userData = convertApiUser(apiUser)
          saveUserData(userData)
          user.value = userData
          token.value = storedToken
          isAuthenticated.value = true
          return true
        } else {
          // Token is invalid, clear data
          removeToken()
          removeUserData()
          return false
        }
      } catch (err) {
        // Token is invalid, clear it
        removeToken()
        removeUserData()
        return false
      }
    }

    return false
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    token,

    // Getters
    username,
    role,
    isAdmin,
    userInfo,

    // Actions
    login,
    logout,
    updateProfile,
    checkAuth,
    clearError,

    // Token management
    saveToken,
    getToken,
    removeToken,
    saveUserData,
    getUserData,
    removeUserData,
  }
})
