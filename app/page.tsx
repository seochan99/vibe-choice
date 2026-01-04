import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: '인기 게임',
  description: '재밌는 밸런스 게임들을 둘러보고 선택해보세요. 다양한 사람들의 선택을 확인하고 의견을 나눠보세요.',
  openGraph: {
    title: '인기 게임 | 바이브 초이스',
    description: '재밌는 밸런스 게임들을 둘러보고 선택해보세요. 다양한 사람들의 선택을 확인하고 의견을 나눠보세요.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '인기 게임 | 바이브 초이스',
    description: '재밌는 밸런스 게임들을 둘러보고 선택해보세요. 다양한 사람들의 선택을 확인하고 의견을 나눠보세요.',
  },
}

export default function HomePage() {
  return <HomePageClient />
}
