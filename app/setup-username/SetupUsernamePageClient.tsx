'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth'
import { UsernameSetup } from '@/features/auth/components/UsernameSetup'

export default function SetupUsernamePageClient() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // 로딩 중이 아니고 인증되지 않은 경우 메인으로 리다이렉트
    if (!isLoading && !isAuthenticated) {
      router.push('/')
      return
    }

    // 로딩 중이 아니고 닉네임이 이미 설정된 경우 메인으로 리다이렉트
    if (!isLoading && isAuthenticated && user?.username) {
      router.push('/')
    }
  }, [user, isAuthenticated, isLoading, router])

  // 로딩 중이거나 인증되지 않았거나 닉네임이 이미 있는 경우
  if (isLoading || !isAuthenticated || (user && user.username)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">잠깐만요...</p>
        </div>
      </div>
    )
  }

  return <UsernameSetup />
}


