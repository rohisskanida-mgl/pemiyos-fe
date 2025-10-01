<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import CandidateCarousel from '@/components/CandidateCarousel.vue'
import Accordion from '@/components/Accordion.vue'
import VoteButton from '@/components/VoteButton.vue'
import Modal from '@/components/Modal.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { success } = useToast()

const positionId = computed(() => route.params.id as string)
const showConfirmModal = ref(false)
const selectedCandidate = ref<(typeof candidates.value)[0] | null>(null)
const selectedFocused = ref(1) // Start with candidate at index 1

// Sample candidates data - in real app, this would come from API
const candidates = ref([
  {
    id: 1,
    name: 'John Doe',
    positionNumber: 1,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    ],
    profileHtml:
      '<p>Mahasiswa Teknik Informatika angkatan 2021. Aktif dalam berbagai organisasi kampus dan memiliki pengalaman kepemimpinan yang baik.</p>',
    visionHtml:
      '<p><strong>Visi:</strong> Menjadikan organisasi yang transparan, akuntabel, dan melayani seluruh anggota dengan sepenuh hati.</p>',
    missionHtml:
      '<p><strong>Misi:</strong><br>1. Meningkatkan kualitas pelayanan kepada anggota<br>2. Mengembangkan program-program yang bermanfaat<br>3. Menjalin komunikasi yang baik dengan semua pihak</p>',
    programHtml:
      '<p><strong>Program Kerja:</strong><br>• Digitalisasi sistem administrasi<br>• Program mentoring untuk anggota baru<br>• Kegiatan sosial dan pengabdian masyarakat<br>• Peningkatan fasilitas organisasi</p>',
  },
  {
    id: 2,
    name: 'Jane Smith',
    positionNumber: 2,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    ],
    profileHtml:
      '<p>Mahasiswa Manajemen angkatan 2020. Berpengalaman dalam bidang administrasi dan organisasi.</p>',
    visionHtml:
      '<p><strong>Visi:</strong> Membangun organisasi yang efisien dan berdaya saing tinggi.</p>',
    missionHtml:
      '<p><strong>Misi:</strong><br>1. Mengoptimalkan sistem administrasi<br>2. Meningkatkan kinerja organisasi<br>3. Membangun jaringan yang luas</p>',
    programHtml:
      '<p><strong>Program Kerja:</strong><br>• Sistem informasi terintegrasi<br>• Pelatihan soft skills<br>• Kerjasama dengan pihak eksternal<br>• Evaluasi kinerja berkala</p>',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    positionNumber: 3,
    photos: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    ],
    profileHtml:
      '<p>Mahasiswa Ekonomi angkatan 2021. Memiliki kemampuan komunikasi yang baik dan pengalaman dalam bidang keuangan.</p>',
    visionHtml:
      '<p><strong>Visi:</strong> Menciptakan organisasi yang mandiri secara finansial dan transparan dalam pengelolaan keuangan.</p>',
    missionHtml:
      '<p><strong>Misi:</strong><br>1. Mengelola keuangan dengan transparan<br>2. Mencari sumber pendanaan alternatif<br>3. Mengoptimalkan penggunaan anggaran</p>',
    programHtml:
      '<p><strong>Program Kerja:</strong><br>• Sistem akuntansi digital<br>• Program fundraising<br>• Audit keuangan berkala<br>• Pelatihan manajemen keuangan</p>',
  },
])

const positionTitles: Record<string, string> = {
  '1': 'Ketua & Wakil',
  '2': 'Sekretaris',
  '3': 'Bendahara',
  '4': 'Humas',
}

const currentPositionTitle = computed(() => {
  return positionTitles[positionId.value] || 'Posisi Tidak Diketahui'
})

const currentCandidate = computed(() => {
  return candidates.value[selectedFocused.value] || candidates.value[0]
})

const handleVote = (candidate: (typeof candidates.value)[0]) => {
  selectedCandidate.value = candidate
  showConfirmModal.value = true
}

const confirmVote = () => {
  if (selectedCandidate.value) {
    success(`Vote untuk ${selectedCandidate.value.name} berhasil!`)
    showConfirmModal.value = false
    // Navigate back to voting page
    router.push('/vote')
  }
}

const cancelVote = () => {
  showConfirmModal.value = false
  selectedCandidate.value = null
}

const goBack = () => {
  router.push('/vote')
}

const goToPrevious = () => {
  selectedFocused.value =
    selectedFocused.value === 0 ? candidates.value.length - 1 : selectedFocused.value - 1
}

const goToNext = () => {
  selectedFocused.value = (selectedFocused.value + 1) % candidates.value.length
}

// For infinite rotation, navigation buttons are always enabled
const canGoPrevious = computed(() => true)
const canGoNext = computed(() => true)
</script>

<template>
  <div class="min-h-screen bg-light-bg flex flex-col">
    <!-- Header -->
    <div class="bg-secondary text-text-light mt-3 p-2">
      <div class="flex items-center justify-between">
        <div class="flex flex-row items-center gap-3">
          <button @click="goBack" class="p-2 rounded-lg hover:brightness-95 transition-colors">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <h1 class="text-xl font-semibold">{{ currentPositionTitle }}</h1>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 pb-20">
      <!-- Candidate Carousel -->
      <CandidateCarousel :candidates="candidates" v-model="selectedFocused" />

      <!-- Accordion -->
      <div class="px-4 mb-6">
        <Accordion :candidate="currentCandidate" />
      </div>
    </div>

    <!-- Fixed Bottom Navigation and Vote -->
    <div class="fixed bottom-0 left-0 right-0 bg-text-light border-t border-divider px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Left Navigation -->
        <button
          @click="goToPrevious"
          :disabled="!canGoPrevious"
          class="w-12 h-12 rounded-full bg-light-bg flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft class="w-6 h-6 text-text-dark" />
        </button>

        <!-- Center Vote Button -->
        <div class="flex-1 max-w-xs mx-4">
          <VoteButton :candidate="currentCandidate" @vote="handleVote" />
        </div>

        <!-- Right Navigation -->
        <button
          @click="goToNext"
          :disabled="!canGoNext"
          class="w-12 h-12 rounded-full bg-light-bg flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight class="w-6 h-6 text-text-dark" />
        </button>
      </div>
    </div>

    <!-- Vote Confirmation Modal -->
    <Modal
      :is-open="showConfirmModal"
      title="Konfirmasi Vote"
      subtitle="Apakah Anda yakin ingin memilih kandidat ini?"
      type="confirm"
      @close="cancelVote"
      @confirm="confirmVote"
    >
      <div v-if="selectedCandidate" class="text-center py-4">
        <div
          class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3"
        >
          <span class="text-xl font-bold text-white">{{ selectedCandidate.name.charAt(0) }}</span>
        </div>
        <h3 class="font-semibold text-text-dark">{{ selectedCandidate.name }}</h3>
        <p class="text-sm text-text-dark">No. Urut {{ selectedCandidate.positionNumber }}</p>
      </div>
    </Modal>
  </div>
</template>
