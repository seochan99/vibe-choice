'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300) // 애니메이션 시간
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-gray-900 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
        'px-6 py-3 rounded-xl shadow-lg',
        'transition-all duration-300 ease-out',
        typeStyles[type],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <p className="text-sm font-medium whitespace-nowrap">{message}</p>
    </div>
  )
}

