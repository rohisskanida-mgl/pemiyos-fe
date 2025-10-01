<script setup lang="ts">
interface Candidate {
  id: number
  name: string
  positionNumber: number
  photos: string[]
  profileHtml?: string
  visionHtml?: string
  missionHtml?: string
  programHtml?: string
}

interface Props {
  candidate: Candidate
  isFocused: boolean
}

defineProps<Props>()
</script>

<template>
  <div
    class="transition-all duration-300"
    :class="isFocused ? 'scale-100 opacity-100' : 'scale-90 opacity-50 blur-sm'"
  >
    <div class="relative overflow-hidden rounded-lg bg-primary">
      <img
        v-if="candidate.photos?.[0]"
        :src="candidate.photos[0]"
        alt="Candidate photo"
        class="w-full h-64 object-cover"
      />
    </div>

    <!-- Candidate Label -->
    <div class="text-center mt-2">
      <h3 class="text-lg font-bold text-text-dark">Kandidat {{ candidate.positionNumber }}</h3>
    </div>
  </div>
</template>
