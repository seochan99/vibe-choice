// 투표 관련 서비스 함수
import { getBrowserClient } from '@/shared/lib/supabase-client'

/**
 * 익명 사용자 ID 가져오기 또는 생성
 * UUID 형식으로 생성하여 user_id 컬럼에 저장 가능하도록 함
 */
function getAnonymousUserId(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const storageKey = 'vibe-choice-anonymous-id'
  let anonymousId = localStorage.getItem(storageKey)

  if (!anonymousId) {
    // UUID v4 형식의 임시 ID 생성
    anonymousId = crypto.randomUUID()
    localStorage.setItem(storageKey, anonymousId)
  }

  return anonymousId
}

/**
 * 현재 사용자 ID 가져오기 (로그인한 경우 auth.uid(), 아닌 경우 익명 ID)
 */
async function getCurrentUserId(): Promise<string | null> {
  const supabase = getBrowserClient()
  if (!supabase) {
    return getAnonymousUserId()
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      return user.id
    }
  } catch (error) {
    console.error('Failed to get current user:', error)
  }

  // 로그인하지 않은 경우 익명 ID 반환
  return getAnonymousUserId()
}

/**
 * 게임에 대한 사용자의 투표 정보 가져오기
 */
export async function getUserVote(gameId: string): Promise<'A' | 'B' | null> {
  const supabase = getBrowserClient()
  if (!supabase) {
    return null
  }

  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return null
    }

    // user_id로 조회 (로그인한 사용자 또는 익명 사용자)
    const { data: vote, error } = await (supabase
      .from('votes')
      .select('choice')
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .single() as any)

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to get user vote:', error)
      return null
    }

    return vote?.choice as 'A' | 'B' | null
  } catch (error) {
    console.error('Failed to get user vote:', error)
    return null
  }
}

/**
 * 투표하기
 */
export async function voteGame(gameId: string, choice: 'A' | 'B'): Promise<void> {
  const supabase = getBrowserClient()
  if (!supabase) {
    throw new Error('Supabase client is not available')
  }

  try {
    // 현재 사용자 확인
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    let userId: string

    if (authUser) {
      // 로그인한 사용자
      userId = authUser.id
    } else {
      // 익명 사용자: UUID 형식의 익명 ID 사용
      userId = getAnonymousUserId()
    }

    // 기존 투표 확인
    const existingVote = await getUserVote(gameId)
    if (existingVote) {
      // 이미 투표한 경우 업데이트
      const { error: updateError } = await (supabase
        .from('votes')
        // @ts-expect-error - Supabase 타입 추론 문제
        .update({ choice })
        .eq('game_id', gameId)
        .eq('user_id', userId) as any)

      if (updateError) {
        throw updateError
      }
    } else {
      // 새 투표 생성
      const { error: insertError } = await (supabase
        .from('votes')
        // @ts-expect-error - Supabase 타입 추론 문제
        .insert({
          game_id: gameId,
          user_id: userId,
          choice,
        }) as any)

      if (insertError) {
        // 중복 투표 오류인 경우 업데이트 시도
        if (insertError.code === '23505') {
          const { error: updateError } = await (supabase
            .from('votes')
            // @ts-expect-error - Supabase 타입 추론 문제
            .update({ choice })
            .eq('game_id', gameId)
            .eq('user_id', userId) as any)

          if (updateError) {
            throw updateError
          }
        } else {
          throw insertError
        }
      }
    }
  } catch (error) {
    console.error('Failed to vote:', error)
    throw error
  }
}

