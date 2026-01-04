'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth'
import { updateUserProfile } from '@/features/auth/lib/auth'
import { Card, Button } from '@/shared/ui'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, signOut, checkAuth } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username)
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">잠깐만요...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setUsername(user.username || '')
    setError('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setUsername(user.username || '')
    setError('')
  }

  const handleSave = async () => {
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
      
      setIsEditing(false)
      setError('')
    } catch (error: any) {
      console.error('Username update error:', error)
      setError(error.message || '닉네임 저장 중 오류가 발생했습니다.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-3 flex items-center gap-2 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로가기
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">내 정보</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="p-8">
          <div className="space-y-6">
            {/* 프로필 정보 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">프로필 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <p className="text-gray-900">{user.email || '이메일 없음'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사용자명
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition text-gray-900 placeholder-gray-400"
                        placeholder="닉네임을 알려주세요 (2-20자)"
                        maxLength={20}
                        disabled={isSubmitting}
                        autoFocus
                      />
                      <p className="text-xs text-gray-500">
                        {username.length}/20자
                      </p>
                      {error && (
                        <p className="text-sm text-gray-600">{error}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="md"
                          onClick={handleSave}
                          disabled={isSubmitting || !username.trim()}
                        >
                          {isSubmitting ? '저장 중...' : '완료'}
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900">{user.username || '설정되지 않음'}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                      >
                        바꾸기
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    가입일
                  </label>
                  <p className="text-gray-900">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('ko-KR')
                      : '알 수 없음'}
                  </p>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
                나가기
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
