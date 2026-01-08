# Supabase Realtime 설정 가이드

바이브 초이스에서 투표 수가 실시간으로 업데이트되도록 Supabase Realtime을 설정하는 방법입니다.

## 1. Supabase Dashboard에서 Realtime 활성화

1. [Supabase Dashboard](https://app.supabase.com)에 로그인합니다.
2. 프로젝트를 선택합니다.
3. 왼쪽 메뉴에서 **Database** → **Replication**을 클릭합니다.
4. `votes` 테이블을 찾아 **Enable** 버튼을 클릭합니다.

또는 SQL Editor에서 다음 명령을 실행할 수 있습니다:

```sql
-- Realtime 활성화 (Supabase Dashboard에서 자동으로 설정되지만, 수동으로도 가능)
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
```

## 2. Realtime 기능 확인

Realtime이 제대로 작동하는지 확인하려면:

1. 두 개의 브라우저 창을 엽니다.
2. 한 창에서는 게임 디테일 페이지를 엽니다.
3. 다른 창에서 같은 게임에 투표합니다.
4. 첫 번째 창에서 투표 수가 자동으로 업데이트되는지 확인합니다.

## 3. 구현된 기능

### 메인 피드 페이지 (`/`)
- 모든 게임의 투표 변경을 실시간으로 감지
- 투표 수가 변경되면 해당 게임 카드의 통계가 자동 업데이트

### 게임 디테일 페이지 (`/games/[id]`)
- 특정 게임의 투표 변경을 실시간으로 감지
- 투표 수와 퍼센트가 자동 업데이트
- 선택지 버튼의 퍼센트 표시도 실시간으로 변경

## 4. 기술적 세부사항

### Realtime Hook (`useVoteRealtime`)
- `features/choice/hooks/useVoteRealtime.ts`에 구현됨
- Supabase Realtime 채널을 구독하여 `votes` 테이블의 변경 사항을 감지
- INSERT, UPDATE, DELETE 이벤트 모두 감지

### 통계 업데이트 함수 (`getGameStats`)
- `features/choice/lib/gameStats.ts`에 구현됨
- 특정 게임의 투표 통계를 조회하여 UI 업데이트

## 5. 문제 해결

### Realtime이 작동하지 않는 경우

1. **Supabase Dashboard 확인**
   - Database → Replication에서 `votes` 테이블이 활성화되어 있는지 확인

2. **브라우저 콘솔 확인**
   - 개발자 도구의 콘솔에서 Realtime 연결 오류가 있는지 확인
   - "Vote change detected" 로그가 출력되는지 확인

3. **네트워크 확인**
   - WebSocket 연결이 차단되지 않았는지 확인
   - 방화벽이나 프록시 설정 확인

4. **Supabase 프로젝트 설정 확인**
   - Settings → API에서 Realtime이 활성화되어 있는지 확인

## 6. 참고 자료

- [Supabase Realtime 문서](https://supabase.com/docs/guides/realtime)
- [PostgreSQL Replication 문서](https://www.postgresql.org/docs/current/logical-replication.html)


