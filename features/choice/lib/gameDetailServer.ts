// 서버 사이드 게임 상세 정보 조회 서비스
import { createServerClient } from '@/shared/lib/supabase-client'
import type { Database } from '@/shared/types/database'

type Game = Database['public']['Tables']['games']['Row']
type User = Database['public']['Tables']['users']['Row']

/**
 * 서버 사이드에서 게임 기본 정보만 조회 (SEO용)
 */
export async function getGameByIdForSEO(gameId: string): Promise<{
  id: string
  title: string
  choice_a: string
  choice_b: string
  image_a_url: string | null
  image_b_url: string | null
  user: {
    username: string | null
  }
} | null> {
  try {
    const supabase = createServerClient()

    // 게임 정보 조회 (사용자 정보 포함)
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select(`
        id,
        title,
        choice_a,
        choice_b,
        image_a_url,
        image_b_url,
        user:users!games_user_id_fkey (
          username
        )
      `)
      .eq('id', gameId)
      .single()

    if (gameError || !game) {
      if (gameError?.code === 'PGRST116') {
        return null // 게임을 찾을 수 없음
      }
      return null
    }

    const gameData = game as any
    const user = gameData.user as User

    return {
      id: gameData.id,
      title: gameData.title,
      choice_a: gameData.choice_a,
      choice_b: gameData.choice_b,
      image_a_url: gameData.image_a_url,
      image_b_url: gameData.image_b_url,
      user: {
        username: user.username,
      },
    }
  } catch (error) {
    console.error('Failed to get game for SEO:', error)
    return null
  }
}

