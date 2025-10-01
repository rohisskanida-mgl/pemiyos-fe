<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, BarChart3, PieChart as PieChartIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import PieChart from '@/components/PieChart.vue'
import ResultsBar from '@/components/ResultsBar.vue'

const router = useRouter()
const viewMode = ref<'chart' | 'bar'>('chart')

// Sample results data for different positions
const resultsData = ref({
  'Ketua & Wakil': [
    { name: 'John Doe', percentage: 45.2, votes: 1250 },
    { name: 'Jane Smith', percentage: 32.8, votes: 907 },
    { name: 'Mike Johnson', percentage: 22.0, votes: 608 },
  ],
  Sekretaris: [
    { name: 'Alice Brown', percentage: 58.5, votes: 890 },
    { name: 'Bob Wilson', percentage: 41.5, votes: 632 },
  ],
  Bendahara: [
    { name: 'Carol Davis', percentage: 52.3, votes: 756 },
    { name: 'David Miller', percentage: 47.7, votes: 689 },
  ],
})

// Quick results - overall winners
const quickResults = computed(() => {
  const winners: any[] = []
  Object.entries(resultsData.value).forEach(([position, candidates]) => {
    const winner = candidates[0] // Already sorted by percentage
    winners.push({
      position,
      winner: winner.name,
      percentage: winner.percentage,
      votes: winner.votes,
    })
  })
  return winners
})

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'chart' ? 'bar' : 'chart'
}

const goBack = () => {
  router.replace('/')
}
</script>

<template>
  <section class="min-h-screen px-4 py-6 flex flex-col gap-4 bg-light-bg">
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="goBack"
          aria-label="Back"
          class="p-2 rounded-lg bg-text-light border border-divider"
        >
          <ArrowLeft :size="20" />
        </button>
        <h2 class="text-xl font-semibold">Hasil Pemilihan</h2>
      </div>

      <!-- View Toggle -->
      <div class="flex bg-text-light rounded-lg border border-divider">
        <button
          @click="viewMode = 'chart'"
          :class="[
            'p-2 rounded-l-lg transition-colors',
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
            'p-2 rounded-r-lg transition-colors',
            viewMode === 'bar'
              ? 'bg-info-accent text-text-light'
              : 'text-text-dark hover:bg-light-bg',
          ]"
        >
          <BarChart3 class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Hasil Cepat Section -->
    <div class="bg-text-light rounded-xl shadow-sm p-4">
      <h3 class="text-lg font-semibold text-text-dark mb-4">Hasil Cepat</h3>
      <div class="space-y-3">
        <div
          v-for="(result, index) in quickResults"
          :key="result.position"
          class="flex items-center justify-between p-3 bg-light-bg rounded-lg"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 bg-success-accent rounded-full flex items-center justify-center text-text-light font-bold text-sm"
            >
              {{ index + 1 }}
            </div>
            <div>
              <h4 class="font-medium text-text-dark">{{ result.position }}</h4>
              <p class="text-sm text-text-dark">{{ result.winner }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-success-accent">{{ result.percentage }}%</p>
            <p class="text-xs text-text-dark">{{ result.votes }} suara</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Results by Position -->
    <div class="space-y-4">
      <div
        v-for="(candidates, position) in resultsData"
        :key="position"
        class="bg-white rounded-xl shadow-sm p-4"
      >
        <h3 class="text-lg font-semibold text-text-dark mb-4">{{ position }}</h3>

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
    <div class="bg-text-light rounded-xl shadow-sm p-4">
      <h3 class="text-lg font-semibold text-text-dark mb-2">Ringkasan</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-text-dark">Total Posisi:</span>
          <span class="font-medium text-text-dark ml-1">{{ Object.keys(resultsData).length }}</span>
        </div>
        <div>
          <span class="text-text-dark">Total Suara:</span>
          <span class="font-medium text-text-dark ml-1">
            {{
              Object.values(resultsData)
                .flat()
                .reduce((sum, candidate) => sum + candidate.votes, 0)
                .toLocaleString()
            }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
