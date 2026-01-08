'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/shared/lib/gtag'

/**
 * SPA 라우트 변경 시 자동으로 page_view 이벤트를 전송하는 컴포넌트
 */
function PageViewTrackerContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return

    // 쿼리 파라미터 포함한 전체 URL 생성
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    // 페이지뷰 추적
    pageview(url)
  }, [pathname, searchParams])

  return null
}

export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerContent />
    </Suspense>
  )
}

