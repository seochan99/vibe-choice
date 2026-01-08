# 환경 변수 설정 가이드

## .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://udiuhjrshhuxkjmcwmek.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PYym-R3fU9N4tsif1D4TFg_7RMvo_yF

# Service Role Key (선택사항 - 서버 사이드 관리 작업용)
# Supabase Dashboard → Settings → API → service_role key에서 확인
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 환경 변수 설명

### NEXT_PUBLIC_SUPABASE_URL
- Supabase 프로젝트의 공개 URL
- 클라이언트 사이드에서 접근 가능하므로 `NEXT_PUBLIC_` 접두사 사용
- 제공된 값: `https://udiuhjrshhuxkjmcwmek.supabase.co`

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- Supabase의 공개 API 키 (Publishable Key)
- 클라이언트 사이드에서 사용
- RLS(Row Level Security) 정책에 따라 접근 제어됨
- 제공된 값: `sb_publishable_PYym-R3fU9N4tsif1D4TFg_7RMvo_yF`

### SUPABASE_SERVICE_ROLE_KEY (선택사항)
- 서버 사이드 관리 작업용 키
- RLS를 우회하여 모든 데이터에 접근 가능
- **절대 클라이언트 사이드에 노출하지 마세요!**
- Supabase Dashboard → Settings → API에서 확인 가능

## 연결 테스트

환경 변수를 설정한 후 연결을 테스트하려면:

```bash
# tsx 설치 (아직 설치하지 않은 경우)
npm install -D tsx

# 연결 테스트 실행
npx tsx scripts/test-supabase-connection.ts
```

또는 Next.js 개발 서버를 실행:

```bash
npm run dev
```

## 보안 주의사항

1. **`.env.local` 파일은 절대 Git에 커밋하지 마세요**
   - 이미 `.gitignore`에 포함되어 있습니다

2. **환경 변수는 서버 재시작 후 적용됩니다**
   - Next.js 개발 서버를 재시작하세요

3. **프로덕션 환경에서는 Vercel, Netlify 등의 환경 변수 설정을 사용하세요**

## 문제 해결

### "Missing Supabase environment variables" 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 파일 이름이 정확히 `.env.local`인지 확인 (`.env.local.txt` 아님)
- Next.js 개발 서버를 재시작했는지 확인

### 연결 테스트 실패
- Supabase 프로젝트가 활성화되어 있는지 확인
- URL과 API 키가 정확한지 확인
- Supabase Dashboard에서 프로젝트 상태 확인


