// 게임 상세 정보 조회 서비스
import { getBrowserClient } from '@/shared/lib/supabase-client'
import type { GameWithStats } from '@/entities/choice'
import type { Database } from '@/shared/types/database'

type Game = Database['public']['Tables']['games']['Row']
type User = Database['public']['Tables']['users']['Row']

/**
 * 게임 상세 정보 조회 (투표 통계 포함)
 */
export async function getGameById(gameId: string): Promise<GameWithStats | null> {
  const supabase = getBrowserClient()
  if (!supabase) {
    throw new Error('Supabase client is not available')
  }

  try {
    // 게임 정보 조회 (사용자 정보 포함)
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select(`
        *,
        user:users!games_user_id_fkey (
          id,
          email,
          username,
          avatar_url,
          created_at,
          updated_at
        )
      `)
      .eq('id', gameId)
      .single()

    if (gameError || !game) {
      if (gameError?.code === 'PGRST116') {
        return null // 게임을 찾을 수 없음
      }
      throw gameError || new Error('Game not found')
    }

    const gameData = game as any
    const gameRecord = gameData as Game
    const user = gameData.user as User

    // 조회수 증가는 별도로 처리 (선택적)
    // 실제 조회수는 view_count 그대로 사용

    // 투표 통계 조회
    const { data: votes, error: votesError } = await (supabase
      .from('votes')
      .select('choice')
      .eq('game_id', gameId) as any)

    if (votesError) {
      console.error('Failed to get votes for game:', gameId, votesError)
    }

    const votesData = (votes as any[]) || []
    const voteCountA = votesData.filter((v: any) => v.choice === 'A').length
    const voteCountB = votesData.filter((v: any) => v.choice === 'B').length
    const totalVotes = voteCountA + voteCountB

    // 댓글 수 조회
    const { count: commentCount, error: commentsError } = await (supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('game_id', gameId) as any)

    if (commentsError) {
      console.error('Failed to get comments for game:', gameId, commentsError)
    }

    return {
      id: gameRecord.id,
      user_id: gameRecord.user_id,
      title: gameRecord.title,
      choice_a: gameRecord.choice_a,
      choice_b: gameRecord.choice_b,
      image_a_url: gameRecord.image_a_url,
      image_b_url: gameRecord.image_b_url,
      view_count: gameRecord.view_count,
      created_at: gameRecord.created_at,
      updated_at: gameRecord.updated_at,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      vote_count_a: voteCountA,
      vote_count_b: voteCountB,
      total_votes: totalVotes,
      comment_count: commentCount || 0,
    } as GameWithStats
  } catch (error) {
    console.error('Failed to get game:', error)
    throw error
  }
}

