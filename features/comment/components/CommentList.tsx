'use client'

import { CommentItem } from './CommentItem'
import type { CommentWithUser } from '../lib/commentService'

interface CommentListProps {
  comments: CommentWithUser[]
  onUpdate: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
  updatingCommentId?: string | null
  deletingCommentId?: string | null
}

export function CommentList({
  comments,
  onUpdate,
  onDelete,
  updatingCommentId,
  deletingCommentId,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">아직 댓글이 없어요</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={updatingCommentId === comment.id}
          isDeleting={deletingCommentId === comment.id}
        />
      ))}
    </div>
  )
}

