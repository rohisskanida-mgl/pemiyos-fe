<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Filter, Edit, Trash2, User } from 'lucide-vue-next'
import FilterModal from '@/components/FilterModal.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { success, error } = useToast()

const showFilterModal = ref(false)
const searchQuery = ref('')

// Sample users data
const users = ref([
  {
    id: 1,
    username: 'john.doe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    year: '2024/2025',
    division: 'IT',
    position: 'Ketua',
    status: 'active',
  },
  {
    id: 2,
    username: 'jane.smith',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    year: '2024/2025',
    division: 'Marketing',
    position: 'Anggota',
    status: 'active',
  },
  {
    id: 3,
    username: 'mike.johnson',
    fullName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'User',
    year: '2023/2024',
    division: 'Finance',
    position: 'Bendahara',
    status: 'inactive',
  },
  {
    id: 4,
    username: 'alice.brown',
    fullName: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'User',
    year: '2024/2025',
    division: 'HR',
    position: 'Sekretaris',
    status: 'active',
  },
])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value

  return users.value.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const handleAddUser = () => {
  router.push('/add-user')
}

const handleEditUser = (userId: number) => {
  success(`Edit user ${userId} - Fitur akan segera tersedia`)
}

const handleDeleteUser = (userId: number, username: string) => {
  if (confirm(`Apakah Anda yakin ingin menghapus user ${username}?`)) {
    const index = users.value.findIndex((user) => user.id === userId)
    if (index > -1) {
      users.value.splice(index, 1)
      success(`User ${username} berhasil dihapus`)
    }
  }
}

const handleFilterApply = (filters: any) => {
  console.log('Applied filters:', filters)
  success('Filter berhasil diterapkan')
  showFilterModal.value = false
}

const handleFilterReset = () => {
  success('Filter berhasil direset')
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-text-dark">Manajemen Pengguna</h1>
        <p class="text-text-dark mt-1">Kelola data pengguna sistem</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pengguna..."
            class="pl-10 pr-4 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-info-accent/20 focus:border-info-accent"
          />
          <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-dark" />
        </div>

        <!-- Filter Button -->
        <button
          @click="showFilterModal = true"
          class="p-2 rounded-lg border border-divider hover:bg-light-bg transition-colors"
        >
          <Filter class="w-5 h-5 text-text-dark" />
        </button>

        <!-- Add User Button -->
        <button
          @click="handleAddUser"
          class="px-4 py-2 bg-success-accent text-white rounded-lg hover:brightness-95 transition-colors flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>
    </div>

    <!-- Users Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="bg-text-light rounded-xl shadow-sm p-4 border border-transparent hover:border-divider transition-colors"
      >
        <!-- User Info -->
        <div class="flex items-start gap-3 mb-4">
          <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <span class="text-white font-bold">{{ user.fullName.charAt(0) }}</span>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-text-dark">{{ user.fullName }}</h3>
            <p class="text-sm text-text-dark">@{{ user.username }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span
                :class="[
                  'text-xs px-2 py-1 rounded-full',
                  user.role === 'Admin'
                    ? 'bg-info-accent text-text-light'
                    : 'bg-light-bg text-text-dark',
                ]"
              >
                {{ user.role }}
              </span>
              <span class="text-xs text-text-dark">{{ user.year }}</span>
            </div>
          </div>
        </div>

        <!-- User Details -->
        <div class="space-y-2 mb-4">
          <div class="text-sm">
            <span class="text-text-dark">Email:</span>
            <span class="text-text-dark ml-1">{{ user.email }}</span>
          </div>
          <div class="text-sm">
            <span class="text-text-dark">Divisi:</span>
            <span class="text-text-dark ml-1">{{ user.division }}</span>
          </div>
          <div class="text-sm">
            <span class="text-text-dark">Jabatan:</span>
            <span class="text-text-dark ml-1">{{ user.position }}</span>
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
            @click="handleEditUser(user.id)"
            class="flex-1 px-3 py-2 bg-warn-accent text-white rounded-lg hover:brightness-95 transition-colors flex items-center justify-center gap-1"
          >
            <Edit class="w-4 h-4" />
            Edit
          </button>
          <button
            @click="handleDeleteUser(user.id, user.username)"
            class="flex-1 px-3 py-2 bg-error-accent text-white rounded-lg hover:brightness-95 transition-colors flex items-center justify-center gap-1"
          >
            <Trash2 class="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredUsers.length === 0" class="text-center py-12">
      <User class="w-16 h-16 text-text-dark mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-text-dark mb-2">Tidak ada pengguna ditemukan</h3>
      <p class="text-text-dark">Coba ubah kata kunci pencarian atau filter</p>
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
