<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Filter, Edit, Trash2, User, Loader2 } from 'lucide-vue-next'
import FilterModal from '@/components/FilterModal.vue'
import { useToast } from '@/composables/useToast'
import { usersService } from '@/services/api'
import type { User as ApiUser, PaginationInfo } from '@/types/api.types'

const router = useRouter()
const { success, error: showError } = useToast()

const showFilterModal = ref(false)
const searchQuery = ref('')
const isLoading = ref(false)
const isDeleting = ref<string | null>(null)

// Pagination
const currentPage = ref(1)
const pagination = ref<PaginationInfo | null>(null)

// Users data from API
const users = ref<ApiUser[]>([])

// Debounce timer for search
let searchTimer: number | null = null

// Load users from API
const loadUsers = async (page = 1, search = '') => {
  isLoading.value = true
  try {
    const response = await usersService.getUsers({
      page,
      limit: 10,
      search: search || undefined,
    })
    
    users.value = response.data
    pagination.value = response.pagination || null
    currentPage.value = page
  } catch (err: unknown) {
    showError((err as Error).message || 'Failed to load users')
  } finally {
    isLoading.value = false
  }
}

// Handle search with debounce
const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  searchTimer = setTimeout(() => {
    loadUsers(1, searchQuery.value)
  }, 500)
}

// Load users on mount
onMounted(() => {
  loadUsers()
})

const handleAddUser = () => {
  router.push('/add-user')
}

const handleEditUser = (userId: string) => {
  router.push(`/edit-user/${userId}`)
}

const handlePageChange = (page: number) => {
  loadUsers(page, searchQuery.value)
}

const handleDeleteUser = async (userId: string, username: string) => {
  if (confirm(`Apakah Anda yakin ingin menghapus user ${username}?`)) {
    isDeleting.value = userId
    try {
      await usersService.deleteUser(userId)
      success(`User ${username} berhasil dihapus`)
      // Reload users
      await loadUsers(currentPage.value, searchQuery.value)
    } catch (err: unknown) {
      showError((err as Error).message || 'Failed to delete user')
    } finally {
      isDeleting.value = null
    }
  }
}

const handleFilterApply = () => {
  showFilterModal.value = false
}

const handleFilterReset = () => {
  success('Filter berhasil direset')
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-text-dark">Manajemen Pengguna</h1>
        <p class="text-text-dark mt-1">Kelola data pengguna sistem</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Cari pengguna..."
            class="pl-10 pr-4 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
          />
          <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-dark" />
        </div>

        <!-- Filter Button - Temporarily hidden (not working properly)
        <button
          @click="showFilterModal = true"
          class="p-2 rounded-lg border border-divider hover:bg-light-bg transition-colors"
        >
          <Filter class="w-5 h-5 text-text-dark" />
        </button>
        -->

      </div>
      <!-- Add User Button - Temporarily hidden (not working properly)
      <button
        @click="handleAddUser"
        class="px-4 py-2 bg-success-accent text-white rounded-lg hover:brightness-95 transition-colors flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Tambah Pengguna
      </button>
      -->
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && users.length === 0" class="text-center py-12">
      <Loader2 class="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
      <p class="text-text-dark">Memuat data pengguna...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && users.length === 0" class="text-center py-12 bg-text-light rounded-xl">
      <User class="w-12 h-12 text-text-muted mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-text-dark mb-2">Tidak Ada Pengguna</h3>
      <p class="text-text-muted mb-4">Belum ada pengguna yang terdaftar</p>
      <button
        @click="handleAddUser"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-95 transition-colors"
      >
        Tambah Pengguna Pertama
      </button>
    </div>

    <!-- Users Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="user in users"
        :key="user._id"
        class="bg-text-light rounded-xl shadow-sm p-4 border border-transparent hover:border-divider transition-colors"
      >
        <!-- User Info -->
        <div class="flex items-start gap-3 mb-4">
          <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <span class="text-white font-bold">{{ user.nama_lengkap.charAt(0) }}</span>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-text-dark">{{ user.nama_lengkap }}</h3>
            <p class="text-sm text-text-dark">NIS: {{ user.nis }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span
                :class="[
                  'text-xs px-2 py-1 rounded-full',
                  user.role === 'admin'
                    ? 'bg-info-accent text-text-light'
                    : 'bg-light-bg text-text-dark',
                ]"
              >
                {{ user.role === 'admin' ? 'Admin' : 'Voter' }}
              </span>
              <span class="text-xs text-text-dark" v-if="user.class">{{ user.class }}</span>
            </div>
          </div>
        </div>

        <!-- User Details -->
        <div class="space-y-2 mb-4">
          <div class="text-sm" v-if="user.class">
            <span class="text-text-dark">Kelas:</span>
            <span class="text-text-dark ml-1">{{ user.class }}</span>
          </div>
          <div class="text-sm">
            <span class="text-text-dark">Jenis Kelamin:</span>
            <span class="text-text-dark ml-1">{{ user.gender === 'L' ? 'Laki-laki' : 'Perempuan' }}</span>
          </div>
          <div class="text-sm">
            <span class="text-text-dark">Status:</span>
            <span
              :class="[
                'ml-1 text-xs px-2 py-1 rounded-full',
                user.status === 'active'
                  ? 'bg-success-accent text-white'
                  : 'bg-light-bg text-text-dark',
              ]"
            >
              {{ user.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button
            @click="handleEditUser(user._id)"
            class="flex-1 px-3 py-2 bg-warn-accent text-white rounded-lg hover:brightness-95 transition-colors flex items-center justify-center gap-1"
          >
            <Edit class="w-4 h-4" />
            Edit
          </button>
          <button
            @click="handleDeleteUser(user._id, user.nama_lengkap)"
            :disabled="isDeleting === user._id"
            class="flex-1 px-3 py-2 bg-error-accent text-white rounded-lg hover:brightness-95 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <Trash2 class="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total_pages > 1" class="flex justify-center mt-6">
      <div class="flex items-center gap-2">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-lg border border-divider hover:bg-light-bg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div class="flex gap-1">
          <button
            v-for="page in Math.min(5, pagination.total_pages)"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'px-3 py-1 rounded-lg',
              page === currentPage
                ? 'bg-primary text-white'
                : 'border border-divider hover:bg-light-bg'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === pagination.total_pages"
          class="px-3 py-1 rounded-lg border border-divider hover:bg-light-bg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Filter Modal -->
    <FilterModal
      :is-open="showFilterModal"
      @close="showFilterModal = false"
      @apply="handleFilterApply"
      @reset="handleFilterReset"
    />
  </div>
</template>
