// 공유 타입 정의
export * from './database'
import type { Database } from './database'

// 엔티티 타입
export type User = Database['public']['Tables']['users']['Row']
export type Game = Database['public']['Tables']['games']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']

// Insert 타입
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type GameInsert = Database['public']['Tables']['games']['Insert']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']

// Update 타입
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type GameUpdate = Database['public']['Tables']['games']['Update']
export type VoteUpdate = Database['public']['Tables']['votes']['Update']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']

// 확장 타입 (관계 포함)
export type GameWithUser = Game & {
  user: User
}

export type GameWithStats = Game & {
  user: User
  vote_count_a: number
  vote_count_b: number
  total_votes: number
  comment_count: number
}

export type CommentWithUser = Comment & {
  user: User
}

export type VoteWithUser = Vote & {
  user: User
}

export type VoteWithGame = Vote & {
  game: Game
}
