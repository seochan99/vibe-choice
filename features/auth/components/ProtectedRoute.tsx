'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * 로그인하지 않은 사용자는 리다이렉트됩니다.
 */
export function ProtectedRoute({ 
  children, 
  redirectTo = '/' 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // 로딩이 완료되고 인증되지 않은 경우 리다이렉트
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">잠깐만요...</p>
        </div>
      </div>
    )
  }

  // 인증되지 않은 경우 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (!isAuthenticated) {
    return null
  }

  // 인증된 사용자에게만 children 렌더링
  return <>{children}</>
}

