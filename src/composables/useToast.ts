import { ref, readonly } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
  duration?: number
  autoDismiss?: boolean
  timestamp: number
}

const toasts = ref<ToastItem[]>([])
let nextId = 1

export function useToast() {
  function show(
    message: string, 
    type: ToastType = 'info', 
    options: { duration?: number; autoDismiss?: boolean } = {}
  ) {
    const id = nextId++
    const { duration = 5000, autoDismiss = true } = options
    
    const toast: ToastItem = {
      id,
      message,
      type,
      duration,
      autoDismiss,
      timestamp: Date.now()
    }
    
    toasts.value.push(toast)
    
    // Auto dismiss if enabled
    if (autoDismiss && duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }
    
    return id
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function dismissAll() {
    toasts.value = []
  }

  function success(message: string, options?: { duration?: number; autoDismiss?: boolean }) {
    return show(message, 'success', options)
  }

  function error(message: string, options?: { duration?: number; autoDismiss?: boolean }) {
    return show(message, 'error', { duration: 7000, ...options }) // Errors stay longer
  }

  function warning(message: string, options?: { duration?: number; autoDismiss?: boolean }) {
    return show(message, 'warning', options)
  }

  function info(message: string, options?: { duration?: number; autoDismiss?: boolean }) {
    return show(message, 'info', options)
  }

  function getToastById(id: number) {
    return toasts.value.find(t => t.id === id)
  }

  function getToastsByType(type: ToastType) {
    return toasts.value.filter(t => t.type === type)
  }

  return {
    toasts: readonly(toasts),
    show,
    dismiss,
    dismissAll,
    success,
    error,
    warning,
    info,
    getToastById,
    getToastsByType,
  }
}


