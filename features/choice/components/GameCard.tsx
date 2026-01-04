'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/shared/ui'
import type { GameWithStats } from '@/entities/choice'

interface GameCardProps {
  game: GameWithStats
}

export function GameCard({ game }: GameCardProps) {
  const percentageA = game.total_votes > 0 
    ? Math.round((game.vote_count_a / game.total_votes) * 100)
    : 0
  const percentageB = game.total_votes > 0
    ? Math.round((game.vote_count_b / game.total_votes) * 100)
    : 0

  return (
    <Link href={`/games/${game.id}`}>
      <Card hover className="h-full">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-5 line-clamp-2 leading-tight">
            {game.title}
          </h3>
          
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Choice A */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
              {game.image_a_url ? (
                <Image
                  src={game.image_a_url}
                  alt={game.choice_a}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-xs text-gray-400 font-medium">이미지 없음</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3">
                <p className="text-white text-xs font-medium line-clamp-1 drop-shadow-sm">
                  {game.choice_a}
                </p>
              </div>
            </div>
            
            {/* Choice B */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
              {game.image_b_url ? (
                <Image
                  src={game.image_b_url}
                  alt={game.choice_b}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-xs text-gray-400 font-medium">이미지 없음</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3">
                <p className="text-white text-xs font-medium line-clamp-1 drop-shadow-sm">
                  {game.choice_b}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {game.view_count.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {game.comment_count || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xs font-medium">
                {game.choice_a} {game.vote_count_a}표
              </span>
              <span className="text-gray-400">vs</span>
              <span className="text-xs font-medium">
                {game.choice_b} {game.vote_count_b}표
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
