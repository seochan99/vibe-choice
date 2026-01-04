# Storage 정책 수동 설정 가이드

Storage 버킷의 RLS 정책은 Supabase Dashboard에서 수동으로 설정해야 합니다.

## 설정 방법

1. **Supabase Dashboard 접속**
   - https://app.supabase.com 접속
   - 프로젝트 선택

2. **Storage → Policies 이동**
   - 좌측 메뉴에서 "Storage" 클릭
   - "Policies" 탭 선택

3. **game-images 버킷 정책 설정**

### 정책 1: Public Read (모든 사용자 읽기)
- **Policy Name**: `game-images public read`
- **Allowed Operation**: `SELECT`
- **Policy Definition**:
```sql
bucket_id = 'game-images'
```

### 정책 2: Authenticated Upload (인증된 사용자 업로드)
- **Policy Name**: `game-images authenticated upload`
- **Allowed Operation**: `INSERT`
- **Policy Definition**:
```sql
bucket_id = 'game-images' AND auth.role() = 'authenticated'
```

### 정책 3: Owner Delete (소유자 삭제)
- **Policy Name**: `game-images owner delete`
- **Allowed Operation**: `DELETE`
- **Policy Definition**:
```sql
bucket_id = 'game-images' AND EXISTS (
  SELECT 1 FROM public.games 
  WHERE games.id::text = (string_to_array(name, '/'))[1]
  AND games.user_id = auth.uid()
)
```

## 빠른 설정 (SQL Editor 사용)

Supabase Dashboard → SQL Editor에서 다음 SQL을 실행:

```sql
-- Storage 정책 생성
CREATE POLICY "game-images public read" ON storage.objects
    FOR SELECT 
    USING (bucket_id = 'game-images');

CREATE POLICY "game-images authenticated upload" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'game-images' 
        AND auth.role() = 'authenticated'
    );
```

## 확인 방법

정책이 제대로 설정되었는지 확인:

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';
```

