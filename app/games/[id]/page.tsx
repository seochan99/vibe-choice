import type { Metadata } from 'next'
import { getGameByIdForSEO } from '@/features/choice/lib/gameDetailServer'
import GameDetailPageClient from './GameDetailPageClient'

interface GameDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const game = await getGameByIdForSEO(id)

  if (!game) {
    return {
      title: '게임을 찾을 수 없어요',
      description: '요청하신 게임이 없거나 삭제되었을 수 있어요',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibechoice.com'
  const gameUrl = `${siteUrl}/games/${id}`
  const ogImage = game.image_a_url || game.image_b_url || `${siteUrl}/og-image.png`

  return {
    title: game.title,
    description: `${game.choice_a} vs ${game.choice_b} - 어떤 것을 선택하시겠어요?`,
    openGraph: {
      title: `${game.title} | 바이브 초이스`,
      description: `${game.choice_a} vs ${game.choice_b} - 어떤 것을 선택하시겠어요?`,
      url: gameUrl,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: game.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${game.title} | 바이브 초이스`,
      description: `${game.choice_a} vs ${game.choice_b} - 어떤 것을 선택하시겠어요?`,
      images: [ogImage],
    },
    alternates: {
      canonical: gameUrl,
    },
  }
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  return <GameDetailPageClient params={params} />
}
