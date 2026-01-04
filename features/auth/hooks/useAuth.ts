'use client'

// 인증 관련 훅
import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { signInWithGoogle, signOut as signOutUser } from '../lib/auth'

// 전역 리스너 설정 플래그 (모듈 레벨에서 관리)
let globalListenerSetup = false
let globalSubscription: any = null
let isInitializing = false

export function useAuth() {
  const {
    user,
    isLoading,
    isAuthenticated,
    isInitialized,
    checkAuth,
    clearAuth,
  } = useAuthStore()

  const initRef = useRef(false)

  useEffect(() => {
    // 전역 리스너는 한 번만 설정
    if (!globalListenerSetup && typeof window !== 'undefined') {
      try {
        const { getBrowserClient } = require('@/shared/lib/supabase-client')
        const supabase = getBrowserClient()
        
        if (supabase) {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
            const currentState = useAuthStore.getState()
            
            // 로딩 중이거나 초기화 중이면 무시
            if (currentState.isLoading || isInitializing) {
              return
            }

            if (event === 'SIGNED_IN' && session) {
              isInitializing = true
              try {
                await currentState.checkAuth()
              } finally {
                isInitializing = false
              }
            } else if (event === 'SIGNED_OUT') {
              currentState.clearAuth()
            }
            // TOKEN_REFRESHED는 제거 (너무 자주 호출됨)
          })

          globalSubscription = subscription
          globalListenerSetup = true
        }
      } catch (error) {
        console.error('Failed to setup auth listener:', error)
      }
    }

    // 초기 인증 확인 (한 번만, 전역적으로)
    if (!isInitialized && !isLoading && !initRef.current && !isInitializing) {
      const storeState = useAuthStore.getState()
      // 다른 컴포넌트에서 이미 초기화 중이면 스킵
      if (storeState.isLoading || storeState.isInitialized) {
        initRef.current = true
        return
      }
      
      initRef.current = true
      isInitializing = true
      checkAuth().finally(() => {
        isInitializing = false
      })
    }

    return () => {
      // 컴포넌트 언마운트 시에는 아무것도 하지 않음
      // 전역 리스너는 앱 전체 생명주기 동안 유지
    }
  }, [isInitialized, isLoading, checkAuth])

  const signIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await signOutUser()
      clearAuth()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    checkAuth,
  }
}
