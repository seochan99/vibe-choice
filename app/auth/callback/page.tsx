'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getBrowserClient } from '@/shared/lib/supabase-client'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        console.error('Auth error:', error)
        router.push('/?error=auth_failed')
        return
      }

      if (code) {
        // 코드가 있으면 세션 교환
        const supabase = getBrowserClient()
        
        if (!supabase) {
          router.push('/?error=auth_failed')
          return
        }
        
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('Session exchange error:', exchangeError)
            router.push('/?error=auth_failed')
            return
          }

          // 인증 상태 확인
          await checkAuth()
          
          // 상태 업데이트를 기다린 후 리다이렉트
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // 사용자 정보 확인하여 닉네임이 없으면 닉네임 설정 페이지로, 있으면 메인으로
          const state = useAuthStore.getState()
          if (state.user && !state.user.username) {
            router.push('/setup-username')
          } else {
            router.push('/')
          }
          router.refresh() // 페이지 새로고침으로 상태 동기화
        } catch (err) {
          console.error('Callback error:', err)
          router.push('/?error=auth_failed')
        }
      } else {
        // 코드가 없으면 인증 상태만 확인하고 리다이렉트
        await checkAuth()
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 사용자 정보 확인하여 닉네임이 없으면 닉네임 설정 페이지로, 있으면 메인으로
        const state = useAuthStore.getState()
        if (state.user && !state.user.username) {
          router.push('/setup-username')
        } else {
          router.push('/')
        }
        router.refresh()
      }
    }

    handleCallback()
  }, [searchParams, router, checkAuth])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">잠깐만요...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">잠깐만요...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}

