import apiClient from './axios.config'
import type { UploadResponse } from '@/types/api.types'

class UploadService {
  /**
   * Get upload configuration info
   */
  async getUploadInfo(): Promise<any> {
    const response = await apiClient.get('/api/upload/info')
    return response.data
  }

  /**
   * Upload single file
   */
  async uploadFile(file: File, folderName?: string): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (folderName) {
      formData.append('folder_name', folderName)
    }

    const response = await apiClient.post<UploadResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files: File[], folderName?: string): Promise<UploadResponse> {
    const formData = new FormData()
    
    files.forEach(file => {
      formData.append('file', file)
    })
    
    if (folderName) {
      formData.append('folder_name', folderName)
    }

    const response = await apiClient.post<UploadResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  }

  /**
   * Upload candidate image
   */
  async uploadCandidateImage(file: File): Promise<string> {
    const response = await this.uploadFile(file, 'candidate')
    
    if (response.files && response.files.length > 0 && response.files[0]) {
      return response.files[0].url
    }
    
    throw new Error('Failed to upload image')
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, maxSizeMB = 10): { valid: boolean; error?: string } {
    const maxSize = maxSizeMB * 1024 * 1024 // Convert to bytes
    
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`
      }
    }
    
    // Check file type
    const allowedExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv'
    ]
    
    const fileName = file.name.toLowerCase()
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))
    
    if (!hasValidExtension) {
      return {
        valid: false,
        error: 'File type not supported'
      }
    }
    
    return { valid: true }
  }

  /**
   * Get file preview URL
   */
  getFilePreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  /**
   * Revoke file preview URL
   */
  revokeFilePreviewUrl(url: string): void {
    URL.revokeObjectURL(url)
  }
}

export default new UploadService()
