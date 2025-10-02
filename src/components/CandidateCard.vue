<script setup lang="ts">
interface Candidate {
  id: number
  name: string
  positionNumber: number
  image: string[]
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
    class="transition-all duration-500 ease-in-out transform"
    :class="{
      'scale-100 opacity-100': isFocused,
      'scale-95 opacity-80': !isFocused
    }"
  >
    <div class="relative overflow-hidden rounded-xl bg-primary shadow-lg transition-shadow duration-500"
         :class="{ 'shadow-2xl': isFocused, 'shadow-md': !isFocused }">
      <img
        v-if="candidate.image?.[0]"
        :src="candidate.image[0]"
        alt="Candidate photo"
        class="w-full h-64 object-cover transition-all duration-500"
        :class="{ 'brightness-100': isFocused, 'brightness-75': !isFocused }"
      />
      
      <!-- Overlay for non-focused cards -->
      <div 
        v-if="!isFocused"
        class="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-500"
      />
      
      <!-- Focus indicator -->
      <div 
        v-if="isFocused"
        class="absolute top-2 right-2 w-3 h-3 bg-white rounded-full shadow-md animate-pulse"
      />
    </div>

    <!-- Candidate Label -->
    <div class="text-center mt-3 transition-all duration-500">
      <h3 
        class="font-bold transition-all duration-500"
        :class="{
          'text-xl text-text-dark': isFocused,
          'text-lg text-text-dark opacity-75': !isFocused
        }"
      >
        Kandidat {{ candidate.positionNumber }}
      </h3>
      <p 
        v-if="isFocused && candidate.name"
        class="text-sm text-text-secondary mt-1 opacity-0 animate-fade-in"
        style="animation-delay: 200ms; animation-fill-mode: forwards;"
      >
        {{ candidate.name }}
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
