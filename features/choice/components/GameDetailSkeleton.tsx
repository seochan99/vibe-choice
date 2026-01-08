'use client'

import { Card } from '@/shared/ui'
import { Skeleton } from '@/shared/ui/Skeleton'

export function GameDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 스켈레톤 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Skeleton className="h-4 w-16 mb-3" variant="text" />
          <Skeleton className="h-8 w-64" variant="text" />
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 게임 정보 카드 스켈레톤 */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" variant="circular" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" variant="text" />
                <Skeleton className="h-3 w-20" variant="text" />
              </div>
            </div>
            <div className="flex items-center gap-5">
              <Skeleton className="h-4 w-12" variant="text" />
              <Skeleton className="h-4 w-12" variant="text" />
              <Skeleton className="h-4 w-12" variant="text" />
            </div>
          </div>
        </Card>

        {/* 선택 버튼 스켈레톤 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="w-full h-96 rounded-2xl" />
          <Skeleton className="w-full h-96 rounded-2xl" />
        </div>

        {/* 통계 카드 스켈레톤 */}
        <Card className="p-6 mb-8">
          <Skeleton className="h-6 w-32 mb-6" variant="text" />
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <Skeleton className="h-4 w-24" variant="text" />
                <Skeleton className="h-4 w-20" variant="text" />
              </div>
              <Skeleton className="w-full h-2.5 rounded-full" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <Skeleton className="h-4 w-24" variant="text" />
                <Skeleton className="h-4 w-20" variant="text" />
              </div>
              <Skeleton className="w-full h-2.5 rounded-full" />
            </div>
          </div>
        </Card>

        {/* 댓글 섹션 스켈레톤 */}
        <Card className="p-6">
          <Skeleton className="h-6 w-24 mb-6" variant="text" />
          <Skeleton className="h-20 w-full mb-4 rounded-xl" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="w-8 h-8 rounded-full" variant="circular" />
                  <Skeleton className="h-4 w-24" variant="text" />
                </div>
                <Skeleton className="h-4 w-full mb-1" variant="text" />
                <Skeleton className="h-4 w-3/4" variant="text" />
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}


