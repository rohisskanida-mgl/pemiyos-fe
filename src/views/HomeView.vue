<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Users, Briefcase, CheckCircle, Clock, Shield, Smartphone } from 'lucide-vue-next'
import AppFooter from '@/components/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

// Mock stats data
const stats = ref([
  { label: 'Total Pemilih', value: '250', icon: Users, color: 'info-accent' },
  { label: 'Posisi Tersedia', value: '4', icon: Briefcase, color: 'secondary' },
  { label: 'Sudah Memilih', value: '180', icon: CheckCircle, color: 'success-accent' },
])

const features = ref([
  {
    title: 'Voting Real-time',
    description: 'Pantau hasil voting secara langsung',
    icon: Clock,
    color: 'primary',
  },
  {
    title: 'Keamanan Terjamin',
    description: 'Data terenkripsi dan aman',
    icon: Shield,
    color: 'success-accent',
  },
  {
    title: 'Mudah Digunakan',
    description: 'Interface intuitif dan mobile-friendly',
    icon: Smartphone,
    color: 'info-accent',
  },
])

function navigateToLogin() {
  router.push('/login')
}

function navigateToVote() {
  router.push('/vote')
}

function navigateToResults() {
  router.push('/results')
}
</script>

<template>
  <div class="min-h-screen bg-light-bg">
    <!-- Hero Section -->
    <section class="px-6 py-8">
      <div class="max-w-mobile mx-auto text-center">
        <!-- App Logo/Icon -->
        <div
          class="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg"
        >
          <!-- Ballot Box SVG -->
          <svg class="w-16 h-16" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Ballot Box -->
            <rect
              x="15"
              y="25"
              width="50"
              height="40"
              rx="4"
              fill="white"
              stroke="#1E40AF"
              stroke-width="2"
            />
            <!-- Ballot Box Opening -->
            <path d="M20 25 L35 15 L60 15 L65 25" fill="#1E40AF" />
            <!-- Ballot Paper -->
            <rect
              x="25"
              y="20"
              width="30"
              height="20"
              rx="2"
              fill="#F3F4F6"
              stroke="#E5E7EB"
              stroke-width="1"
            />
            <!-- Ballot Lines -->
            <line x1="30" y1="25" x2="50" y2="25" stroke="#9CA3AF" stroke-width="1" />
            <line x1="30" y1="30" x2="50" y2="30" stroke="#9CA3AF" stroke-width="1" />
            <line x1="30" y1="35" x2="50" y2="35" stroke="#9CA3AF" stroke-width="1" />
            <!-- Checkmark -->
            <path
              d="M35 32 L40 37 L45 30"
              stroke="#22C55E"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <!-- App Title and Subtitle -->
        <h1 class="text-4xl font-bold text-text-dark mb-2">PEMIYOS</h1>
        <p class="text-lg text-text-dark/80 mb-2">Pemilu IYOS - Sistem Pemungutan Suara Digital</p>
        <p class="text-base text-text-dark/60">Transparan, Aman, dan Terpercaya</p>
      </div>
    </section>

    <!-- Quick Stats Section (only when authenticated) -->
    <section v-if="authStore.isAuthenticated" class="px-6 mb-8">
      <div class="max-w-mobile mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-text-light rounded-xl p-4 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div
                :class="`w-10 h-10 bg-${stat.color} rounded-lg flex items-center justify-center`"
              >
                <component :is="stat.icon" class="w-5 h-5 text-text-light" />
              </div>
              <div>
                <p class="text-2xl font-bold text-text-dark">{{ stat.value }}</p>
                <p class="text-sm text-text-dark/60">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Action Buttons -->
    <section class="px-6 mb-8">
      <div class="max-w-mobile mx-auto">
        <div class="flex flex-col gap-3">
          <!-- Not authenticated -->
          <template v-if="!authStore.isAuthenticated">
            <button
              @click="navigateToLogin"
              class="w-full max-w-sm mx-auto bg-info-accent text-text-light py-3 rounded-lg font-medium hover:bg-info-accent/90 transition-colors"
            >
              Masuk Sekarang
            </button>
          </template>

          <!-- Authenticated -->
          <template v-else>
            <button
              @click="navigateToVote"
              class="w-full max-w-sm mx-auto bg-success-accent text-text-light py-3 rounded-lg font-medium hover:bg-success-accent/90 transition-colors"
            >
              Mulai Voting
            </button>
            <button
              @click="navigateToResults"
              class="w-full max-w-sm mx-auto border-2 border-info-accent text-info-accent py-3 rounded-lg font-medium hover:bg-info-accent/10 transition-colors"
            >
              Lihat Hasil
            </button>
          </template>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="px-6 mb-8">
      <div class="max-w-mobile mx-auto">
        <div class="space-y-4">
          <div v-for="feature in features" :key="feature.title" class="flex items-start gap-4">
            <div
              :class="`w-12 h-12 bg-${feature.color} rounded-full flex items-center justify-center flex-shrink-0`"
            >
              <component :is="feature.icon" class="w-6 h-6 text-text-light" />
            </div>
            <div>
              <h3 class="font-semibold text-text-dark mb-1">{{ feature.title }}</h3>
              <p class="text-sm text-text-dark/70">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
