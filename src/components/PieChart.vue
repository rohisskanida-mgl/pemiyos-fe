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
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed || 0
          return `${label}: ${value}%`
        },
      },
    },
    title: {
      display: !!props.title,
      text: props.title,
      font: {
        size: 16,
        weight: 'bold' as const,
      },
      padding: 20,
    },
  },
  elements: {
    arc: {
      borderWidth: 2,
    },
  },
}))
</script>

<template>
  <div class="bg-text-light rounded-xl shadow-sm p-4">
    <div class="h-80 w-full">
      <Pie :data="chartData" :options="chartOptions" />
    </div>

    <!-- Additional info if needed -->
    <div v-if="data.length === 0" class="flex items-center justify-center h-80 text-text-dark">
      <p>No data available</p>
    </div>
  </div>
</template>

<style scoped>
/* Ensure chart container has proper dimensions */
:deep(.chartjs-render-monitor) {
  max-height: 320px;
}
</style>
