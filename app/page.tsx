'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GameList, GameListSkeleton } from '@/features/choice/components'
import { AuthButton, UserProfile } from '@/features/auth'
import { useAuth } from '@/features/auth'
import { Button } from '@/shared/ui'
import { getGames, type SortOption } from '@/features/choice/lib/gameQuery'
import { getGameStats } from '@/features/choice/lib'
import { useVoteRealtime } from '@/features/choice/hooks/useVoteRealtime'
import { getFriendlyErrorMessage } from '@/shared/lib/errorMessages'
import type { GameWithStats } from '@/entities/choice'

export default function HomePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, signIn } = useAuth()
  const hasRedirected = useRef(false)
  const [games, setGames] = useState<GameWithStats[]>([])
  const [isLoadingGames, setIsLoadingGames] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('latest')

  useEffect(() => {
    // 로딩이 완료되고 인증된 사용자인데 닉네임이 없으면 닉네임 설정 페이지로 리다이렉트
    // 한 번만 리다이렉트하도록 플래그 사용
    if (!isLoading && isAuthenticated && user && !user.username && !hasRedirected.current) {
      hasRedirected.current = true
      router.push('/setup-username')
    }
  }, [user, isAuthenticated, isLoading, router])

  // 특정 게임의 투표 통계 업데이트
  const updateGameStats = useCallback(async (gameId: string) => {
    try {
      const stats = await getGameStats(gameId)
      setGames((prevGames) =>
        prevGames.map((game) =>
          game.id === gameId
            ? {
                ...game,
                vote_count_a: stats.vote_count_a,
                vote_count_b: stats.vote_count_b,
                total_votes: stats.total_votes,
              }
            : game
        )
      )
    } catch (err) {
      console.error('Failed to update game stats:', err)
    }
  }, [])

  useEffect(() => {
    // 게임 목록 불러오기
    const loadGames = async () => {
      setIsLoadingGames(true)
      try {
        const gamesData = await getGames(sortBy)
        setGames(gamesData)
      } catch (error) {
        console.error('Failed to load games:', error)
        setGames([])
      } finally {
        setIsLoadingGames(false)
      }
    }

    loadGames()
  }, [sortBy])

  // Realtime 구독: 모든 게임의 투표 변경 감지
  useVoteRealtime({
    onVoteChange: updateGameStats,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">바이브 초이스</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">어떤 게 좋을까요?</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-initial flex items-center gap-2">
                <UserProfile />
                <AuthButton />
              </div>
              {isAuthenticated ? (
                <Link href="/games/create" className="flex-1 sm:flex-initial">
                  <Button variant="primary" size="md" className="w-full sm:w-auto">
                    + 게임 만들기
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="primary" 
                  size="md"
                  onClick={async () => {
                    try {
                      await signIn()
                    } catch (error) {
                      console.error('Sign in error:', error)
                    }
                  }}
                  className="flex-1 sm:flex-initial"
                >
                  + 게임 만들기
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
              인기 게임
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setSortBy('latest')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 rounded-xl text-sm font-medium transition-colors touch-manipulation ${
                  sortBy === 'latest'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 rounded-xl text-sm font-medium transition-colors touch-manipulation ${
                  sortBy === 'popular'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                참여순
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            재밌는 게임들을 둘러보고 선택해보세요
          </p>
        </div>

        {isLoadingGames ? (
          <GameListSkeleton count={6} />
        ) : (
          <GameList games={games} />
        )}
      </main>
    </div>
  )
}
