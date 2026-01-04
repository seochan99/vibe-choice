'use client'

import { cn } from '@/shared/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'text'
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200'
  
  const variantClasses = {
    default: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded',
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
    />
  )
}

