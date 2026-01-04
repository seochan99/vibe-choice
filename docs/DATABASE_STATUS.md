# 데이터베이스 상태

## 생성된 테이블

### 1. users 테이블
- **상태**: ✅ 생성 완료
- **RLS**: ✅ 활성화됨
- **행 수**: 0
- **컬럼**:
  - `id` (UUID, PK, FK → auth.users)
  - `email` (TEXT, UNIQUE, NULLABLE)
  - `username` (TEXT, UNIQUE, NULLABLE)
  - `avatar_url` (TEXT, NULLABLE)
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

### 2. games 테이블
- **상태**: ✅ 생성 완료
- **RLS**: ✅ 활성화됨
- **행 수**: 0
- **컬럼**:
  - `id` (UUID, PK)
  - `user_id` (UUID, FK → users)
  - `title` (TEXT)
  - `choice_a` (TEXT)
  - `choice_b` (TEXT)
  - `image_a_url` (TEXT, NULLABLE)
  - `image_b_url` (TEXT, NULLABLE)
  - `view_count` (INTEGER, DEFAULT 0)
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

### 3. votes 테이블
- **상태**: ✅ 생성 완료
- **RLS**: ✅ 활성화됨
- **행 수**: 0
- **컬럼**:
  - `id` (UUID, PK)
  - `game_id` (UUID, FK → games)
  - `user_id` (UUID, FK → users)
  - `choice` (TEXT, CHECK: 'A' or 'B')
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)
  - **UNIQUE 제약조건**: (game_id, user_id) - 한 사용자는 한 게임에 하나의 투표만 가능

### 4. comments 테이블
- **상태**: ✅ 생성 완료
- **RLS**: ✅ 활성화됨
- **행 수**: 0
- **컬럼**:
  - `id` (UUID, PK)
  - `game_id` (UUID, FK → games)
  - `user_id` (UUID, FK → users)
  - `content` (TEXT)
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

## 생성된 인덱스

### users 테이블
- `users_email_idx` on `email`
- `users_username_idx` on `username`

### games 테이블
- `games_user_id_idx` on `user_id`
- `games_created_at_idx` on `created_at DESC`
- `games_view_count_idx` on `view_count DESC`

### votes 테이블
- `votes_game_id_idx` on `game_id`
- `votes_user_id_idx` on `user_id`
- UNIQUE: `votes_game_user_unique_idx` on (`game_id`, `user_id`)

### comments 테이블
- `comments_game_id_idx` on `game_id`
- `comments_user_id_idx` on `user_id`
- `comments_game_created_at_idx` on (`game_id`, `created_at DESC`)

## 생성된 함수 및 트리거

### 함수
- `update_updated_at_column()` - updated_at 자동 업데이트 함수
- `handle_new_user()` - 사용자 프로필 자동 생성 함수

### 트리거
- `update_users_updated_at` - users 테이블 updated_at 자동 업데이트
- `update_games_updated_at` - games 테이블 updated_at 자동 업데이트
- `update_votes_updated_at` - votes 테이블 updated_at 자동 업데이트
- `update_comments_updated_at` - comments 테이블 updated_at 자동 업데이트
- `on_auth_user_created` - auth.users에 새 사용자 생성 시 public.users에 프로필 자동 생성

## RLS 정책

모든 테이블에 Row Level Security가 활성화되어 있으며, 다음 정책이 설정되어 있습니다:

### users
- 모든 사용자가 프로필 조회 가능
- 사용자는 자신의 프로필만 수정 가능

### games
- 모든 사용자가 게임 조회 가능
- 인증된 사용자만 게임 생성 가능 (자신의 user_id로만)
- 사용자는 자신이 생성한 게임만 수정/삭제 가능

### votes
- 모든 사용자가 투표 조회 가능
- 인증된 사용자만 투표 생성 가능 (자신의 user_id로만)
- 사용자는 자신의 투표만 수정/삭제 가능

### comments
- 모든 사용자가 댓글 조회 가능
- 인증된 사용자만 댓글 생성 가능 (자신의 user_id로만)
- 사용자는 자신의 댓글만 수정/삭제 가능

## 현재 데이터 상태

모든 테이블이 비어있습니다. 실제 사용자가 가입하고 게임을 생성하면 데이터가 추가됩니다.

## 다음 단계

1. **Storage 버킷 생성**
   - Supabase Dashboard → Storage
   - `game-images` 버킷 생성
   - Public 접근 정책 설정

2. **테스트 데이터 추가** (선택사항)
   - 개발/테스트를 위한 샘플 데이터 추가

3. **타입 생성**
   ```bash
   npx supabase gen types typescript --project-id udiuhjrshhuxkjmcwmek > shared/types/database.ts
   ```

