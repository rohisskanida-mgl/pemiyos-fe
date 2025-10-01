<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Users, AlertCircle, Check, Menu, User } from 'lucide-vue-next'

const router = useRouter()

// Sample voting positions data matching the image
const votingPositions = ref([
  {
    id: 1,
    title: 'Ketua & Wakil',
    candidatesCount: 3,
    voted: false,
  },
  {
    id: 2,
    title: 'Sekretaris',
    candidatesCount: 7,
    voted: false,
  },
  {
    id: 3,
    title: 'Bendahara',
    candidatesCount: 6,
    voted: true,
  },
])

const handlePositionSelect = (positionId: number) => {
  router.push(`/candidate-selection/${positionId}`)
}
</script>

<template>
  <div class="min-h-screen bg-light-bg">
    <!-- Mobile Header -->
    <div class="bg-secondary px-4 py-3 flex items-center justify-between">
      <!-- Left side - Time and signal icons -->
      <div class="flex items-center space-x-2">
        <span class="text-white text-sm font-medium">9:41</span>
        <div class="flex space-x-1">
          <!-- Signal bars -->
          <div class="w-1 h-3 bg-white rounded-sm"></div>
          <div class="w-1 h-3 bg-white rounded-sm"></div>
          <div class="w-1 h-3 bg-white rounded-sm"></div>
          <div class="w-1 h-3 bg-white rounded-sm"></div>
        </div>
        <!-- WiFi icon -->
        <div class="w-4 h-3 border border-white rounded-sm">
          <div class="w-2 h-1 bg-white rounded-sm mx-auto mt-1"></div>
        </div>
        <!-- Battery icon -->
        <div class="w-6 h-3 border border-white rounded-sm relative">
          <div class="w-4 h-2 bg-white rounded-sm absolute top-0.5 left-0.5"></div>
          <div class="w-0.5 h-1 bg-white rounded-r-sm absolute -right-0.5 top-1"></div>
        </div>
      </div>

      <!-- Center - Title -->
      <h1 class="text-white text-lg font-bold">Pilihan Kandidat</h1>

      <!-- Right side - Menu and profile -->
      <div class="flex items-center space-x-3">
        <Menu class="w-6 h-6 text-white" />
        <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <User class="w-5 h-5 text-secondary" />
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="p-4 space-y-4">
      <!-- Position Cards -->
      <div
        v-for="position in votingPositions"
        :key="position.id"
        class="bg-white rounded-xl shadow-sm p-4"
      >
        <!-- Card Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-text-dark">{{ position.title }}</h3>
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center"
            :class="position.voted ? 'bg-success-accent' : 'bg-info-accent'"
          >
            <AlertCircle v-if="!position.voted" class="w-4 h-4 text-white" />
            <Check v-else class="w-4 h-4 text-white" />
          </div>
        </div>

        <!-- Candidate Info -->
        <div class="flex items-center space-x-3 mb-4">
          <div class="flex -space-x-2">
            <div
              v-for="i in 3"
              :key="i"
              class="w-8 h-8 bg-text-dark rounded-full flex items-center justify-center"
            >
              <Users class="w-4 h-4 text-white" />
            </div>
          </div>
          <span class="text-text-dark font-medium">{{ position.candidatesCount }} Kandidat</span>
        </div>

        <!-- Select Button -->
        <button
          class="w-full py-3 bg-primary text-white font-medium rounded-lg hover:brightness-95 transition-all"
          @click="handlePositionSelect(position.id)"
        >
          Pilih
        </button>
      </div>
    </div>

    <!-- Home Indicator -->
    <div class="flex justify-center py-2">
      <div class="w-32 h-1 bg-text-dark rounded-full"></div>
    </div>
  </div>
</template>
