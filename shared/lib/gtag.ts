/**
 * Google Analytics 4 (GA4) 이벤트 추적 유틸리티
 * 중복 전송 방지 가드 포함
 */

// GA4 Measurement ID
export const GA_MEASUREMENT_ID = 'G-BZLGK4F72N'

// 전송된 이벤트 추적 (중복 방지용)
const sentEvents = new Map<string, number>()
const EVENT_DEDUP_WINDOW = 1000 // 1초 내 동일 이벤트 중복 방지

// gtag 함수 타입 정의
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

/**
 * 이벤트 키 생성 (중복 방지용)
 */
function getEventKey(eventName: string, params?: Record<string, any>): string {
  const paramsStr = params ? JSON.stringify(params) : ''
  return `${eventName}:${paramsStr}`
}

/**
 * 이벤트가 최근에 전송되었는지 확인
 */
function isEventRecentlySent(eventKey: string): boolean {
  const sentTime = sentEvents.get(eventKey)
  if (!sentTime) return false

  const now = Date.now()
  if (now - sentTime < EVENT_DEDUP_WINDOW) {
    return true
  }

  // 윈도우를 벗어난 오래된 이벤트 제거
  sentEvents.delete(eventKey)
  return false
}

/**
 * 이벤트 전송 기록
 */
function markEventAsSent(eventKey: string): void {
  sentEvents.set(eventKey, Date.now())

  // 메모리 누수 방지: 오래된 이벤트 정리 (5분 이상 된 것)
  if (sentEvents.size > 100) {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    for (const [key, time] of sentEvents.entries()) {
      if (time < fiveMinutesAgo) {
        sentEvents.delete(key)
      }
    }
  }
}

/**
 * GA4 페이지뷰 추적
 */
export function pageview(url: string): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const eventKey = getEventKey('page_view', { url })
  
  // 중복 방지
  if (isEventRecentlySent(eventKey)) {
    return
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })

  markEventAsSent(eventKey)
}

/**
 * GA4 이벤트 추적
 */
export function event(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const eventKey = getEventKey(eventName, eventParams)
  
  // 중복 방지
  if (isEventRecentlySent(eventKey)) {
    return
  }

  window.gtag('event', eventName, eventParams)
  markEventAsSent(eventKey)
}

/**
 * 랜딩 페이지 진입 이벤트
 */
export function trackViewLanding(): void {
  event('view_landing')
}

/**
 * 핵심 플로우 시작 이벤트 (게임 만들기 시작)
 */
export function trackStartCoreFlow(): void {
  event('start_core_flow')
}

/**
 * 핵심 가치 완료 이벤트 (투표 완료)
 */
export function trackCompleteCoreValue(gameId?: string, choice?: string): void {
  event('complete_core_value', {
    game_id: gameId,
    choice,
  })
}

/**
 * 공유 클릭 이벤트
 */
export function trackShareClick(shareType?: string, gameId?: string): void {
  event('share_click', {
    share_type: shareType,
    game_id: gameId,
  })
}

/**
 * 가입 완료 이벤트
 */
export function trackSignUp(method?: string): void {
  event('sign_up', {
    method,
  })
}

/**
 * 결제 의도 이벤트 (향후 사용 가능)
 */
export function trackPurchaseIntent(value?: number, currency?: string): void {
  event('purchase_intent', {
    value,
    currency: currency || 'KRW',
  })
}

