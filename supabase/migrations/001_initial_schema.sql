-- 바이브 초이스 초기 스키마
-- 이 파일은 Supabase 마이그레이션으로 실행됩니다.

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. users 테이블
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- users 인덱스
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_username_idx ON public.users(username);

-- users RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- users RLS 정책
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- users updated_at 트리거
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. games 테이블
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    choice_a TEXT NOT NULL,
    choice_b TEXT NOT NULL,
    image_a_url TEXT,
    image_b_url TEXT,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- games 인덱스
CREATE INDEX IF NOT EXISTS games_user_id_idx ON public.games(user_id);
CREATE INDEX IF NOT EXISTS games_created_at_idx ON public.games(created_at DESC);
CREATE INDEX IF NOT EXISTS games_view_count_idx ON public.games(view_count DESC);

-- games RLS 활성화
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- games RLS 정책
CREATE POLICY "Anyone can view games" ON public.games
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create games" ON public.games
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own games" ON public.games
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own games" ON public.games
    FOR DELETE USING (auth.uid() = user_id);

-- games updated_at 트리거
CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON public.games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. votes 테이블
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    choice TEXT NOT NULL CHECK (choice IN ('A', 'B')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(game_id, user_id)
);

-- votes 인덱스
CREATE INDEX IF NOT EXISTS votes_game_id_idx ON public.votes(game_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON public.votes(user_id);

-- votes RLS 활성화
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- votes RLS 정책
CREATE POLICY "Anyone can view votes" ON public.votes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create votes" ON public.votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON public.votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON public.votes
    FOR DELETE USING (auth.uid() = user_id);

-- votes updated_at 트리거
CREATE TRIGGER update_votes_updated_at
    BEFORE UPDATE ON public.votes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. comments 테이블
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- comments 인덱스
CREATE INDEX IF NOT EXISTS comments_game_id_idx ON public.comments(game_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS comments_game_created_at_idx ON public.comments(game_id, created_at DESC);

-- comments RLS 활성화
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- comments RLS 정책
CREATE POLICY "Anyone can view comments" ON public.comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments
    FOR DELETE USING (auth.uid() = user_id);

-- comments updated_at 트리거
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


