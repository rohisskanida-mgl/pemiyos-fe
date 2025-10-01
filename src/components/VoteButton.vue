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
}

const props = defineProps<Props>()

const emit = defineEmits<{
  vote: [candidate: Candidate]
}>()

function handleVote() {
  emit('vote', props.candidate)
}
</script>

<template>
  <button
    class="w-full py-4 rounded-xl bg-success-accent text-text-light font-semibold text-lg hover:brightness-95 transition-colors"
    @click="handleVote"
  >
    Vote
  </button>
</template>
