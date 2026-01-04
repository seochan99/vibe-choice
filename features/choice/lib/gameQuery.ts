// 게임 조회 관련 서비스 함수
import { getBrowserClient } from '@/shared/lib/supabase-client'
import type { Database } from '@/shared/types/database'
import type { GameWithStats } from '@/entities/choice'

type Game = Database['public']['Tables']['games']['Row']
type User = Database['public']['Tables']['users']['Row']

export type SortOption = 'latest' | 'popular'

/**
 * 게임 목록 조회 (투표 통계 포함)
 */
export async function getGames(sortBy: SortOption = 'latest'): Promise<GameWithStats[]> {
  const supabase = getBrowserClient()
  if (!supabase) {
    throw new Error('Supabase client is not available')
  }

  try {
    // 정렬 기준 설정
    let orderBy: { column: string; ascending: boolean } = { column: 'created_at', ascending: false }
    
    if (sortBy === 'popular') {
      // 참여순: 총 투표 수 기준 (서브쿼리 필요)
      // 일단 created_at으로 정렬하고, 클라이언트에서 정렬하거나
      // 또는 데이터베이스 뷰/함수 사용
      orderBy = { column: 'created_at', ascending: false }
    }

    // 게임 목록 조회 (사용자 정보 포함)
    const { data: games, error: gamesError } = await supabase
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
      .order(orderBy.column, { ascending: orderBy.ascending })

    if (gamesError) {
      throw gamesError
    }

    if (!games || games.length === 0) {
      return []
    }

    // 각 게임의 투표 통계 조회
    const gamesWithStats: GameWithStats[] = await Promise.all(
      games.map(async (gameItem) => {
        const gameData = gameItem as any
        const game = gameData as Game
        const user = gameData.user as User

        // 투표 통계 조회
        const { data: votes, error: votesError } = await (supabase
          .from('votes')
          .select('choice') as any)
          .eq('game_id', game.id)

        if (votesError) {
          console.error('Failed to get votes for game:', game.id, votesError)
        }

        const votesData = (votes as any[]) || []
        const voteCountA = votesData.filter((v: any) => v.choice === 'A').length
        const voteCountB = votesData.filter((v: any) => v.choice === 'B').length
        const totalVotes = voteCountA + voteCountB

        // 댓글 수 조회
        const { count: commentCount, error: commentsError } = await (supabase
          .from('comments')
          .select('*', { count: 'exact', head: true }) as any)
          .eq('game_id', game.id)

        if (commentsError) {
          console.error('Failed to get comments for game:', game.id, commentsError)
        }

        const finalCommentCount = commentCount || 0

        return {
          id: game.id,
          user_id: game.user_id,
          title: game.title,
          choice_a: game.choice_a,
          choice_b: game.choice_b,
          image_a_url: game.image_a_url,
          image_b_url: game.image_b_url,
          view_count: game.view_count,
          created_at: game.created_at,
          updated_at: game.updated_at,
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
          comment_count: finalCommentCount,
        } as GameWithStats
      })
    )

    // 참여순 정렬인 경우 총 투표 수로 정렬
    if (sortBy === 'popular') {
      gamesWithStats.sort((a, b) => b.total_votes - a.total_votes)
    }

    return gamesWithStats
  } catch (error) {
    console.error('Failed to get games:', error)
    throw error
  }
}

