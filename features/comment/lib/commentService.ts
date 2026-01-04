// 댓글 관련 서비스 함수
import { getBrowserClient } from '@/shared/lib/supabase-client'
import type { Database } from '@/shared/types/database'

type Comment = Database['public']['Tables']['comments']['Row']
type CommentInsert = Database['public']['Tables']['comments']['Insert']
type CommentUpdate = Database['public']['Tables']['comments']['Update']

export interface CommentWithUser extends Comment {
  user: {
    id: string
    username: string | null
    avatar_url: string | null
  }
}

/**
 * 게임의 댓글 목록 조회
 */
export async function getComments(gameId: string): Promise<CommentWithUser[]> {
  const supabase = getBrowserClient()
  if (!supabase) {
    throw new Error('Supabase client is not available')
  }

  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users!comments_user_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    if (!comments || comments.length === 0) {
      return []
    }

    return comments.map((comment: any) => ({
      id: comment.id,
      game_id: comment.game_id,
      user_id: comment.user_id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      user: {
        id: comment.user.id,
        username: comment.user.username,
        avatar_url: comment.user.avatar_url,
      },
    })) as CommentWithUser[]
  } catch (error) {
    console.error('Failed to get comments:', error)
    throw error
  }
}

/**
 * 댓글 작성
 */
export async function createComment(gameId: string, content: string): Promise<CommentWithUser> {
  const supabase = getBrowserClient()
  if (!supabase) {
    throw new Error('Supabase client is not available')
  }

  try {
    // 현재 사용자 확인
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authUser) {
      throw new Error('User not authenticated')
    }

    // 댓글 생성
    const commentData: CommentInsert = {
      game_id: gameId,
      user_id: authUser.id,
      content: content.trim(),
    }

    const { data: comment, error: insertError } = await (supabase
      .from('comments')
      // @ts-expect-error - Supabase 타입 추론 문제
      .insert(commentData)
      .select(`
        *,
        user:users!comments_user_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .single() as any)

    if (insertError) {
      throw insertError
    }

    if (!comment) {
      throw new Error('Failed to create comment')
    }

    const commentDataWithUser = comment as any
    return {
      id: commentDataWithUser.id,
      game_id: commentDataWithUser.game_id,
      user_id: commentDataWithUser.user_id,
      content: commentDataWithUser.content,
      created_at: commentDataWithUser.created_at,
      updated_at: commentDataWithUser.updated_at,
      user: {
        id: commentDataWithUser.user.id,
        username: commentDataWithUser.user.username,
        avatar_url: commentDataWithUser.user.avatar_url,
      },
    } as CommentWithUser
  } catch (error) {
    console.error('Failed to create comment:', error)
    throw error
  }
}

/**
 * 댓글 수정
 */
export async function updateComment(commentId: string, content: string): Promise<CommentWithUser> {
  const supabase = getBrowserClient()
  if (!supabase) {
    throw new Error('Supabase client is not available')
  }

  try {
    // 현재 사용자 확인
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authUser) {
      throw new Error('User not authenticated')
    }

    // 댓글 수정
    const updateData: CommentUpdate = {
      content: content.trim(),
    }

    const { data: comment, error: updateError } = await (supabase
      .from('comments')
      // @ts-expect-error - Supabase 타입 추론 문제
      .update(updateData)
      .eq('id', commentId)
      .eq('user_id', authUser.id) // 본인 댓글만 수정 가능
      .select(`
        *,
        user:users!comments_user_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .single() as any)

    if (updateError) {
      throw updateError
    }

    if (!comment) {
      throw new Error('Failed to update comment')
    }

    const commentDataWithUser = comment as any
    return {
      id: commentDataWithUser.id,
      game_id: commentDataWithUser.game_id,
      user_id: commentDataWithUser.user_id,
      content: commentDataWithUser.content,
      created_at: commentDataWithUser.created_at,
      updated_at: commentDataWithUser.updated_at,
      user: {
        id: commentDataWithUser.user.id,
        username: commentDataWithUser.user.username,
        avatar_url: commentDataWithUser.user.avatar_url,
      },
    } as CommentWithUser
  } catch (error) {
    console.error('Failed to update comment:', error)
    throw error
  }
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: string): Promise<void> {
  const supabase = getBrowserClient()
  if (!supabase) {
    throw new Error('Supabase client is not available')
  }

  try {
    // 현재 사용자 확인
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authUser) {
      throw new Error('User not authenticated')
    }

    // 댓글 삭제
    const { error: deleteError } = await (supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', authUser.id) as any) // 본인 댓글만 삭제 가능

    if (deleteError) {
      throw deleteError
    }
  } catch (error) {
    console.error('Failed to delete comment:', error)
    throw error
  }
}

