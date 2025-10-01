<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

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

const sections = ref([
  { key: 'profileHtml', title: 'Profil Kandidat', open: false },
  { key: 'visionHtml', title: 'Visi & Misi', open: false },
  { key: 'programHtml', title: 'Program Kerja', open: false },
])

function toggleSection(idx: number) {
  sections.value[idx].open = !sections.value[idx].open
}
</script>

<template>
  <div class="bg-text-light rounded-xl shadow-sm p-4">
    <!-- Expandable Sections -->
    <div class="divide-y divide-divider">
      <div v-for="(section, idx) in sections" :key="section.key" class="py-3">
        <button class="w-full flex items-center justify-between" @click="toggleSection(idx)">
          <span class="font-medium text-text-dark">{{ section.title }}</span>
          <ChevronDown
            class="w-5 h-5 transition-transform text-text-dark"
            :class="section.open ? 'rotate-180' : 'rotate-0'"
          />
        </button>
        <div
          v-if="section.open && candidate[section.key as keyof Candidate]"
          class="mt-2 text-sm text-text-dark"
          v-html="candidate[section.key as keyof Candidate] as string"
        />
      </div>
    </div>
  </div>
</template>
