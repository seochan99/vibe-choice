import type { Metadata } from 'next'
import CreateGamePageClient from './CreateGamePageClient'

export const metadata: Metadata = {
  title: '게임 만들기',
  description: '두 가지 선택지로 재밌는 밸런스 게임을 만들어보세요. 이미지도 추가할 수 있어요!',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '게임 만들기 | 바이브 초이스',
    description: '두 가지 선택지로 재밌는 밸런스 게임을 만들어보세요. 이미지도 추가할 수 있어요!',
    url: '/games/create',
    type: 'website',
  },
}

export default function CreateGamePage() {
  return <CreateGamePageClient />
}
