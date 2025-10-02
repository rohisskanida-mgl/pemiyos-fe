// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginationInfo {
  current_page: number
  total_pages: number
  total_items: number
  per_page: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination?: PaginationInfo
}

// User Types
export interface User {
  _id: string
  nis: string
  nama_lengkap: string
  password?: string // Excluded in responses
  role: 'voter' | 'admin'
  class?: string | null
  gender: 'L' | 'P'
  status: 'active' | 'inactive'
  last_login_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

// Auth Types
export interface LoginRequest {
  nis: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

// Position Types
export interface Position {
  id: string
  positionId: number
  title: string
  description?: string
  candidatesCount?: number
  isActive: boolean
  votingStartDate?: string
  votingEndDate?: string
  status?: 'active' | 'inactive'
  _id?: string
  position_id?: number
  name?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

// Election Types
export interface Election {
  _id: string
  election_id?: number
  name?: string
  description?: string
  period_start: number
  period_end: number
  voting_start?: string
  voting_end?: string
  status: 'upcoming' | 'ongoing' | 'closed'
  created_at: string
  updated_at: string
  deleted_at?: string
}

// Candidate Types
export interface Candidate {
  _id: string
  position_id: number
  candidate_number: number
  period_start: number
  period_end: number
  user_id: string
  name: string
  image?: string
  profile?: string
  vision_mission?: {
    vision?: string
    mission?: string
  }
  program_kerja?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  deleted_at?: string
  // Relations
  position?: Position
  user?: User
}

// Vote Types
export interface Vote {
  _id?: string
  user_id: string
  candidate_id: string
  position_id: number
  period_start: number
  period_end: number
  notes?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
  // Relations
  user?: User
  candidate?: Candidate
  position?: Position
}

// Statistics Types
export interface VoteStatistics {
  position_id: number
  total_votes: number
  data: {
    candidate_number: number
    name: string
    voters: number
  }[]
}

export interface NonVotersResponse {
  position_id: number
  non_voters: {
    _id: string
    nis: string
    nama_lengkap: string
    class?: string
    gender: 'L' | 'P'
  }[]
  total_non_voters: number
}

// Upload Types
export interface UploadResponse {
  files: {
    original_name: string
    saved_name: string
    public_id: string
    url: string
    size: number
    type: string
    format: string
    version?: number
  }[]
  count: number
  message: string
}

// Query Parameters
export interface QueryParams {
  search?: string
  limit?: number | 'no_limit'
  page?: number
  is_count?: boolean
  include_relations?: boolean
  [key: string]: unknown
}
