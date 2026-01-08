// 게임 투표 통계 조회 함수
import { getBrowserClient } from '@/shared/lib/supabase-client'

export interface GameStats {
  vote_count_a: number
  vote_count_b: number
  total_votes: number
}

/**
 * 특정 게임의 투표 통계 조회
 */
export async function getGameStats(gameId: string): Promise<GameStats> {
  const supabase = getBrowserClient()
  if (!supabase) {
    throw new Error('Supabase client is not available')
  }

  try {
    // 투표 통계 조회
    const { data: votes, error: votesError } = await (supabase
      .from('votes')
      .select('choice') as any)
      .eq('game_id', gameId)

    if (votesError) {
      console.error('Failed to get votes for game:', gameId, votesError)
      return {
        vote_count_a: 0,
        vote_count_b: 0,
        total_votes: 0,
      }
    }

    const votesData = (votes as any[]) || []
    const voteCountA = votesData.filter((v: any) => v.choice === 'A').length
    const voteCountB = votesData.filter((v: any) => v.choice === 'B').length
    const totalVotes = voteCountA + voteCountB

    return {
      vote_count_a: voteCountA,
      vote_count_b: voteCountB,
      total_votes: totalVotes,
    }
  } catch (error) {
    console.error('Failed to get game stats:', error)
    return {
      vote_count_a: 0,
      vote_count_b: 0,
      total_votes: 0,
    }
  }
}


