# Supabase 설정 가이드

## 1. 프로젝트 생성

1. [Supabase Dashboard](https://app.supabase.com)에 접속
2. 새 프로젝트 생성
3. 프로젝트 설정 완료 후 URL과 API 키 확인

## 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. 데이터베이스 스키마 생성

### 방법 1: SQL Editor 사용

1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/001_initial_schema.sql` 파일 내용 복사
3. SQL Editor에 붙여넣고 실행

### 방법 2: Supabase CLI 사용

```bash
# Supabase CLI 설치 (아직 설치하지 않은 경우)
npm install -g supabase

# Supabase 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

## 4. Storage 설정

### Storage 버킷 생성

1. Supabase Dashboard → Storage
2. 새 버킷 생성: `game-images`
3. Public 버킷으로 설정 (또는 정책으로 접근 제어)

### Storage 정책 설정

```sql
-- Storage 정책: 모든 사용자가 이미지 읽기 가능
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'game-images');

-- Storage 정책: 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'game-images' 
        AND auth.role() = 'authenticated'
    );

-- Storage 정책: 게임 소유자만 삭제 가능
CREATE POLICY "Game owners can delete images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'game-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
```

## 5. 타입 생성

Supabase에서 TypeScript 타입을 자동 생성:

```bash
# Supabase CLI 사용
npx supabase gen types typescript --project-id <project-id> > shared/types/database.ts

# 또는 로컬 개발 환경
supabase gen types typescript --local > shared/types/database.ts
```

## 6. Supabase MCP 연결

### Firebase MCP 서버 설정

Supabase MCP를 사용하려면 Firebase MCP 서버가 Supabase를 지원하는지 확인해야 합니다.

현재 Supabase MCP는 Firebase MCP와 별도로 동작할 수 있으므로:

1. Supabase 클라이언트를 직접 사용하는 방법 (권장)
2. Supabase MCP 서버가 별도로 제공되는 경우 해당 서버 사용

### 클라이언트 초기화

`shared/lib/supabase.ts` 파일에서 클라이언트를 초기화합니다.

## 7. 인증 설정

### 이메일 인증

1. Supabase Dashboard → Authentication → Providers
2. Email Provider 활성화
3. 필요시 소셜 로그인 (Google, GitHub 등) 활성화

### 사용자 프로필 자동 생성

`auth.users`에 새 사용자가 생성될 때 `public.users` 테이블에 프로필을 자동 생성하는 트리거:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 8. 테스트

데이터베이스 연결 및 기본 기능 테스트:

```typescript
// 테스트 예시
import { createClient } from '@/shared/lib/supabase'

const supabase = createClient()

// 게임 목록 조회 테스트
const { data, error } = await supabase
  .from('games')
  .select('*')
  .limit(10)

console.log('Games:', data)
```

## 9. 보안 체크리스트

- [ ] 모든 테이블에 RLS 활성화
- [ ] 적절한 RLS 정책 설정
- [ ] Service Role Key는 서버 사이드에서만 사용
- [ ] 환경 변수는 `.env.local`에 저장하고 `.gitignore`에 추가
- [ ] Storage 버킷 정책 설정
- [ ] CORS 설정 확인

## 10. 모니터링

- Supabase Dashboard → Logs에서 쿼리 로그 확인
- Database → Usage에서 데이터베이스 사용량 모니터링
- API → Usage에서 API 호출량 확인


