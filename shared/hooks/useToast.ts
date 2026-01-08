'use client'

import { useState, useCallback } from 'react'

interface ToastState {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, isVisible: true })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  return {
    toast,
    showToast,
    hideToast,
  }
}


