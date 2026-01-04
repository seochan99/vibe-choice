'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/shared/lib/utils'

interface ChoiceButtonProps {
  choice: 'A' | 'B'
  text: string
  imageUrl?: string | null
  percentage?: number
  onClick: () => void
  disabled?: boolean
  isSelected?: boolean // 사용자가 선택한 선택지인지 여부
}

export function ChoiceButton({
  choice,
  text,
  imageUrl,
  percentage,
  onClick,
  disabled = false,
  isSelected = false,
}: ChoiceButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (disabled || isAnimating) return

    // 클릭 애니메이션 시작
    setIsAnimating(true)
    
    // 애니메이션 완료 후 원래 크기로 복귀
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)

    // 실제 클릭 핸들러 실행
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={cn(
        'relative w-full h-64 sm:h-80 md:h-96 rounded-xl sm:rounded-2xl overflow-hidden',
        'transition-all duration-300 ease-out',
        'border-2',
        isSelected ? 'border-gray-900 border-4' : 'border-gray-300',
        'hover:scale-[1.02] hover:border-gray-400 hover:shadow-xl',
        'active:scale-[0.98]',
        isAnimating && 'scale-105',
        'shadow-lg',
        'touch-manipulation',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && !isAnimating && 'cursor-pointer'
      )}
    >
      {/* 이미지 배경 */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={text}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400" />
      )}
      
      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
      
      {/* 텍스트 영역 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-xl md:text-2xl font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gray-900/80 text-white backdrop-blur-sm">
              {choice}
            </span>
            {isSelected && (
              <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-sm">
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          {percentage !== undefined && (
            <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-lg">
              {percentage}%
            </span>
          )}
        </div>
        <p className="text-white text-base sm:text-lg md:text-2xl font-semibold drop-shadow-lg leading-tight line-clamp-2">
          {text}
        </p>
      </div>
      
      {/* 호버 효과 */}
      {!disabled && (
        <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-300" />
      )}
    </button>
  )
}
