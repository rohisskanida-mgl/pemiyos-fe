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
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  username: string
  password: string
  fullName: string
  email: string
  phone: string
  division: string
  position: string
  role?: 'Admin' | 'User'
}

export interface UpdateUserData {
  fullName?: string
  email?: string
  phone?: string
  division?: string
  position?: string
  role?: 'Admin' | 'User'
  status?: 'active' | 'inactive'
}

export interface UserFilters {
  search?: string
  role?: 'Admin' | 'User'
  division?: string
  status?: 'active' | 'inactive'
  year?: string
}

export interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useUserStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([
    {
      id: 1,
      username: 'admin',
      fullName: 'Admin User',
      email: 'admin@example.com',
      phone: '081234567890',
      role: 'Admin',
      year: '2024/2025',
      division: 'IT',
      position: 'Ketua',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      username: 'john.doe',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '081234567891',
      role: 'User',
      year: '2024/2025',
      division: 'Marketing',
      position: 'Anggota',
      status: 'active',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
    {
      id: 3,
      username: 'jane.smith',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '081234567892',
      role: 'User',
      year: '2024/2025',
      division: 'Finance',
      position: 'Bendahara',
      status: 'active',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    },
    {
      id: 4,
      username: 'mike.johnson',
      fullName: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '081234567893',
      role: 'User',
      year: '2023/2024',
      division: 'HR',
      position: 'Sekretaris',
      status: 'inactive',
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-04T00:00:00Z',
    },
    {
      id: 5,
      username: 'alice.brown',
      fullName: 'Alice Brown',
      email: 'alice.brown@example.com',
      phone: '081234567894',
      role: 'User',
      year: '2024/2025',
      division: 'Operations',
      position: 'Anggota',
      status: 'active',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-05T00:00:00Z',
    },
  ])

  const filters = ref<UserFilters>({})
  const pagination = ref<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const filteredUsers = computed(() => {
    let filtered = users.value

    // Apply search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      )
    }

    // Apply role filter
    if (filters.value.role) {
      filtered = filtered.filter(user => user.role === filters.value.role)
    }

    // Apply division filter
    if (filters.value.division) {
      filtered = filtered.filter(user => user.division === filters.value.division)
    }

    // Apply status filter
    if (filters.value.status) {
      filtered = filtered.filter(user => user.status === filters.value.status)
    }

    // Apply year filter
    if (filters.value.year) {
      filtered = filtered.filter(user => user.year === filters.value.year)
    }

    return filtered
  })

  const paginatedUsers = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.limit
    const end = start + pagination.value.limit
    return filteredUsers.value.slice(start, end)
  })

  const totalUsers = computed(() => users.value.length)
  const activeUsers = computed(() => users.value.filter(user => user.status === 'active').length)
  const adminUsers = computed(() => users.value.filter(user => user.role === 'Admin').length)

  const divisions = computed(() => {
    const uniqueDivisions = [...new Set(users.value.map(user => user.division))]
    return uniqueDivisions.sort()
  })

  const years = computed(() => {
    const uniqueYears = [...new Set(users.value.map(user => user.year))]
    return uniqueYears.sort()
  })

  // Actions
  const loadUsers = async (page = 1, limit = 10): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update pagination
      pagination.value = {
        page,
        limit,
        total: filteredUsers.value.length,
        totalPages: Math.ceil(filteredUsers.value.length / limit),
      }
    } catch (err) {
      error.value = 'Terjadi kesalahan saat memuat data pengguna'
    } finally {
      isLoading.value = false
    }
  }

  const createUser = async (userData: CreateUserData): Promise<User | null> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check if username already exists
      const existingUser = users.value.find(user => user.username === userData.username)
      if (existingUser) {
        error.value = 'Username sudah digunakan'
        return null
      }

      // Check if email already exists
      const existingEmail = users.value.find(user => user.email === userData.email)
      if (existingEmail) {
        error.value = 'Email sudah digunakan'
        return null
      }

      // Create new user
      const newUser: User = {
        id: Math.max(...users.value.map(u => u.id)) + 1,
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        role: userData.role || 'User',
        year: '2024/2025', // Default year
        division: userData.division,
        position: userData.position,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      users.value.push(newUser)
      return newUser
    } catch (err) {
      error.value = 'Terjadi kesalahan saat membuat pengguna'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateUser = async (userId: number, updateData: UpdateUserData): Promise<User | null> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const userIndex = users.value.findIndex(user => user.id === userId)
      if (userIndex === -1) {
        error.value = 'Pengguna tidak ditemukan'
        return null
      }

      // Check email uniqueness if email is being updated
      if (updateData.email) {
        const existingEmail = users.value.find(user => 
          user.email === updateData.email && user.id !== userId
        )
        if (existingEmail) {
          error.value = 'Email sudah digunakan'
          return null
        }
      }

      // Update user
      users.value[userIndex] = {
        ...users.value[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      }

      return users.value[userIndex]
    } catch (err) {
      error.value = 'Terjadi kesalahan saat memperbarui pengguna'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteUser = async (userId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const userIndex = users.value.findIndex(user => user.id === userId)
      if (userIndex === -1) {
        error.value = 'Pengguna tidak ditemukan'
        return false
      }

      // Prevent deleting admin users
      if (users.value[userIndex].role === 'Admin') {
        error.value = 'Tidak dapat menghapus pengguna admin'
        return false
      }

      users.value.splice(userIndex, 1)
      return true
    } catch (err) {
      error.value = 'Terjadi kesalahan saat menghapus pengguna'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getUserById = (userId: number): User | null => {
    return users.value.find(user => user.id === userId) || null
  }

  const setFilters = (newFilters: UserFilters): void => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset to first page when filters change
  }

  const clearFilters = (): void => {
    filters.value = {}
    pagination.value.page = 1
  }

  const setPage = (page: number): void => {
    if (page >= 1 && page <= pagination.value.totalPages) {
      pagination.value.page = page
    }
  }

  const setLimit = (limit: number): void => {
    pagination.value.limit = limit
    pagination.value.page = 1
  }

  const clearError = (): void => {
    error.value = null
  }

  const bulkCreateUsers = async (usersData: CreateUserData[]): Promise<{ success: User[], failed: { data: CreateUserData, error: string }[] }> => {
    isLoading.value = true
    error.value = null

    const success: User[] = []
    const failed: { data: CreateUserData, error: string }[] = []

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      for (const userData of usersData) {
        try {
          // Check duplicates
          const existingUser = users.value.find(user => 
            user.username === userData.username || user.email === userData.email
          )

          if (existingUser) {
            failed.push({
              data: userData,
              error: existingUser.username === userData.username ? 'Username sudah digunakan' : 'Email sudah digunakan'
            })
            continue
          }

          // Create user
          const newUser: User = {
            id: Math.max(...users.value.map(u => u.id), 0) + 1,
            username: userData.username,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            role: userData.role || 'User',
            year: '2024/2025',
            division: userData.division,
            position: userData.position,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          users.value.push(newUser)
          success.push(newUser)
        } catch (err) {
          failed.push({
            data: userData,
            error: 'Terjadi kesalahan saat membuat pengguna'
          })
        }
      }

      return { success, failed }
    } catch (err) {
      error.value = 'Terjadi kesalahan saat memproses data pengguna'
      return { success, failed }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    users,
    filters,
    pagination,
    isLoading,
    error,
    
    // Getters
    filteredUsers,
    paginatedUsers,
    totalUsers,
    activeUsers,
    adminUsers,
    divisions,
    years,
    
    // Actions
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    setFilters,
    clearFilters,
    setPage,
    setLimit,
    clearError,
    bulkCreateUsers,
  }
})
