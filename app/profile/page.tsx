import type { Metadata } from 'next'
import ProfilePageClient from './ProfilePageClient'

export const metadata: Metadata = {
  title: '내 정보',
  description: '프로필 정보를 확인하고 닉네임을 변경할 수 있어요.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '내 정보 | 바이브 초이스',
    description: '프로필 정보를 확인하고 닉네임을 변경할 수 있어요.',
    url: '/profile',
    type: 'website',
  },
}

export default function ProfilePage() {
  return <ProfilePageClient />
}
