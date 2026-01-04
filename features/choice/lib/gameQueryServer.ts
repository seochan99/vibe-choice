// 서버 사이드 게임 조회 관련 서비스 함수
import { createServerClient } from '@/shared/lib/supabase-client'
import type { Database } from '@/shared/types/database'

type Game = Database['public']['Tables']['games']['Row']

/**
 * 서버 사이드에서 모든 게임 ID 목록 조회 (사이트맵용)
 */
export async function getAllGameIds(): Promise<string[]> {
  try {
    const supabase = createServerClient()

    const { data: games, error } = await supabase
      .from('games')
      .select('id')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to get game IDs:', error)
      return []
    }

    if (!games) {
      return []
    }

    return games.map((game: { id: string }) => game.id)
  } catch (error) {
    console.error('Failed to get game IDs:', error)
    return []
  }
}

