import { ref, readonly } from 'vue'

export interface ModalOptions {
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  persistent?: boolean
  centered?: boolean
  scrollable?: boolean
  data?: Record<string, unknown>
}

export interface ModalState {
  id: string
  isOpen: boolean
  component: string | null
  options: ModalOptions
  timestamp: number
}

const modals = ref<Map<string, ModalState>>(new Map())
let nextId = 1

export function useModal() {
  function open(
    component: string, 
    options: ModalOptions = {}
  ): string {
    const id = `modal-${nextId++}`
    const defaultOptions: ModalOptions = {
      size: 'md',
      closable: true,
      persistent: false,
      centered: true,
      scrollable: true,
      ...options
    }
    
    const modalState: ModalState = {
      id,
      isOpen: true,
      component,
      options: defaultOptions,
      timestamp: Date.now()
    }
    
    modals.value.set(id, modalState)
    return id
  }

  function close(id: string) {
    const modal = modals.value.get(id)
    if (modal) {
      modal.isOpen = false
      // Remove from map after a short delay to allow for animations
      setTimeout(() => {
        modals.value.delete(id)
      }, 300)
    }
  }

  function closeAll() {
    modals.value.forEach(modal => {
      modal.isOpen = false
    })
    setTimeout(() => {
      modals.value.clear()
    }, 300)
  }

  function updateOptions(id: string, options: Partial<ModalOptions>) {
    const modal = modals.value.get(id)
    if (modal) {
      modal.options = { ...modal.options, ...options }
    }
  }

  function getModal(id: string) {
    return modals.value.get(id)
  }

  function isOpen(id: string) {
    return modals.value.get(id)?.isOpen || false
  }

  function getOpenModals() {
    return Array.from(modals.value.values()).filter(modal => modal.isOpen)
  }

  function hasOpenModals() {
    return getOpenModals().length > 0
  }

  // Convenience methods for common modal types
  function confirm(
    message: string, 
    options: Omit<ModalOptions, 'component'> = {}
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const id = open('ConfirmModal', {
        title: 'Konfirmasi',
        size: 'sm',
        data: { message, resolve },
        ...options
      })
      
      // Store resolve function for the modal to call
      const modal = modals.value.get(id)
      if (modal) {
        modal.options.data = { ...modal.options.data, modalId: id }
      }
    })
  }

  function alert(
    message: string, 
    options: Omit<ModalOptions, 'component'> = {}
  ): Promise<void> {
    return new Promise((resolve) => {
      const id = open('AlertModal', {
        title: 'Informasi',
        size: 'sm',
        data: { message, resolve },
        ...options
      })
      
      const modal = modals.value.get(id)
      if (modal) {
        modal.options.data = { ...modal.options.data, modalId: id }
      }
    })
  }

  function prompt(
    message: string, 
    defaultValue: string = '',
    options: Omit<ModalOptions, 'component'> = {}
  ): Promise<string | null> {
    return new Promise((resolve) => {
      const id = open('PromptModal', {
        title: 'Input',
        size: 'sm',
        data: { message, defaultValue, resolve },
        ...options
      })
      
      const modal = modals.value.get(id)
      if (modal) {
        modal.options.data = { ...modal.options.data, modalId: id }
      }
    })
  }

  return {
    modals: readonly(modals),
    open,
    close,
    closeAll,
    updateOptions,
    getModal,
    isOpen,
    getOpenModals,
    hasOpenModals,
    confirm,
    alert,
    prompt,
  }
}
