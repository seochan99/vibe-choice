// 투표 실시간 업데이트를 위한 Realtime hook
import { useEffect, useCallback } from 'react'
import { getBrowserClient } from '@/shared/lib/supabase-client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseVoteRealtimeOptions {
  gameId?: string // 특정 게임 ID (게임 디테일 페이지용)
  onVoteChange?: (gameId: string) => void // 투표 변경 시 콜백
}

/**
 * 투표 실시간 업데이트를 위한 Realtime 구독
 */
export function useVoteRealtime({ gameId, onVoteChange }: UseVoteRealtimeOptions = {}) {
  useEffect(() => {
    const supabase = getBrowserClient()
    if (!supabase) {
      return
    }

    let channel: RealtimeChannel | null = null

    try {
      // Realtime 채널 생성
      if (gameId) {
        // 특정 게임의 투표만 구독 (게임 디테일 페이지)
        channel = supabase
          .channel(`votes:game:${gameId}`)
          .on(
            'postgres_changes',
            {
              event: '*', // INSERT, UPDATE, DELETE 모두 감지
              schema: 'public',
              table: 'votes',
              filter: `game_id=eq.${gameId}`,
            },
            (payload) => {
              console.log('Vote change detected for game:', gameId, payload)
              if (onVoteChange) {
                onVoteChange(gameId)
              }
            }
          )
          .subscribe()
      } else {
        // 모든 게임의 투표 구독 (메인 피드 페이지)
        channel = supabase
          .channel('votes:all')
          .on(
            'postgres_changes',
            {
              event: '*', // INSERT, UPDATE, DELETE 모두 감지
              schema: 'public',
              table: 'votes',
            },
            (payload) => {
              console.log('Vote change detected:', payload)
              const newRecord = payload.new as any
              const oldRecord = payload.old as any
              const changedGameId = newRecord?.game_id || oldRecord?.game_id
              if (changedGameId && onVoteChange) {
                onVoteChange(changedGameId as string)
              }
            }
          )
          .subscribe()
      }
    } catch (error) {
      console.error('Failed to setup Realtime subscription:', error)
    }

    // Cleanup
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [gameId, onVoteChange])
}

