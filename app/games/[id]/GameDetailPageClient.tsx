'use client'

import { use, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChoiceButton, GameDetailSkeleton } from '@/features/choice/components'
import { Card, Button } from '@/shared/ui'
import type { GameWithStats } from '@/entities/choice'
import { getGameById, voteGame, getUserVote, getGameStats } from '@/features/choice/lib'
import { useVoteRealtime } from '@/features/choice/hooks/useVoteRealtime'
import { CommentSection } from '@/features/comment'
import { getFriendlyErrorMessage } from '@/shared/lib/errorMessages'
import { useToast } from '@/shared/hooks/useToast'
import { Toast } from '@/shared/components/Toast'
import { trackCompleteCoreValue } from '@/shared/lib/gtag'

interface GameDetailPageClientProps {
  params: Promise<{ id: string }>
}

export default function GameDetailPageClient({ params }: GameDetailPageClientProps) {
  const { id } = use(params)
  const router = useRouter()
  const [game, setGame] = useState<GameWithStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userVote, setUserVote] = useState<'A' | 'B' | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast, showToast, hideToast } = useToast()

  // 투표 통계 업데이트 함수
  const updateGameStats = useCallback(async () => {
    if (!game) return

    try {
      const stats = await getGameStats(game.id)
      setGame((prev) => {
        if (!prev) return null
        return {
          ...prev,
          vote_count_a: stats.vote_count_a,
          vote_count_b: stats.vote_count_b,
          total_votes: stats.total_votes,
        }
      })
    } catch (err) {
      console.error('Failed to update game stats:', err)
    }
  }, [game])

  // 게임 정보 및 사용자 투표 정보 로드
  useEffect(() => {
    const loadGame = async () => {
      try {
        setIsLoading(true)
        const gameData = await getGameById(id)
        setGame(gameData)

        // 사용자의 투표 정보 확인
        if (gameData) {
          const vote = await getUserVote(gameData.id)
          setUserVote(vote)
        }
      } catch (err: any) {
        console.error('Failed to load game:', err)
        setError(getFriendlyErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    loadGame()
  }, [id])

  // Realtime 구독: 투표 변경 감지
  useVoteRealtime({
    gameId: id,
    onVoteChange: updateGameStats,
  })

  const handleVote = async (choice: 'A' | 'B') => {
    if (!game || isVoting) {
      return
    }

    try {
      setIsVoting(true)
      setError(null)

      await voteGame(game.id, choice)
      setUserVote(choice)

      // 핵심 가치 완료 이벤트 추적
      trackCompleteCoreValue(game.id, choice)

      // 투표 완료 피드백
      showToast('선택했어요!', 'success')

      // 투표 통계 즉시 업데이트 (Realtime도 자동으로 업데이트됨)
      await updateGameStats()
    } catch (err: any) {
      console.error('Failed to vote:', err)
      setError(getFriendlyErrorMessage(err))
    } finally {
      setIsVoting(false)
    }
  }

  if (isLoading) {
    return <GameDetailSkeleton />
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="p-10 text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            게임을 찾을 수 없어요
          </h2>
          <p className="text-gray-500 mb-6">요청하신 게임이 없거나 삭제되었을 수 있어요</p>
          <Button variant="primary" onClick={() => router.push('/')}>
            홈으로 가기
          </Button>
        </Card>
      </div>
    )
  }

  const percentageA = game.total_votes > 0 
    ? Math.round((game.vote_count_a / game.total_votes) * 100)
    : 0
  const percentageB = game.total_votes > 0
    ? Math.round((game.vote_count_b / game.total_votes) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm transition-colors touch-manipulation py-2 -ml-2 px-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight break-words">{game.title}</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* 게임 정보 카드 */}
        <Card className="mb-6 sm:mb-8 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium text-sm">
                  {game.user.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {game.user.username || '익명'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(game.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-5 text-xs text-gray-500 w-full sm:w-auto justify-start sm:justify-end">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {game.view_count.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {game.comment_count}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {game.total_votes}
              </span>
            </div>
          </div>
        </Card>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 선택 버튼들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <ChoiceButton
            choice="A"
            text={game.choice_a}
            imageUrl={game.image_a_url}
            percentage={percentageA}
            onClick={() => handleVote('A')}
            disabled={isVoting}
            isSelected={userVote === 'A'}
          />
          <ChoiceButton
            choice="B"
            text={game.choice_b}
            imageUrl={game.image_b_url}
            percentage={percentageB}
            onClick={() => handleVote('B')}
            disabled={isVoting}
            isSelected={userVote === 'B'}
          />
        </div>

        {/* 통계 카드 */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">
            결과 보기
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-medium text-gray-700">
                  A: {game.choice_a}
                </span>
                <span className="text-gray-900 font-semibold">
                  {percentageA}% <span className="text-gray-500 font-normal">({game.vote_count_a}표)</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gray-800 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentageA}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-medium text-gray-700">
                  B: {game.choice_b}
                </span>
                <span className="text-gray-900 font-semibold">
                  {percentageB}% <span className="text-gray-500 font-normal">({game.vote_count_b}표)</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gray-800 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentageB}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 댓글 섹션 */}
        <CommentSection gameId={game.id} />
      </main>

      {/* 토스트 메시지 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  )
}


