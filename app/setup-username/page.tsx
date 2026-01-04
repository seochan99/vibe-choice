import type { Metadata } from 'next'
import SetupUsernamePageClient from './SetupUsernamePageClient'

export const metadata: Metadata = {
  title: '닉네임 설정',
  description: '닉네임을 설정하여 바이브 초이스 커뮤니티에 참여하세요.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SetupUsernamePage() {
  return <SetupUsernamePageClient />
}
