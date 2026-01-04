import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
}

export function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden',
        'transition-all duration-300 ease-out',
        hover && [
          'hover:shadow-lg hover:border-gray-300 cursor-pointer',
          'hover:scale-[1.02] hover:-translate-y-1'
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
