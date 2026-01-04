'use client'

import { useAuth } from '../hooks/useAuth'
import { Button } from '@/shared/ui'

export function AuthButton() {
  const { isAuthenticated, isLoading, signIn, signOut } = useAuth()

  if (isLoading) {
    return (
      <Button variant="outline" size="md" disabled>
        잠깐만요...
      </Button>
    )
  }

  if (isAuthenticated) {
    return (
      <Button variant="outline" size="md" onClick={signOut}>
        나가기
      </Button>
    )
  }

  return (
    <Button variant="primary" size="md" onClick={signIn}>
      시작하기
    </Button>
  )
}

