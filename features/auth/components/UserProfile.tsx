'use client'

import { useAuth } from '../hooks/useAuth'
import { Button } from '@/shared/ui'
import Link from 'next/link'

export function UserProfile() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/profile">
        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user.username || user.email || '사용자'}
          </span>
        </div>
      </Link>
    </div>
  )
}


