/**
 * Supabase 클라이언트 유틸리티
 * 
 * 클라이언트 사이드와 서버 사이드에서 사용할 수 있는 Supabase 클라이언트를 제공합니다.
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/shared/types/database'

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 환경 변수가 설정되지 않았습니다.')
  console.warn('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || '❌')
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ (설정됨)' : '❌')
}

// 싱글톤 인스턴스 저장
let browserClientInstance: ReturnType<typeof createClient<Database>> | null = null
let serverClientInstance: ReturnType<typeof createClient<Database>> | null = null

/**
 * 클라이언트 사이드용 Supabase 클라이언트 (싱글톤)
 * 브라우저에서 사용합니다. 한 번만 생성되고 재사용됩니다.
 */
export function createBrowserClient() {
  // 브라우저 환경이 아니면 에러
  if (typeof window === 'undefined') {
    throw new Error('createBrowserClient can only be used in browser environment')
  }

  // 이미 생성된 인스턴스가 있으면 재사용
  if (browserClientInstance) {
    return browserClientInstance
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    )
  }

  // 새 인스턴스 생성 및 저장
  browserClientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return browserClientInstance
}

/**
 * 서버 사이드용 Supabase 클라이언트
 * Next.js 서버 컴포넌트나 API 라우트에서 사용합니다.
 */
export function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    )
  }

  // 서버 사이드에서는 매번 새로 생성 (요청별로 독립적)
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * 관리자 권한이 필요한 작업을 위한 Supabase 클라이언트
 * Service Role Key를 사용합니다.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase admin credentials. SUPABASE_SERVICE_ROLE_KEY is required.'
    )
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * 브라우저 클라이언트 인스턴스 가져오기 (직접 접근용)
 * 싱글톤 인스턴스를 반환합니다.
 */
export function getBrowserClient() {
  if (typeof window === 'undefined') {
    return null
  }
  
  if (!browserClientInstance) {
    return createBrowserClient()
  }
  
  return browserClientInstance
}

// 기본 export (하위 호환성을 위해)
export const supabase = typeof window !== 'undefined' 
  ? (() => {
      if (!browserClientInstance) {
        browserClientInstance = createBrowserClient()
      }
      return browserClientInstance
    })()
  : createServerClient()
