/**
 * Supabase 데이터베이스 타입 정의
 * 
 * 이 파일은 Supabase에서 생성된 타입을 기반으로 합니다.
 * `supabase gen types typescript --project-id <project-id>` 명령어로 자동 생성할 수 있습니다.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      games: {
        Row: {
          id: string
          user_id: string
          title: string
          choice_a: string
          choice_b: string
          image_a_url: string | null
          image_b_url: string | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          choice_a: string
          choice_b: string
          image_a_url?: string | null
          image_b_url?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          choice_a?: string
          choice_b?: string
          image_a_url?: string | null
          image_b_url?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          game_id: string
          user_id: string
          choice: 'A' | 'B'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          game_id: string
          user_id: string
          choice: 'A' | 'B'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          user_id?: string
          choice?: 'A' | 'B'
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          game_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          game_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      choice_type: 'A' | 'B'
    }
  }
}

