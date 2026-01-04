'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/shared/ui'
import { useAuth } from '@/features/auth'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'
import { getComments, createComment, updateComment, deleteComment, type CommentWithUser } from '../lib/commentService'
import { useCommentRealtime } from '../hooks/useCommentRealtime'
import { getFriendlyErrorMessage } from '@/shared/lib/errorMessages'

interface CommentSectionProps {
  gameId: string
}

export function CommentSection({ gameId }: CommentSectionProps) {
  const router = useRouter()
  const { isAuthenticated, signIn } = useAuth()
  const [comments, setComments] = useState<CommentWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatingCommentId, setUpdatingCommentId] = useState<string | null>(null)
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)

  // 댓글 목록 로드
  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true)
      const commentsData = await getComments(gameId)
      setComments(commentsData)
    } catch (error) {
      console.error('Failed to load comments:', error)
      setComments([])
    } finally {
      setIsLoading(false)
    }
  }, [gameId])

  // 초기 로드
  useEffect(() => {
    loadComments()
  }, [loadComments])

  // Realtime 구독: 댓글 변경 감지
  useCommentRealtime({
    gameId,
    onCommentChange: loadComments,
  })

  // 댓글 작성
  const handleSubmit = async (content: string) => {
    if (!isAuthenticated) {
      // 로그인하지 않은 경우 로그인 시도
      try {
        await signIn()
      } catch (error) {
        console.error('Sign in error:', error)
      }
      return
    }

    setIsSubmitting(true)
    try {
      const newComment = await createComment(gameId, content)
      // 로컬 상태에 즉시 추가 (Realtime도 자동으로 업데이트됨)
      setComments((prev) => [newComment, ...prev])
    } catch (error: any) {
      console.error('Failed to create comment:', error)
      const friendlyError = new Error(getFriendlyErrorMessage(error))
      throw friendlyError
    } finally {
      setIsSubmitting(false)
    }
  }

  // 댓글 수정
  const handleUpdate = async (commentId: string, content: string) => {
    setUpdatingCommentId(commentId)
    try {
      const updatedComment = await updateComment(commentId, content)
      // 로컬 상태 즉시 업데이트
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      )
    } catch (error: any) {
      console.error('Failed to update comment:', error)
      const friendlyError = new Error(getFriendlyErrorMessage(error))
      throw friendlyError
    } finally {
      setUpdatingCommentId(null)
    }
  }

  // 댓글 삭제
  const handleDelete = async (commentId: string) => {
    setDeletingCommentId(commentId)
    try {
      await deleteComment(commentId)
      // 로컬 상태에서 즉시 제거
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
    } catch (error: any) {
      console.error('Failed to delete comment:', error)
      const friendlyError = new Error(getFriendlyErrorMessage(error))
      throw friendlyError
    } finally {
      setDeletingCommentId(null)
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 tracking-tight">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* 댓글 입력 폼 */}
      {isAuthenticated ? (
        <div className="mb-6">
          <CommentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-sm text-gray-600 mb-3">
            댓글을 남기려면 로그인이 필요해요
          </p>
          <button
            onClick={async () => {
              try {
                await signIn()
              } catch (error) {
                console.error('Sign in error:', error)
              }
            }}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors touch-manipulation"
          >
            시작하기
          </button>
        </div>
      )}

      {/* 댓글 목록 */}
      {isLoading ? (
        <div className="py-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">잠깐만요...</p>
        </div>
      ) : (
        <CommentList
          comments={comments}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          updatingCommentId={updatingCommentId}
          deletingCommentId={deletingCommentId}
        />
      )}
    </Card>
  )
}

