# 바이브 초이스 (Vibe Choice)

밸런스 게임 커뮤니티 서비스 - 사용자가 두 가지 선택지로 게임을 만들고, 다른 사람들이 투표하고 댓글로 소통할 수 있는 서비스입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase

## 프로젝트 구조 (Feature-Sliced Design)

```
vibe-choice/
├── app/                    # Next.js App Router
├── shared/                 # 공유 레이어
│   ├── ui/                # 공유 UI 컴포넌트
│   ├── lib/               # 유틸리티 함수
│   ├── types/             # 공유 타입 정의
│   └── constants/         # 공유 상수
├── entities/              # 비즈니스 엔티티
│   ├── user/             # 사용자 엔티티
│   ├── choice/           # 밸런스 게임 엔티티
│   ├── comment/          # 댓글 엔티티
│   └── vote/             # 투표 엔티티
├── features/              # 기능 단위
│   ├── auth/             # 인증 기능
│   ├── choice/          # 밸런스 게임 기능
│   └── comment/        # 댓글 기능
└── widgets/              # 복합 UI 컴포넌트
```

## Getting Started

### 환경 변수 설정

`.env.local` 파일이 이미 생성되어 있습니다. Supabase 연결 정보가 포함되어 있습니다.

자세한 설정 방법은 [docs/ENV_SETUP.md](./docs/ENV_SETUP.md)를 참고하세요.

### Supabase 연결 테스트

환경 변수 설정 후 연결을 테스트할 수 있습니다:

```bash
npx tsx scripts/test-supabase-connection.ts
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 폴더 구조 설명

### shared/
공유 레이어로, 프로젝트 전반에서 사용되는 컴포넌트, 유틸리티, 타입 등을 포함합니다.

### entities/
비즈니스 엔티티를 정의하는 레이어입니다. 각 엔티티는 독립적인 비즈니스 로직을 포함합니다.

### features/
기능 단위로 구성된 레이어입니다. 각 기능은 독립적으로 동작하며, 필요한 컴포넌트, 훅, 로직을 포함합니다.

- **auth/**: 사용자 인증 관련 기능
- **choice/**: 밸런스 게임 관련 기능
- **comment/**: 댓글 관련 기능

### widgets/
여러 features나 entities를 조합하여 만든 복합 UI 컴포넌트입니다.

## 데이터베이스 스키마

프로젝트의 데이터베이스 스키마 설계는 [docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)를 참고하세요.

Supabase 설정 가이드는 [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)를 참고하세요.

Supabase MCP 연결 정보는 [docs/MCP_CONNECTION.md](./docs/MCP_CONNECTION.md)를 참고하세요.

데이터베이스 설정 완료 요약은 [docs/DATABASE_SUMMARY.md](./docs/DATABASE_SUMMARY.md)를 참고하세요.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Supabase Documentation](https://supabase.com/docs)
