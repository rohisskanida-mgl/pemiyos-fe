<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, BarChart3, PieChart as PieChartIcon, Loader2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import PieChart from '@/components/PieChart.vue'
import ResultsBar from '@/components/ResultsBar.vue'
import { useResultsStore } from '@/stores/results'

const router = useRouter()
const resultsStore = useResultsStore()
const viewMode = ref<'chart' | 'bar'>('chart')

// Load results on mount
onMounted(async () => {
  await resultsStore.loadResults()
})

// Transform results data for display
const resultsData = computed(() => {
  const data: Record<string, Array<{ name: string; percentage: number; votes?: number }>> = {}
  
  resultsStore.results.positions.forEach(position => {
    data[position.positionTitle] = position.candidates.map(candidate => ({
      name: candidate.candidateName,
      percentage: candidate.percentage,
      votes: candidate.votes
    }))
  })
  
  return data
})

// Quick results - overall winners
const quickResults = computed(() => {
  return resultsStore.quickResults
})

const isLoading = computed(() => resultsStore.isLoading)
const hasError = computed(() => resultsStore.error)
const participationStats = computed(() => resultsStore.participationStats)

// const toggleViewMode = () => { // Removed unused function
//   viewMode.value = viewMode.value === 'chart' ? 'bar' : 'chart'
// }

const goBack = () => {
  router.replace('/')
}
</script>

<template>
  <section class="min-h-screen px-4 lg:px-8 xl:px-16 py-6 flex flex-col gap-4 lg:gap-6 bg-light-bg">
    <!-- Desktop Container -->
    <div class="w-full">
      <header class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            aria-label="Back"
            class="p-2 rounded-lg bg-text-light border border-divider hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft :size="20" />
          </button>
          <h2 class="text-xl lg:text-2xl xl:text-3xl font-semibold">Hasil Pemilihan</h2>
        </div>

        <!-- View Toggle -->
        <div class="flex bg-text-light rounded-lg border border-divider shadow-sm">
          <button
            @click="viewMode = 'chart'"
            :class="[
              'p-2 lg:p-3 rounded-l-lg transition-colors',
              viewMode === 'chart'
                ? 'bg-info-accent text-text-light'
                : 'text-text-dark hover:bg-light-bg',
            ]"
          >
            <PieChartIcon class="w-5 h-5" />
          </button>
          <button
            @click="viewMode = 'bar'"
            :class="[
              'p-2 lg:p-3 rounded-r-lg transition-colors',
              viewMode === 'bar'
                ? 'bg-info-accent text-text-light'
                : 'text-text-dark hover:bg-light-bg',
            ]"
          >
            <BarChart3 class="w-5 h-5" />
          </button>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 lg:py-20">
        <Loader2 class="w-8 h-8 lg:w-12 lg:h-12 text-primary animate-spin mb-4" />
        <p class="text-text-dark text-lg lg:text-xl">Memuat hasil voting...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="bg-text-light rounded-xl shadow-sm p-6 lg:p-8 text-center max-w-md mx-auto">
        <p class="text-error mb-4 text-lg">{{ hasError }}</p>
        <button
          @click="resultsStore.loadResults()"
          class="px-6 py-3 bg-primary text-white rounded-lg hover:brightness-95 transition-all font-medium"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Results Content -->
      <template v-else>
        <!-- Participation Stats -->
        <div class="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg p-4 lg:p-6 text-white">
          <h3 class="text-lg lg:text-xl xl:text-2xl font-semibold mb-4 lg:mb-6">Statistik Partisipasi</h3>
          <div class="grid grid-cols-3 gap-4 lg:gap-8">
            <div class="text-center">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-bold">{{ participationStats.totalVoters }}</p>
              <p class="text-xs lg:text-sm opacity-90">Total Pemilih</p>
            </div>
            <div class="text-center">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-bold">{{ participationStats.totalVotes }}</p>
              <p class="text-xs lg:text-sm opacity-90">Sudah Memilih</p>
            </div>
            <div class="text-center">
              <p class="text-2xl lg:text-3xl xl:text-4xl font-bold">{{ participationStats.participationRate }}%</p>
              <p class="text-xs lg:text-sm opacity-90">Partisipasi</p>
            </div>
          </div>
        </div>

        <!-- Hasil Cepat Section -->
        <div class="bg-text-light rounded-xl shadow-sm p-4 lg:p-6 xl:p-8">
          <h3 class="text-lg lg:text-xl xl:text-2xl font-semibold text-text-dark mb-4 lg:mb-6">Hasil Cepat</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 lg:gap-4 xl:gap-6">
            <div
              v-for="(result, index) in quickResults"
              :key="result.position"
              class="flex items-center justify-between p-3 lg:p-4 xl:p-5 bg-light-bg rounded-lg hover:shadow-md transition-shadow"
            >
              <div class="flex items-center gap-3 lg:gap-4">
                <div
                  class="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-success-accent rounded-full flex items-center justify-center text-text-light font-bold text-sm lg:text-base xl:text-lg"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <h4 class="font-medium text-text-dark text-sm lg:text-base xl:text-lg">{{ result.position }}</h4>
                  <p class="text-xs lg:text-sm xl:text-base text-text-dark">{{ result.winner }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-success-accent text-sm lg:text-base xl:text-lg">{{ result.percentage }}%</p>
                <p class="text-xs lg:text-sm text-text-dark">{{ result.votes }} suara</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Results by Position -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 my-5">
          <div
            v-for="(candidates, position) in resultsData"
            :key="position"
            class="bg-white rounded-xl shadow-sm p-4 lg:p-6 xl:p-8 hover:shadow-md transition-shadow"
          >
            <h3 class="text-lg lg:text-xl xl:text-2xl font-semibold text-text-dark mb-4 lg:mb-6">{{ position }}</h3>

            <!-- Chart View -->
            <div v-if="viewMode === 'chart'">
              <PieChart :data="candidates" :title="`Hasil ${position}`" />
            </div>

            <!-- Bar View -->
            <div v-else>
              <ResultsBar :data="candidates" />
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-text-light rounded-xl shadow-sm p-4 lg:p-6 xl:p-8">
          <h3 class="text-lg lg:text-xl xl:text-2xl font-semibold text-text-dark mb-4 lg:mb-6">Ringkasan</h3>
          <div class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6 xl:gap-8 text-sm lg:text-base xl:text-lg">
            <div class="text-center lg:text-left">
              <span class="text-text-dark">Total Posisi:</span>
              <span class="font-medium text-text-dark ml-1 block lg:inline">{{ Object.keys(resultsData).length }}</span>
            </div>
            <div class="text-center lg:text-left">
              <span class="text-text-dark">Total Suara:</span>
              <span class="font-medium text-text-dark ml-1 block lg:inline">
                {{
                  Object.values(resultsData)
                    .flat()
                    .reduce((sum, candidate) => sum + (candidate.votes || 0), 0)
                    .toLocaleString()
                }}
              </span>
            </div>
            <div class="text-center lg:text-left">
              <span class="text-text-dark">Status:</span>
              <span class="font-medium text-success-accent ml-1 block lg:inline">Pemilihan Selesai</span>
            </div>
            <div class="text-center lg:text-left">
              <span class="text-text-dark">Partisipasi:</span>
              <span class="font-medium text-success-accent ml-1 block lg:inline">{{ participationStats.participationRate }}%</span>
            </div>
            <div class="text-center lg:text-left col-span-2 lg:col-span-2 xl:col-span-2">
              <span class="text-text-dark">Waktu Update:</span>
              <span class="font-medium text-text-dark ml-1 block lg:inline">{{ new Date().toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
