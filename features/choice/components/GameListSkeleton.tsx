'use client'

import { GameCardSkeleton } from './GameCardSkeleton'

interface GameListSkeletonProps {
  count?: number
}

export function GameListSkeleton({ count = 6 }: GameListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <GameCardSkeleton key={index} />
      ))}
    </div>
  )
}

