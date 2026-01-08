# 도메인 구매 및 Vercel 연결 가이드

바이브 초이스 프로젝트를 Vercel에 배포하고 커스텀 도메인을 연결하는 방법을 안내합니다.

## 1. 도메인 구매하기

### Namecheap에서 도메인 구매하기

1. **Namecheap 접속**
   - [Namecheap 웹사이트](https://www.namecheap.com)에 접속
   - 계정이 없으면 회원가입 진행

2. **도메인 검색**
   - 홈페이지 상단의 검색창에 원하는 도메인 이름 입력
   - 예: `vibechoice`, `vibe-choice`, `vibechoiceapp` 등
   - 검색 버튼 클릭

3. **도메인 선택**
   - 사용 가능한 도메인 목록 확인
   - 원하는 도메인과 확장자(.com, .net, .io 등) 선택
   - 가격 확인 후 장바구니에 추가

4. **결제 진행**
   - 장바구니에서 결제 진행
   - WHOIS Guard(개인정보 보호) 옵션 권장
   - 결제 완료 후 도메인 소유권 확보

### GoDaddy에서 도메인 구매하기

1. **GoDaddy 접속**
   - [GoDaddy 웹사이트](https://www.godaddy.com)에 접속
   - 계정이 없으면 회원가입 진행

2. **도메인 검색**
   - 홈페이지 검색창에 원하는 도메인 이름 입력
   - 검색 버튼 클릭

3. **도메인 선택 및 구매**
   - 사용 가능한 도메인 목록 확인
   - 원하는 도메인 선택 후 장바구니에 추가
   - 결제 진행

## 2. Vercel에 프로젝트 배포하기

### Vercel 계정 생성 및 프로젝트 연결

1. **Vercel 접속**
   - [Vercel 웹사이트](https://vercel.com)에 접속
   - GitHub 계정으로 로그인 (권장)

2. **프로젝트 Import**
   - Dashboard에서 "Add New..." → "Project" 클릭
   - GitHub 저장소 선택: `seochan99/vibe-choice`
   - Import 클릭

3. **프로젝트 설정**
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)
   - **Install Command**: `npm install` (기본값)

4. **환경 변수 설정**
   - "Environment Variables" 섹션에서 다음 변수 추가:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - 각 환경(Production, Preview, Development)에 추가

5. **배포 실행**
   - "Deploy" 버튼 클릭
   - 배포 완료까지 대기 (약 2-3분)
   - 배포 완료 후 `your-project.vercel.app` 형태의 URL 제공

## 3. 커스텀 도메인 연결하기

### Vercel에서 도메인 추가

1. **프로젝트 설정으로 이동**
   - Vercel Dashboard에서 프로젝트 선택
   - "Settings" 탭 클릭
   - "Domains" 메뉴 선택

2. **도메인 추가**
   - "Add Domain" 버튼 클릭
   - 구매한 도메인 입력 (예: `vibechoice.com`)
   - "Add" 클릭

3. **DNS 설정 안내 확인**
   - Vercel이 DNS 설정 방법을 안내
   - 두 가지 방법 중 선택:
     - **방법 1**: Vercel Nameservers 사용 (권장)
     - **방법 2**: A Record / CNAME Record 사용

### Namecheap에서 DNS 설정하기

#### 방법 1: Vercel Nameservers 사용 (권장)

1. **Namecheap 도메인 관리**
   - Namecheap에 로그인
   - "Domain List" → 구매한 도메인 선택
   - "Advanced DNS" 탭 클릭

2. **Nameservers 변경**
   - "Nameservers" 섹션에서 "Custom DNS" 선택
   - Vercel에서 제공한 Nameservers 입력:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - 저장

3. **Vercel에서 확인**
   - Vercel Dashboard로 돌아가기
   - 도메인 설정에서 "Refresh" 클릭
   - DNS 전파 완료까지 대기 (최대 24시간, 보통 1-2시간)

#### 방법 2: A Record / CNAME Record 사용

1. **Vercel DNS 정보 확인**
   - Vercel Dashboard → 프로젝트 → Settings → Domains
   - 도메인 옆의 "..." 메뉴 → "View DNS Records"
   - A Record 또는 CNAME Record 정보 확인

2. **Namecheap에서 DNS 레코드 추가**
   - Namecheap → Domain List → 도메인 선택
   - "Advanced DNS" 탭
   - "Add New Record" 클릭
   - **A Record 추가**:
     - Type: `A Record`
     - Host: `@` 또는 `www`
     - Value: Vercel이 제공한 IP 주소 (예: `76.76.21.21`)
     - TTL: `Automatic`
   - 또는 **CNAME Record 추가**:
     - Type: `CNAME Record`
     - Host: `www`
     - Value: `cname.vercel-dns.com.`
     - TTL: `Automatic`
   - 저장

3. **Vercel에서 확인**
   - Vercel Dashboard에서 도메인 상태 확인
   - DNS 전파 완료까지 대기

### GoDaddy에서 DNS 설정하기

1. **GoDaddy 도메인 관리**
   - GoDaddy에 로그인
   - "My Products" → "DNS" 클릭
   - 구매한 도메인 선택

2. **Nameservers 변경 (방법 1)**
   - "Nameservers" 섹션에서 "Change" 클릭
   - "Custom" 선택
   - Vercel Nameservers 입력:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - 저장

3. **DNS 레코드 추가 (방법 2)**
   - "Records" 섹션에서 "Add" 클릭
   - A Record 또는 CNAME Record 추가 (위 Namecheap 방법 2 참고)

## 4. SSL 인증서 자동 설정

Vercel은 자동으로 SSL 인증서를 발급하고 관리합니다:
- 도메인 연결 후 자동으로 HTTPS 활성화
- Let's Encrypt 인증서 자동 갱신
- 추가 설정 불필요

## 5. 도메인 연결 확인

1. **DNS 전파 확인**
   - [whatsmydns.net](https://www.whatsmydns.net)에서 DNS 전파 상태 확인
   - 전 세계 DNS 서버에 전파되는데 최대 24시간 소요
   - 보통 1-2시간 내 완료

2. **도메인 접속 테스트**
   - 브라우저에서 구매한 도메인으로 접속
   - 예: `https://vibechoice.com`
   - Vercel 배포 사이트가 정상적으로 표시되는지 확인

3. **Vercel Dashboard 확인**
   - 프로젝트 → Settings → Domains
   - 도메인 상태가 "Valid Configuration"으로 표시되는지 확인

## 6. 서브도메인 설정 (선택사항)

`www` 서브도메인도 함께 연결하려면:

1. **Vercel에서 도메인 추가**
   - Settings → Domains → "Add Domain"
   - `www.vibechoice.com` 입력
   - Vercel이 자동으로 메인 도메인으로 리다이렉트 설정

2. **또는 DNS에서 CNAME 설정**
   - DNS 관리 패널에서:
     - Type: `CNAME`
     - Host: `www`
     - Value: `cname.vercel-dns.com.`

## 7. 환경 변수 확인

프로덕션 환경에서도 환경 변수가 제대로 설정되었는지 확인:

1. **Vercel Dashboard**
   - 프로젝트 → Settings → Environment Variables
   - Production 환경에 다음 변수 확인:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **재배포**
   - 환경 변수 변경 후 "Redeploy" 실행

## 8. 트러블슈팅

### 도메인이 연결되지 않는 경우

1. **DNS 전파 확인**
   - DNS 전파가 완료되지 않았을 수 있음
   - 24시간까지 기다려보기

2. **DNS 레코드 확인**
   - DNS 레코드가 올바르게 설정되었는지 확인
   - Vercel Dashboard의 DNS 설정 안내 따르기

3. **도메인 상태 확인**
   - Vercel Dashboard에서 도메인 상태 확인
   - 에러 메시지가 있으면 해결

### SSL 인증서 문제

- Vercel이 자동으로 SSL 인증서를 발급하므로 대부분 문제없음
- 도메인 연결 후 몇 분 내 자동 활성화
- 문제가 있으면 Vercel 지원팀에 문의

## 9. 추가 팁

### 도메인 가격 비교

- **Namecheap**: 보통 저렴하고 WHOIS Guard 무료 제공
- **GoDaddy**: 초기 가격은 저렴하지만 갱신 시 가격 상승
- **Cloudflare**: 도메인 등록 가능, DNS 관리 무료
- **Google Domains**: 간단한 인터페이스, 합리적인 가격

### 권장 도메인 확장자

- `.com`: 가장 일반적, 신뢰도 높음
- `.io`: 기술 스타트업에 인기
- `.app`: 앱 서비스에 적합
- `.co`: 짧고 기억하기 쉬움

### 비용 예상

- 도메인: 연간 $10-15 (`.com` 기준)
- Vercel: 무료 플랜으로 시작 가능 (Hobby 플랜)
- SSL: Vercel에서 자동 무료 제공

## 참고 자료

- [Vercel 도메인 설정 가이드](https://vercel.com/docs/concepts/projects/domains)
- [Namecheap 도메인 관리 가이드](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
- [GoDaddy DNS 설정 가이드](https://www.godaddy.com/help/change-nameservers-664)


