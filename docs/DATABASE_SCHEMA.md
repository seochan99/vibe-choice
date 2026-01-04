# 데이터베이스 스키마 설계

## 개요

바이브 초이스 프로젝트의 Supabase 데이터베이스 스키마 설계 문서입니다.

## 테이블 구조

### 1. users 테이블

사용자 정보를 저장하는 테이블입니다. Supabase Auth와 연동됩니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | uuid | PRIMARY KEY, REFERENCES auth.users(id) | 사용자 고유 ID (Supabase Auth와 연동) |
| email | text | UNIQUE, NULLABLE | 이메일 주소 |
| username | text | UNIQUE, NULLABLE | 사용자명 |
| avatar_url | text | NULLABLE | 프로필 이미지 URL |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 생성일시 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 수정일시 |

**인덱스:**
- `users_email_idx` on `email`
- `users_username_idx` on `username`

**RLS (Row Level Security):**
- 모든 사용자가 자신의 프로필을 읽을 수 있음
- 모든 사용자가 자신의 프로필을 수정할 수 있음
- 공개 프로필 정보는 모든 사용자가 읽을 수 있음

---

### 2. games 테이블

밸런스 게임 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | 게임 고유 ID |
| user_id | uuid | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | 게임 생성자 ID |
| title | text | NOT NULL | 게임 제목 |
| choice_a | text | NOT NULL | 선택지 A 텍스트 |
| choice_b | text | NOT NULL | 선택지 B 텍스트 |
| image_a_url | text | NULLABLE | 선택지 A 이미지 URL (Storage 경로) |
| image_b_url | text | NULLABLE | 선택지 B 이미지 URL (Storage 경로) |
| view_count | integer | NOT NULL, DEFAULT 0 | 조회수 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 생성일시 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 수정일시 |

**인덱스:**
- `games_user_id_idx` on `user_id`
- `games_created_at_idx` on `created_at DESC` (최신순 정렬용)
- `games_view_count_idx` on `view_count DESC` (인기순 정렬용)

**RLS:**
- 모든 사용자가 게임을 읽을 수 있음
- 인증된 사용자만 게임을 생성할 수 있음
- 게임 생성자만 자신의 게임을 수정/삭제할 수 있음

---

### 3. votes 테이블

투표 정보를 저장하는 테이블입니다. 한 사용자는 한 게임에 대해 하나의 투표만 할 수 있습니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | 투표 고유 ID |
| game_id | uuid | NOT NULL, REFERENCES games(id) ON DELETE CASCADE | 게임 ID |
| user_id | uuid | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | 투표한 사용자 ID |
| choice | text | NOT NULL, CHECK (choice IN ('A', 'B')) | 선택한 선택지 ('A' 또는 'B') |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 생성일시 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 수정일시 |

**인덱스:**
- `votes_game_id_idx` on `game_id`
- `votes_user_id_idx` on `user_id`
- `votes_game_user_unique_idx` UNIQUE on (`game_id`, `user_id`) - 한 사용자는 한 게임에 하나의 투표만 가능

**RLS:**
- 모든 사용자가 투표 결과를 읽을 수 있음 (익명 투표는 user_id를 NULL로 처리할 수도 있음)
- 인증된 사용자만 투표를 생성할 수 있음
- 사용자는 자신의 투표만 수정/삭제할 수 있음

---

### 4. comments 테이블

댓글 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | 댓글 고유 ID |
| game_id | uuid | NOT NULL, REFERENCES games(id) ON DELETE CASCADE | 게임 ID |
| user_id | uuid | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | 댓글 작성자 ID |
| content | text | NOT NULL | 댓글 내용 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 생성일시 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 수정일시 |

**인덱스:**
- `comments_game_id_idx` on `game_id`
- `comments_user_id_idx` on `user_id`
- `comments_game_created_at_idx` on (`game_id`, `created_at DESC`) - 게임별 최신 댓글 조회용

**RLS:**
- 모든 사용자가 댓글을 읽을 수 있음
- 인증된 사용자만 댓글을 생성할 수 있음
- 댓글 작성자만 자신의 댓글을 수정/삭제할 수 있음

---

## 테이블 간 관계

```
users (1) ──< (N) games
users (1) ──< (N) votes
users (1) ──< (N) comments
games (1) ──< (N) votes
games (1) ──< (N) comments
```

### 관계 설명

1. **users ↔ games**: 한 사용자는 여러 게임을 생성할 수 있습니다 (1:N)
2. **users ↔ votes**: 한 사용자는 여러 게임에 투표할 수 있습니다 (1:N)
3. **users ↔ comments**: 한 사용자는 여러 댓글을 작성할 수 있습니다 (1:N)
4. **games ↔ votes**: 한 게임은 여러 투표를 받을 수 있습니다 (1:N)
5. **games ↔ comments**: 한 게임은 여러 댓글을 받을 수 있습니다 (1:N)

---

## 추가 고려사항

### 1. Storage 구조

이미지 파일은 Supabase Storage에 저장됩니다.

```
storage/
└── game-images/
    ├── {game_id}/
    │   ├── choice_a.{ext}
    │   └── choice_b.{ext}
```

**Storage 정책:**
- 모든 사용자가 이미지를 읽을 수 있음
- 인증된 사용자만 이미지를 업로드할 수 있음
- 게임 생성자만 자신의 게임 이미지를 삭제할 수 있음

### 2. 통계 및 집계 데이터

실시간 통계를 위해 다음 뷰(View) 또는 함수를 고려할 수 있습니다:

- **게임별 투표 통계**: 각 게임의 선택지 A/B 투표 수
- **인기 게임**: 조회수와 투표수를 기반으로 한 인기 게임 목록
- **사용자 활동 통계**: 사용자가 생성한 게임 수, 투표 수, 댓글 수

### 3. 추가 기능을 위한 확장 가능성

향후 확장을 고려한 추가 테이블:

- **game_likes**: 게임 좋아요 기능
- **comment_likes**: 댓글 좋아요 기능
- **notifications**: 알림 기능
- **tags**: 게임 태그/카테고리 기능
- **reports**: 신고 기능

### 4. 성능 최적화

- **Materialized Views**: 인기 게임, 통계 데이터 등 자주 조회되는 데이터
- **Full-text Search**: 게임 제목, 내용 검색을 위한 인덱스
- **Pagination**: 대량 데이터 조회를 위한 커서 기반 페이지네이션

---

## Supabase MCP 연결 고려사항

### 1. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 설정해야 합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # 서버 사이드 전용
```

### 2. 프로젝트 초기화

Supabase MCP를 사용하기 전에:

1. Firebase MCP 서버 설정 확인
2. Supabase 프로젝트 ID 확인
3. 환경 변수 설정 확인

### 3. 타입 생성

Supabase에서 타입을 자동 생성하려면:

```bash
npx supabase gen types typescript --project-id <project-id> > shared/types/database.ts
```

또는 Supabase CLI 사용:

```bash
supabase gen types typescript --local > shared/types/database.ts
```

### 4. RLS (Row Level Security) 정책

모든 테이블에 RLS를 활성화하고 적절한 정책을 설정해야 합니다.

### 5. 함수 및 트리거

자동 업데이트를 위한 트리거:

```sql
-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 6. 데이터베이스 마이그레이션

Supabase Dashboard에서 SQL Editor를 사용하거나, Supabase CLI를 사용하여 마이그레이션을 관리합니다.

---

## SQL 스크립트 예시

전체 스키마 생성 SQL은 `supabase/migrations/` 폴더에 저장하는 것을 권장합니다.

