'use client'

import { Card } from '@/shared/ui'
import { Skeleton } from '@/shared/ui/Skeleton'

export function GameCardSkeleton() {
  return (
    <Card className="h-full">
      <div className="p-6">
        {/* 제목 스켈레톤 */}
        <Skeleton className="h-6 w-3/4 mb-5" variant="text" />
        
        {/* 선택지 이미지 스켈레톤 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
        </div>
        
        {/* 하단 정보 스켈레톤 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" variant="text" />
            <Skeleton className="h-4 w-12" variant="text" />
          </div>
          <Skeleton className="h-4 w-24" variant="text" />
        </div>
      </div>
    </Card>
  )
}

