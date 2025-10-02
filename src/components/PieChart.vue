<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title)

interface CandidateData {
  name: string
  percentage: number
  votes?: number
}

interface Props {
  data: CandidateData[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Voting Results',
})

// Color scheme using your custom colors
const colors = [
  '#83C9F4', // primary
  '#FFD166', // warn-accent
  '#FF6B6B', // error-accent
  '#22C55E', // success-accent
  '#0EA5E9', // info-accent
  '#6F73D2', // secondary
]

const chartData = computed(() => {
  const labels = props.data.map((item) => item.name)
  const percentages = props.data.map((item) => item.percentage)
  const backgroundColors = colors.slice(0, props.data.length)

  return {
    labels,
    datasets: [
      {
        data: percentages,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((color) => color),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: window.innerWidth >= 1024 ? 24 : 20,
        usePointStyle: true,
        font: {
          size: window.innerWidth >= 1024 ? 14 : 12,
        },
        boxWidth: window.innerWidth >= 1024 ? 16 : 12,
      },
    },
    tooltip: {
      callbacks: {
        label: (context: { label?: string; parsed?: number }) => {
          const label = context.label || ''
          const value = context.parsed || 0
          return `${label}: ${value}%`
        },
      },
      titleFont: {
        size: window.innerWidth >= 1024 ? 16 : 14,
      },
      bodyFont: {
        size: window.innerWidth >= 1024 ? 14 : 12,
      },
    },
    title: {
      display: !!props.title,
      text: props.title,
      font: {
        size: window.innerWidth >= 1024 ? 18 : 16,
        weight: 'bold' as const,
      },
      padding: window.innerWidth >= 1024 ? 24 : 20,
    },
  },
  elements: {
    arc: {
      borderWidth: window.innerWidth >= 1024 ? 3 : 2,
    },
  },
}))
</script>

<template>
  <div class="bg-text-light rounded-xl shadow-sm p-4 lg:p-6">
    <div class="h-80 lg:h-96 xl:h-[28rem] w-full">
      <Pie :data="chartData" :options="chartOptions" />
    </div>

    <!-- Additional info if needed -->
    <div v-if="data.length === 0" class="flex items-center justify-center h-80 lg:h-96 xl:h-[28rem] text-text-dark">
      <p class="text-lg lg:text-xl">No data available</p>
    </div>
  </div>
</template>

<style scoped>
/* Ensure chart container has proper dimensions */
:deep(.chartjs-render-monitor) {
  max-height: 320px;
}

@media (min-width: 1024px) {
  :deep(.chartjs-render-monitor) {
    max-height: 384px;
  }
}

@media (min-width: 1280px) {
  :deep(.chartjs-render-monitor) {
    max-height: 448px;
  }
}
</style>
