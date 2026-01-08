# Supabase MCP 연결 가이드

## MCP (Model Context Protocol) 개요

현재 제공된 MCP 도구들은 주로 Firebase를 위한 것이지만, Supabase는 직접 클라이언트 라이브러리를 사용하여 연결할 수 있습니다.

## Supabase 연결 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://udiuhjrshhuxkjmcwmek.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PYym-R3fU9N4tsif1D4TFg_7RMvo_yF
```

### 2. Supabase 클라이언트 사용

프로젝트에서는 `shared/lib/supabase-client.ts`에서 제공하는 클라이언트를 사용합니다:

```typescript
// 클라이언트 사이드 (브라우저)
import { createBrowserClient } from '@/shared/lib/supabase-client'

const supabase = createBrowserClient()

// 서버 사이드 (Next.js 서버 컴포넌트, API 라우트)
import { createServerClient } from '@/shared/lib/supabase-client'

const supabase = createServerClient()
```

### 3. 연결 테스트

```bash
# tsx 설치
npm install -D tsx

# 연결 테스트
npx tsx scripts/test-supabase-connection.ts
```

## 현재 설정된 정보

- **Project URL**: `https://udiuhjrshhuxkjmcwmek.supabase.co`
- **Publishable API Key**: `sb_publishable_PYym-R3fU9N4tsif1D4TFg_7RMvo_yF`

## 다음 단계

1. **데이터베이스 스키마 생성**
   - Supabase Dashboard → SQL Editor
   - `supabase/migrations/001_initial_schema.sql` 파일 내용 실행

2. **Storage 버킷 생성**
   - Supabase Dashboard → Storage
   - `game-images` 버킷 생성

3. **타입 생성** (선택사항)
   ```bash
   npx supabase gen types typescript --project-id udiuhjrshhuxkjmcwmek > shared/types/database.ts
   ```

## 주의사항

- Supabase는 Firebase MCP와 별개의 서비스입니다
- 현재 사용 가능한 MCP 도구들은 Firebase용이지만, Supabase는 직접 클라이언트 라이브러리를 통해 연결합니다
- 환경 변수는 서버 재시작 후 적용됩니다


