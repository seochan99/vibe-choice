// 인증 관련 유틸리티 함수
import { getBrowserClient } from '@/shared/lib/supabase-client'
import type { User } from '@/entities/user'

// 싱글톤 클라이언트 가져오기 헬퍼
function getSupabase() {
  const client = getBrowserClient()
  if (!client) {
    throw new Error('Supabase client is not available in this environment')
  }
  return client
}

export interface AuthUser extends Omit<User, 'email'> {
  email: string | null
}

/**
 * Google OAuth 로그인
 */
export async function signInWithGoogle() {
  const supabase = getSupabase()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

/**
 * 로그아웃
 */
export async function signOut() {
  const supabase = getSupabase()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

/**
 * 현재 세션 가져오기
 */
export async function getSession() {
  try {
    const supabase = getSupabase()
    
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Get session error:', error)
      return null
    }

    return session
  } catch (error) {
    console.error('Get session exception:', error)
    return null
  }
}

/**
 * 현재 사용자 정보 가져오기
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = getSupabase()
  
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  if (authError || !authUser) {
    return null
  }

  // public.users 테이블에서 사용자 정보 가져오기
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (error) {
      // 사용자가 없으면 생성 (트리거가 작동하지 않은 경우 대비)
      if (error.code === 'PGRST116') {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email || null,
          } as any)
          .select()
          .single()

        if (insertError) {
          console.error('Failed to create user:', insertError)
          return null
        }

        if (!newUser) {
          return null
        }

        const userData = newUser as any
        return {
          ...userData,
          email: authUser.email || null,
        } as AuthUser
      }

    console.error('Failed to get user:', error)
    return null
  }

  const userData = user as any
  return {
    ...userData,
    email: authUser.email || null,
  } as AuthUser
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateUserProfile(updates: {
  username?: string
  avatar_url?: string
}) {
  const supabase = getSupabase()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('users')
    // @ts-expect-error - Supabase 타입 추론 문제
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

