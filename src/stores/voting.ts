import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Position {
  id: number
  title: string
  description?: string
  candidatesCount: number
  isActive: boolean
  votingStartDate?: string
  votingEndDate?: string
}

export interface Candidate {
  id: number
  name: string
  positionNumber: number
  positionId: number
  photos: string[]
  profileHtml?: string
  visionHtml?: string
  missionHtml?: string
  programHtml?: string
  isActive: boolean
}

export interface Vote {
  positionId: number
  candidateId: number
  votedAt: string
}

export interface VotingStatus {
  hasVoted: boolean
  canVote: boolean
  votingPeriod: 'upcoming' | 'active' | 'ended'
  remainingTime?: string
}

export const useVotingStore = defineStore('voting', () => {
  // State
  const positions = ref<Position[]>([
    {
      id: 1,
      title: 'Ketua & Wakil',
      description: 'Pemimpin utama organisasi',
      candidatesCount: 3,
      isActive: true,
      votingStartDate: '2024-01-01T00:00:00Z',
      votingEndDate: '2024-12-31T23:59:59Z',
    },
    {
      id: 2,
      title: 'Sekretaris',
      description: 'Penanggung jawab administrasi',
      candidatesCount: 2,
      isActive: true,
      votingStartDate: '2024-01-01T00:00:00Z',
      votingEndDate: '2024-12-31T23:59:59Z',
    },
    {
      id: 3,
      title: 'Bendahara',
      description: 'Penanggung jawab keuangan',
      candidatesCount: 2,
      isActive: true,
      votingStartDate: '2024-01-01T00:00:00Z',
      votingEndDate: '2024-12-31T23:59:59Z',
    },
    {
      id: 4,
      title: 'Humas',
      description: 'Penanggung jawab hubungan masyarakat',
      candidatesCount: 1,
      isActive: true,
      votingStartDate: '2024-01-01T00:00:00Z',
      votingEndDate: '2024-12-31T23:59:59Z',
    },
  ])

  const candidates = ref<Candidate[]>([
    {
      id: 1,
      name: 'John Doe',
      positionNumber: 1,
      positionId: 1,
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
      ],
      profileHtml: '<p>Mahasiswa Teknik Informatika angkatan 2021. Aktif dalam berbagai organisasi kampus dan memiliki pengalaman kepemimpinan yang baik.</p>',
      visionHtml: '<p><strong>Visi:</strong> Menjadikan organisasi yang transparan, akuntabel, dan melayani seluruh anggota dengan sepenuh hati.</p>',
      missionHtml: '<p><strong>Misi:</strong><br>1. Meningkatkan kualitas pelayanan kepada anggota<br>2. Mengembangkan program-program yang bermanfaat<br>3. Menjalin komunikasi yang baik dengan semua pihak</p>',
      programHtml: '<p><strong>Program Kerja:</strong><br>• Digitalisasi sistem administrasi<br>• Program mentoring untuk anggota baru<br>• Kegiatan sosial dan pengabdian masyarakat<br>• Peningkatan fasilitas organisasi</p>',
      isActive: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      positionNumber: 2,
      positionId: 1,
      photos: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      ],
      profileHtml: '<p>Mahasiswa Manajemen angkatan 2020. Berpengalaman dalam bidang administrasi dan organisasi.</p>',
      visionHtml: '<p><strong>Visi:</strong> Membangun organisasi yang efisien dan berdaya saing tinggi.</p>',
      missionHtml: '<p><strong>Misi:</strong><br>1. Mengoptimalkan sistem administrasi<br>2. Meningkatkan kinerja organisasi<br>3. Membangun jaringan yang luas</p>',
      programHtml: '<p><strong>Program Kerja:</strong><br>• Sistem informasi terintegrasi<br>• Pelatihan soft skills<br>• Kerjasama dengan pihak eksternal<br>• Evaluasi kinerja berkala</p>',
      isActive: true,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      positionNumber: 3,
      positionId: 1,
      photos: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      ],
      profileHtml: '<p>Mahasiswa Ekonomi angkatan 2021. Memiliki kemampuan komunikasi yang baik dan pengalaman dalam bidang keuangan.</p>',
      visionHtml: '<p><strong>Visi:</strong> Menciptakan organisasi yang mandiri secara finansial dan transparan dalam pengelolaan keuangan.</p>',
      missionHtml: '<p><strong>Misi:</strong><br>1. Mengelola keuangan dengan transparan<br>2. Mencari sumber pendanaan alternatif<br>3. Mengoptimalkan penggunaan anggaran</p>',
      programHtml: '<p><strong>Program Kerja:</strong><br>• Sistem akuntansi digital<br>• Program fundraising<br>• Audit keuangan berkala<br>• Pelatihan manajemen keuangan</p>',
      isActive: true,
    },
    {
      id: 4,
      name: 'Alice Brown',
      positionNumber: 1,
      positionId: 2,
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
      ],
      profileHtml: '<p>Mahasiswa Administrasi angkatan 2020. Berpengalaman dalam bidang sekretariat dan dokumentasi.</p>',
      visionHtml: '<p><strong>Visi:</strong> Menciptakan sistem administrasi yang efisien dan terorganisir dengan baik.</p>',
      missionHtml: '<p><strong>Misi:</strong><br>1. Mengoptimalkan sistem dokumentasi<br>2. Meningkatkan efisiensi administrasi<br>3. Membangun sistem arsip digital</p>',
      programHtml: '<p><strong>Program Kerja:</strong><br>• Digitalisasi dokumen<br>• Sistem arsip elektronik<br>• Pelatihan administrasi<br>• Standarisasi prosedur</p>',
      isActive: true,
    },
    {
      id: 5,
      name: 'Bob Wilson',
      positionNumber: 2,
      positionId: 2,
      photos: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face',
      ],
      profileHtml: '<p>Mahasiswa Komunikasi angkatan 2021. Memiliki kemampuan komunikasi yang baik dan pengalaman dalam bidang media.</p>',
      visionHtml: '<p><strong>Visi:</strong> Membangun komunikasi yang efektif dan transparan dalam organisasi.</p>',
      missionHtml: '<p><strong>Misi:</strong><br>1. Meningkatkan komunikasi internal<br>2. Mengembangkan media informasi<br>3. Membangun hubungan yang baik</p>',
      programHtml: '<p><strong>Program Kerja:</strong><br>• Media sosial organisasi<br>• Newsletter berkala<br>• Pelatihan komunikasi<br>• Sistem informasi terpusat</p>',
      isActive: true,
    },
  ])

  const selectedVotes = ref<Map<number, Vote>>(new Map())
  const votingStatus = ref<VotingStatus>({
    hasVoted: false,
    canVote: true,
    votingPeriod: 'active',
    remainingTime: '2 hari 5 jam',
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activePositions = computed(() => 
    positions.value.filter(position => position.isActive)
  )

  const votedPositions = computed(() => 
    Array.from(selectedVotes.value.keys())
  )

  const votingProgress = computed(() => {
    const totalPositions = activePositions.value.length
    const votedCount = votedPositions.value.length
    return {
      voted: votedCount,
      total: totalPositions,
      percentage: totalPositions > 0 ? (votedCount / totalPositions) * 100 : 0,
    }
  })

  const isVotingComplete = computed(() => 
    votedPositions.value.length === activePositions.value.length
  )

  const getCandidatesByPosition = computed(() => (positionId: number) => 
    candidates.value.filter(candidate => 
      candidate.positionId === positionId && candidate.isActive
    )
  )

  const getVoteForPosition = computed(() => (positionId: number) => 
    selectedVotes.value.get(positionId)
  )

  const hasVotedForPosition = computed(() => (positionId: number) => 
    selectedVotes.value.has(positionId)
  )

  // Actions
  const submitVote = async (positionId: number, candidateId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validate position and candidate
      const position = positions.value.find(p => p.id === positionId)
      const candidate = candidates.value.find(c => c.id === candidateId && c.positionId === positionId)

      if (!position || !candidate) {
        error.value = 'Posisi atau kandidat tidak valid'
        return false
      }

      if (!position.isActive) {
        error.value = 'Posisi ini tidak aktif untuk voting'
        return false
      }

      if (!candidate.isActive) {
        error.value = 'Kandidat ini tidak aktif'
        return false
      }

      // Create vote record
      const vote: Vote = {
        positionId,
        candidateId,
        votedAt: new Date().toISOString(),
      }

      // Store the vote
      selectedVotes.value.set(positionId, vote)

      // Update voting status
      votingStatus.value.hasVoted = votedPositions.value.length > 0

      return true
    } catch (err) {
      error.value = 'Terjadi kesalahan saat submit vote'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const removeVote = async (positionId: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Remove vote
      selectedVotes.value.delete(positionId)

      // Update voting status
      votingStatus.value.hasVoted = votedPositions.value.length > 0

      return true
    } catch (err) {
      error.value = 'Terjadi kesalahan saat menghapus vote'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const loadVotingData = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In a real app, this would fetch data from API
      // For now, we'll use the mock data already defined
      
      // Check voting period
      const now = new Date()
      const hasActiveVoting = positions.value.some(position => {
        const startDate = position.votingStartDate ? new Date(position.votingStartDate) : null
        const endDate = position.votingEndDate ? new Date(position.votingEndDate) : null
        
        if (startDate && endDate) {
          return now >= startDate && now <= endDate
        }
        return true
      })

      votingStatus.value.canVote = hasActiveVoting
      votingStatus.value.votingPeriod = hasActiveVoting ? 'active' : 'ended'

    } catch (err) {
      error.value = 'Terjadi kesalahan saat memuat data voting'
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const resetVotes = () => {
    selectedVotes.value.clear()
    votingStatus.value.hasVoted = false
  }

  return {
    // State
    positions,
    candidates,
    selectedVotes,
    votingStatus,
    isLoading,
    error,
    
    // Getters
    activePositions,
    votedPositions,
    votingProgress,
    isVotingComplete,
    getCandidatesByPosition,
    getVoteForPosition,
    hasVotedForPosition,
    
    // Actions
    submitVote,
    removeVote,
    loadVotingData,
    clearError,
    resetVotes,
  }
})
