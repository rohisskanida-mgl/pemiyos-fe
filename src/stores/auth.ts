import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  username: string
  fullName: string
  email: string
  phone: string
  role: 'Admin' | 'User'
  year: string
  division: string
  position: string
  status: 'active' | 'inactive'
  avatar?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface ProfileUpdate {
  fullName?: string
  email?: string
  phone?: string
  division?: string
  position?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const token = ref<string | null>(null)

  // Getters
  const username = computed(() => user.value?.username || '')
  const role = computed(() => user.value?.role || 'User')
  const isAdmin = computed(() => user.value?.role === 'Admin')
  const userInfo = computed(() => ({
    username: user.value?.username || '',
    fullName: user.value?.fullName || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    role: user.value?.role || 'User',
    year: user.value?.year || '',
    division: user.value?.division || '',
    position: user.value?.position || '',
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

  // Actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication logic
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const userData = {
          id: 1,
          username: 'admin',
          fullName: 'Admin User',
          email: 'admin@example.com',
          phone: '081234567890',
          role: 'Admin' as const,
          year: '2024/2025',
          division: 'IT',
          position: 'Ketua',
          status: 'active' as const,
        }
        const authToken = 'admin_token_' + Date.now()

        saveUserData(userData)
        saveToken(authToken)
        isAuthenticated.value = true
        return true
      } else if (credentials.username === 'user' && credentials.password === 'user123') {
        const userData = {
          id: 2,
          username: 'user',
          fullName: 'Regular User',
          email: 'user@example.com',
          phone: '081234567891',
          role: 'User' as const,
          year: '2024/2025',
          division: 'Marketing',
          position: 'Anggota',
          status: 'active' as const,
        }
        const authToken = 'user_token_' + Date.now()

        saveUserData(userData)
        saveToken(authToken)
        isAuthenticated.value = true
        return true
      } else {
        error.value = 'Username atau password salah'
        return false
      }
    } catch (err) {
      error.value = 'Terjadi kesalahan saat login'
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
        // Simulate token validation
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Validate token format (basic validation)
        if (storedToken.startsWith('admin_token_') || storedToken.startsWith('user_token_')) {
          // Restore user data
          user.value = storedUser
          token.value = storedToken
          isAuthenticated.value = true
          return true
        } else {
          // Invalid token format, clear data
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
