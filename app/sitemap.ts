import { MetadataRoute } from 'next'
import { getAllGameIds } from '@/features/choice/lib/gameQueryServer'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibechoice.com'
  
  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/games/create`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // 동적 페이지: 게임 상세 페이지
  try {
    const gameIds = await getAllGameIds()
    const gamePages: MetadataRoute.Sitemap = gameIds.map((id) => ({
      url: `${baseUrl}/games/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticPages, ...gamePages]
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    // 에러가 발생해도 정적 페이지는 반환
    return staticPages
  }
}


