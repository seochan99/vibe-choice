'use client'

import { useRef, useState, DragEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

interface ImageUploadProps {
  label: string
  value: File | null
  onChange: (file: File | null) => void
  error?: string
}

export function ImageUpload({ label, value, onChange, error }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    onChange(file)
    
    // 미리보기 생성
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    onChange(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleReplace = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <span className="text-gray-400 ml-1">(선택)</span>
      </label>

      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
            isDragging
              ? 'border-gray-600 bg-gray-50 border-solid'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
            error && 'border-gray-400 bg-gray-50'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">클릭하여 업로드</span> 또는
              <br />
              이미지를 여기에 드래그하세요
            </div>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP (최대 5MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative border border-gray-300 rounded-xl overflow-hidden bg-gray-50 group">
          <div className="relative aspect-video w-full">
            {preview && (
              <Image
                src={preview}
                alt="미리보기"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleReplace}
            >
              교체
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="bg-white hover:bg-gray-50 hover:border-gray-400"
            >
              지우기
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-gray-600">{error}</p>
      )}
    </div>
  )
}
