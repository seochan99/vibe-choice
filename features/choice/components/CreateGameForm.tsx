'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/shared/ui'
import { ImageUpload } from './ImageUpload'
import { createGame } from '../lib/gameService'
import { useAuth } from '@/features/auth'
import { getFriendlyErrorMessage } from '@/shared/lib/errorMessages'

interface FormData {
  title: string
  choiceA: string
  choiceB: string
  imageA: File | null
  imageB: File | null
}

interface FormErrors {
  title?: string
  choiceA?: string
  choiceB?: string
  general?: string
}

export function CreateGameForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    choiceA: '',
    choiceB: '',
    imageA: null,
    imageB: null,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = '게임 제목을 알려주세요'
    }

    if (!formData.choiceA.trim()) {
      newErrors.choiceA = '선택지 A를 알려주세요'
    }

    if (!formData.choiceB.trim()) {
      newErrors.choiceB = '선택지 B를 알려주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    if (!user) {
      setErrors({
        general: '로그인이 필요해요',
      })
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setSuccessMessage(null)

    try {
      // 게임 생성
      const game = await createGame({
        title: formData.title,
        choiceA: formData.choiceA,
        choiceB: formData.choiceB,
        imageA: formData.imageA,
        imageB: formData.imageB,
      })

      // 성공 메시지 표시
      setSuccessMessage('완료! 게임이 만들어졌어요 🎉')

      // 폼 초기화
      setFormData({
        title: '',
        choiceA: '',
        choiceB: '',
        imageA: null,
        imageB: null,
      })

      // 2초 후 메인 피드 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error: any) {
      console.error('게임 생성 오류:', error)
      setErrors({
        general: getFriendlyErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-4 sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* 성공 메시지 */}
        {successMessage && (
          <div className="bg-gray-900 text-white px-4 py-3 rounded-xl text-sm">
            {successMessage}
          </div>
        )}

        {/* 에러 메시지 */}
        {errors.general && (
          <div className="bg-gray-50 border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-sm">
            {errors.general}
          </div>
        )}

        {/* 게임 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            게임 제목
            <span className="text-gray-400 ml-1">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition text-gray-900 placeholder-gray-400 ${
              errors.title ? 'border-gray-400 bg-gray-50' : 'border-gray-300'
            }`}
            placeholder="예: 주말에 뭐할까요?"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1.5 text-sm text-gray-600">{errors.title}</p>
          )}
        </div>

        {/* 선택지 A */}
        <div className="space-y-4">
          <div>
            <label htmlFor="choiceA" className="block text-sm font-medium text-gray-700 mb-2">
              선택지 A
              <span className="text-gray-400 ml-1">*</span>
            </label>
            <input
              type="text"
              id="choiceA"
              value={formData.choiceA}
              onChange={(e) => setFormData({ ...formData, choiceA: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition text-gray-900 placeholder-gray-400 ${
                errors.choiceA ? 'border-gray-400 bg-gray-50' : 'border-gray-300'
              }`}
              placeholder="예: 집에서 푹 쉬기"
              disabled={isSubmitting}
            />
            {errors.choiceA && (
              <p className="mt-1.5 text-sm text-gray-600">{errors.choiceA}</p>
            )}
          </div>

          <ImageUpload
            label="선택지 A 이미지"
            value={formData.imageA}
            onChange={(file) => setFormData({ ...formData, imageA: file })}
          />
        </div>

        {/* 선택지 B */}
        <div className="space-y-4">
          <div>
            <label htmlFor="choiceB" className="block text-sm font-medium text-gray-700 mb-2">
              선택지 B
              <span className="text-gray-400 ml-1">*</span>
            </label>
            <input
              type="text"
              id="choiceB"
              value={formData.choiceB}
              onChange={(e) => setFormData({ ...formData, choiceB: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition text-gray-900 placeholder-gray-400 ${
                errors.choiceB ? 'border-gray-400 bg-gray-50' : 'border-gray-300'
              }`}
              placeholder="예: 친구들과 놀러가기"
              disabled={isSubmitting}
            />
            {errors.choiceB && (
              <p className="mt-1.5 text-sm text-gray-600">{errors.choiceB}</p>
            )}
          </div>

          <ImageUpload
            label="선택지 B 이미지"
            value={formData.imageB}
            onChange={(file) => setFormData({ ...formData, imageB: file })}
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end pt-4 sm:pt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[160px] touch-manipulation"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
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
                생성 중...
              </span>
            ) : (
              '게임 만들기'
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}
