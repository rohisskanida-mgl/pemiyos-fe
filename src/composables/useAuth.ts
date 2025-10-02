import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, type LoginCredentials, type ProfileUpdate } from '@/stores/auth'
import { useToast } from './useToast'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const { success: successToast, error } = useToast()

  // Computed properties
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoading = computed(() => authStore.isLoading)
  const authError = computed(() => authStore.error)
  const isAdmin = computed(() => authStore.isAdmin)
  const userRole = computed(() => authStore.role)
  const userInfo = computed(() => authStore.userInfo)

  // Authentication helpers
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const success = await authStore.login(credentials)
      if (success) {
        successToast('Login berhasil!')
        return true
      } else {
        error(authStore.error || 'Login gagal')
        return false
      }
    } catch (err) {
      console.error("Error: ", err);
      error('Terjadi kesalahan saat login')
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authStore.logout()
      successToast('Logout berhasil')
      router.push('/login')
    } catch (err) {
      console.error("Error: ", err);
      error('Terjadi kesalahan saat logout')
    }
  }

  const updateProfile = async (profileData: ProfileUpdate): Promise<boolean> => {
    try {
      const success = await authStore.updateProfile(profileData)
      if (success) {
        successToast('Profil berhasil diperbarui')
        return true
      } else {
        error(authStore.error || 'Gagal memperbarui profil')
        return false
      }
    } catch (err) {
      console.error("Error: ", err);
      error('Terjadi kesalahan saat memperbarui profil')
      return false
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    try {
      return await authStore.checkAuth()
    } catch (err) {
      console.error("Error: ", err);
      error('Terjadi kesalahan saat memeriksa autentikasi')
      return false
    }
  }

  const clearError = () => {
    authStore.clearError()
  }

  // Route helpers
  const requireAuth = (redirectTo: string = '/login') => {
    if (!isAuthenticated.value) {
      router.push(redirectTo)
      return false
    }
    return true
  }

  const requireAdmin = (redirectTo: string = '/profile') => {
    if (!isAuthenticated.value || !isAdmin.value) {
      router.push(redirectTo)
      return false
    }
    return true
  }

  const requireGuest = (redirectTo: string = '/profile') => {
    if (isAuthenticated.value) {
      router.push(redirectTo)
      return false
    }
    return true
  }

  // User role helpers
  const hasRole = (role: 'Admin' | 'User'): boolean => {
    return userRole.value === role as typeof userRole.value
  }

  const isUser = (): boolean => {
    return hasRole('User')
  }

  const canAccess = (requiredRole: 'Admin' | 'User'): boolean => {
    if (!isAuthenticated.value) return false
    if (requiredRole === 'Admin') return isAdmin.value
    return true // User role can access user-level features
  }

  // User data helpers
  const getUserDisplayName = (): string => {
    return user.value?.fullName || 'Unknown User'
  }

  const getUserInitials = (): string => {
    const name = getUserDisplayName()
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserAvatar = (): string | undefined => {
    return user.value?.avatar
  }

  // Session helpers
  const isSessionValid = (): boolean => {
    // Check if user exists and is authenticated
    return !!(user.value && isAuthenticated.value)
  }

  const refreshSession = async (): Promise<boolean> => {
    try {
      return await checkAuth()
    } catch (err) {
      console.error("Error: ", err);
      return false
    }
  }

  // Navigation helpers
  const goToProfile = () => {
    if (requireAuth()) {
      router.push('/profile')
    }
  }

  const goToLogin = () => {
    if (requireGuest()) {
      router.push('/login')
    }
  }

  const goToAdmin = () => {
    if (requireAdmin()) {
      router.push('/users')
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    authError,
    isAdmin,
    userRole,
    userInfo,

    // Actions
    login,
    logout,
    updateProfile,
    checkAuth,
    clearError,

    // Route helpers
    requireAuth,
    requireAdmin,
    requireGuest,

    // Role helpers
    hasRole,
    isUser,
    canAccess,

    // User data helpers
    getUserDisplayName,
    getUserInitials,
    getUserAvatar,

    // Session helpers
    isSessionValid,
    refreshSession,

    // Navigation helpers
    goToProfile,
    goToLogin,
    goToAdmin,
  }
}
