-- Storage 버킷 정책 설정
-- 주의: 이 마이그레이션은 'game-images' 버킷이 먼저 생성되어 있어야 합니다.
-- Supabase Dashboard → Storage에서 버킷을 먼저 생성하세요.

-- 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Game owners can delete images" ON storage.objects;

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
-- 파일 경로가 {game_id}/filename 형식이라고 가정
CREATE POLICY "Game owners can delete images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'game-images'
        AND auth.uid()::text = (string_to_array(name, '/'))[1]
    );

