'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreateGameForm } from '@/features/choice/components'
import { ProtectedRoute } from '@/features/auth'
import { trackStartCoreFlow } from '@/shared/lib/gtag'

export default function CreateGamePageClient() {
  const router = useRouter()

  useEffect(() => {
    // 핵심 플로우 시작 이벤트 추적
    trackStartCoreFlow()
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 mb-3 flex items-center gap-2 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              뒤로가기
            </button>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">게임 만들기</h1>
            <p className="text-sm text-gray-500 mt-1.5">
              두 가지 선택지로 재밌는 게임을 만들어보세요
            </p>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <CreateGameForm />
        </main>
      </div>
    </ProtectedRoute>
  )
}


