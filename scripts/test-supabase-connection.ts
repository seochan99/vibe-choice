/**
 * Supabase 연결 테스트 스크립트
 * 
 * 실행 방법:
 * npx tsx scripts/test-supabase-connection.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌')
  process.exit(1)
}

console.log('🔌 Supabase 연결 테스트 시작...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // 간단한 연결 테스트 - auth.users 테이블 확인 (항상 존재)
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      // 인증 오류는 무시 (테이블 접근 테스트)
      console.log('⚠️  인증 세션 확인 실패 (정상일 수 있음)')
    }
    
    // public 스키마의 테이블 존재 여부 확인
    const { error: tableError } = await supabase.from('games').select('id').limit(0)
    
    if (tableError) {
      // 테이블이 없어도 연결은 성공한 것으로 간주
      if (
        tableError.code === 'PGRST116' || 
        tableError.message.includes('does not exist') ||
        tableError.message.includes('schema cache')
      ) {
        console.log('✅ Supabase 연결 성공!')
        console.log('⚠️  데이터베이스 테이블이 아직 생성되지 않았습니다.')
        console.log('💡 다음 단계:')
        console.log('   1. Supabase Dashboard → SQL Editor 접속')
        console.log('   2. supabase/migrations/001_initial_schema.sql 파일 내용 복사')
        console.log('   3. SQL Editor에 붙여넣고 실행')
        return
      }
      throw tableError
    }
    
    console.log('✅ Supabase 연결 성공!')
    console.log('✅ 데이터베이스 테이블 접근 가능')
  } catch (error: any) {
    console.error('❌ 연결 실패:', error.message)
    console.error('   오류 코드:', error.code)
    process.exit(1)
  }
}

testConnection()

