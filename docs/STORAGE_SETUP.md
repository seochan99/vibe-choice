# Storage 버킷 설정 가이드

## 버킷 정보

- **버킷 이름**: `game-images`
- **용도**: 밸런스 게임의 선택지 A/B 이미지 저장

## 버킷 생성 방법

### Supabase Dashboard에서 생성

1. Supabase Dashboard → Storage 접속
2. "New bucket" 클릭
3. 버킷 이름: `game-images`
4. Public bucket: **체크 해제** (정책으로 접근 제어)
5. File size limit: 필요에 따라 설정 (예: 5MB)
6. Allowed MIME types: `image/*` 또는 구체적으로 `image/jpeg,image/png,image/webp`
7. "Create bucket" 클릭

## Storage 정책

다음 정책이 이미 설정되어 있습니다:

### 1. Public Access (읽기)
모든 사용자가 이미지를 읽을 수 있습니다.

```sql
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'game-images');
```

### 2. Authenticated Upload (업로드)
인증된 사용자만 이미지를 업로드할 수 있습니다.

```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'game-images' 
        AND auth.role() = 'authenticated'
    );
```

### 3. Owner Delete (삭제)
게임 소유자만 자신의 게임 이미지를 삭제할 수 있습니다.

```sql
CREATE POLICY "Game owners can delete images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'game-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
```

## 파일 경로 구조

권장하는 파일 경로 구조:

```
game-images/
└── {game_id}/
    ├── choice_a.{ext}
    └── choice_b.{ext}
```

예시:
- `game-images/123e4567-e89b-12d3-a456-426614174000/choice_a.jpg`
- `game-images/123e4567-e89b-12d3-a456-426614174000/choice_b.png`

## 사용 예시

### 이미지 업로드

```typescript
import { createBrowserClient } from '@/shared/lib/supabase-client'

const supabase = createBrowserClient()

// 게임 ID별 폴더에 이미지 업로드
const { data, error } = await supabase.storage
  .from('game-images')
  .upload(`${gameId}/choice_a.jpg`, file, {
    cacheControl: '3600',
    upsert: false
  })

if (error) {
  console.error('Upload error:', error)
} else {
  // Public URL 가져오기
  const { data: { publicUrl } } = supabase.storage
    .from('game-images')
    .getPublicUrl(`${gameId}/choice_a.jpg`)
  
  console.log('Public URL:', publicUrl)
}
```

### 이미지 URL 가져오기

```typescript
// Public URL 생성
const { data: { publicUrl } } = supabase.storage
  .from('game-images')
  .getPublicUrl(`${gameId}/choice_a.jpg`)

// 또는 Signed URL (임시 접근)
const { data, error } = await supabase.storage
  .from('game-images')
  .createSignedUrl(`${gameId}/choice_a.jpg`, 3600) // 1시간 유효
```

### 이미지 삭제

```typescript
const { data, error } = await supabase.storage
  .from('game-images')
  .remove([`${gameId}/choice_a.jpg`, `${gameId}/choice_b.jpg`])
```

## 보안 고려사항

1. **파일 크기 제한**: 버킷 설정에서 최대 파일 크기 제한 (예: 5MB)
2. **MIME 타입 제한**: 이미지 파일만 허용
3. **업로드 권한**: 인증된 사용자만 업로드 가능
4. **삭제 권한**: 게임 소유자만 삭제 가능

## 다음 단계

버킷 생성 후:
1. Storage 정책이 올바르게 설정되었는지 확인
2. 테스트 이미지 업로드로 정책 검증
3. 게임 생성 기능에서 이미지 업로드 구현


