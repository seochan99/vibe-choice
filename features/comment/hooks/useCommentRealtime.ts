// 댓글 실시간 업데이트를 위한 Realtime hook
import { useEffect } from 'react'
import { getBrowserClient } from '@/shared/lib/supabase-client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseCommentRealtimeOptions {
  gameId: string
  onCommentChange?: () => void // 댓글 변경 시 콜백
}

/**
 * 댓글 실시간 업데이트를 위한 Realtime 구독
 */
export function useCommentRealtime({ gameId, onCommentChange }: UseCommentRealtimeOptions) {
  useEffect(() => {
    const supabase = getBrowserClient()
    if (!supabase) {
      return
    }

    let channel: RealtimeChannel | null = null

    try {
      // Realtime 채널 생성
      channel = supabase
        .channel(`comments:game:${gameId}`)
        .on(
          'postgres_changes',
          {
            event: '*', // INSERT, UPDATE, DELETE 모두 감지
            schema: 'public',
            table: 'comments',
            filter: `game_id=eq.${gameId}`,
          },
          (payload) => {
            console.log('Comment change detected for game:', gameId, payload)
            if (onCommentChange) {
              onCommentChange()
            }
          }
        )
        .subscribe()
    } catch (error) {
      console.error('Failed to setup Realtime subscription:', error)
    }

    // Cleanup
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [gameId, onCommentChange])
}


