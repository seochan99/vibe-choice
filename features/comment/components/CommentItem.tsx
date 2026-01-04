'use client'

import { useState } from 'react'
import { useAuth } from '@/features/auth'
import type { CommentWithUser } from '../lib/commentService'

interface CommentItemProps {
  comment: CommentWithUser
  onUpdate: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
  isUpdating?: boolean
  isDeleting?: boolean
}

export function CommentItem({
  comment,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: CommentItemProps) {
  const { user: currentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [error, setError] = useState('')

  const isOwner = currentUser?.id === comment.user_id

  const handleUpdate = async () => {
    setError('')

    if (!editContent.trim()) {
      setError('댓글을 알려주세요')
      return
    }

    if (editContent.trim().length > 500) {
      setError('댓글은 500자 이하로 작성해주세요')
      return
    }

    try {
      await onUpdate(comment.id, editContent.trim())
      setIsEditing(false)
    } catch (err: any) {
      console.error('Failed to update comment:', err)
      setError(err.message || '댓글 수정에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleDelete = async () => {
    if (!confirm('이 댓글을 지울까요?')) {
      return
    }

    try {
      await onDelete(comment.id)
    } catch (err: any) {
      console.error('Failed to delete comment:', err)
      alert(err.message || '댓글 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(comment.content)
    setError('')
  }

  return (
    <div className="p-4 border-b border-gray-100 last:border-b-0">
      {isEditing ? (
        <div className="space-y-3">
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
          <textarea
            value={editContent}
            onChange={(e) => {
              setEditContent(e.target.value)
              setError('')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition resize-none text-sm text-gray-900"
            rows={3}
            maxLength={500}
            disabled={isUpdating}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {editContent.length}/500
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || !editContent.trim()}
                className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? '수정 중...' : '수정'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium text-xs">
                  {comment.user.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {comment.user.username || '익명'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {comment.updated_at !== comment.created_at && (
                    <span className="ml-1 text-gray-400">(수정했어요)</span>
                  )}
                </p>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isDeleting}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2 py-1 text-xs text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>
      )}
    </div>
  )
}

