'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { updateUserProfile } from '../lib/auth'
import { Card, Button } from '@/shared/ui'

export function UsernameSetup() {
  const router = useRouter()
  const { user, checkAuth } = useAuth()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // 유효성 검사
    const trimmedUsername = username.trim()
    if (!trimmedUsername) {
      setError('닉네임을 알려주세요')
      return
    }

    if (trimmedUsername.length < 2) {
      setError('닉네임은 2자 이상이어야 해요')
      return
    }

    if (trimmedUsername.length > 20) {
      setError('닉네임은 20자 이하여야 해요')
      return
    }

    setIsSubmitting(true)

    try {
      await updateUserProfile({ username: trimmedUsername })
      
      // 인증 상태 다시 확인하여 업데이트된 사용자 정보 가져오기
      await checkAuth()
      
      // 메인 페이지로 이동
      router.push('/')
      router.refresh()
    } catch (error: any) {
      console.error('Username update error:', error)
      setError(error.message || '닉네임 저장 중 오류가 발생했습니다.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
            닉네임 정하기
          </h1>
          <p className="text-sm text-gray-500">
            바이브 초이스에서 사용할 닉네임을 알려주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-gray-50 border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              닉네임
              <span className="text-gray-400 ml-1">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition text-gray-900 placeholder-gray-400"
              placeholder="닉네임을 알려주세요 (2-20자)"
              disabled={isSubmitting}
              maxLength={20}
              autoFocus
            />
            <p className="mt-1.5 text-xs text-gray-500">
              {username.length}/20자
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting || !username.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                저장 중...
              </span>
            ) : (
              '완료'
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}

