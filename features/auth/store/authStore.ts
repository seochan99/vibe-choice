// Zustand 인증 스토어
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '../lib/auth'
import { getCurrentUser, getSession } from '../lib/auth'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isInitialized: boolean // 초기화 여부 플래그
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  checkAuth: () => Promise<void>
  clearAuth: () => void
  setInitialized: (initialized: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialized: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setInitialized: (initialized) => {
        set({ isInitialized: initialized })
      },

      checkAuth: async () => {
        const currentState = get()
        
        // 이미 로딩 중이거나 초기화 완료되었으면 중복 호출 방지
        if (currentState.isLoading || (currentState.isInitialized && currentState.user)) {
          return
        }

        try {
          set({ isLoading: true })

          const session = await getSession()
          
          if (!session) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            })
            return
          }

          const user = await getCurrentUser()
          
          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
            isInitialized: true,
          })
        } catch (error) {
          console.error('Auth check failed:', error)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          })
        }
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Local Storage에는 사용자 ID만 저장 (민감 정보 제외)
        user: state.user ? { id: state.user.id } : null,
        isAuthenticated: state.isAuthenticated,
        // isInitialized는 저장하지 않음 (항상 초기화부터 시작)
      }),
      onRehydrateStorage: () => (state) => {
        // Local Storage에서 복원 후 상태만 설정
        if (state) {
          state.isLoading = false
          state.isInitialized = false // 복원 후 다시 초기화 필요
        }
      },
    }
  )
)
