'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/shared/ui'
import { useAuth } from '@/features/auth'
import { getFriendlyErrorMessage } from '@/shared/lib/errorMessages'

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  isSubmitting?: boolean
}

export function CommentForm({ onSubmit, isSubmitting = false }: CommentFormProps) {
  const { isAuthenticated } = useAuth()
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!content.trim()) {
      setError('댓글을 알려주세요')
      return
    }

    if (content.trim().length > 500) {
      setError('댓글은 500자 이하로 작성해주세요')
      return
    }

    try {
      await onSubmit(content.trim())
      setContent('') // 성공 시 입력창 초기화
    } catch (err: any) {
      console.error('Failed to submit comment:', err)
      setError(getFriendlyErrorMessage(err))
    }
  }

  if (!isAuthenticated) {
    return null // 로그인하지 않은 경우 폼을 표시하지 않음
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setError('')
          }}
          placeholder="생각을 남겨보세요..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition resize-none text-gray-900 placeholder-gray-400 text-sm sm:text-base"
          rows={3}
          maxLength={500}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting || !content.trim()}
          className="self-start sm:self-start w-full sm:w-auto touch-manipulation"
        >
          {isSubmitting ? '올리는 중...' : '올리기'}
        </Button>
      </div>
      <p className="text-xs text-gray-500 text-right">
        {content.length}/500
      </p>
    </form>
  )
}

