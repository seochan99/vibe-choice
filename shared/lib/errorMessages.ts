// 친절한 에러 메시지 유틸리티

/**
 * 기술적인 에러 메시지를 사용자 친화적인 메시지로 변환
 */
export function getFriendlyErrorMessage(error: any): string {
  if (!error) {
    return '문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }

  const errorMessage = error.message || String(error)

  // 기술적인 에러 코드를 친절한 메시지로 변환
  if (errorMessage.includes('not authenticated') || errorMessage.includes('User not authenticated')) {
    return '로그인이 필요합니다. 먼저 로그인해주세요.'
  }

  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return '인터넷 연결을 확인해주세요. 네트워크 문제로 요청을 처리할 수 없습니다.'
  }

  if (errorMessage.includes('timeout')) {
    return '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.'
  }

  if (errorMessage.includes('storage') || errorMessage.includes('upload')) {
    return '이미지 업로드에 실패했습니다. 이미지 파일을 확인하고 다시 시도해주세요.'
  }

  if (errorMessage.includes('row-level security') || errorMessage.includes('RLS')) {
    return '권한이 없습니다. 로그인 상태를 확인해주세요.'
  }

  if (errorMessage.includes('not found') || errorMessage.includes('존재하지')) {
    return '요청하신 내용을 찾을 수 없습니다.'
  }

  if (errorMessage.includes('duplicate') || errorMessage.includes('중복')) {
    return '이미 처리된 요청입니다.'
  }

  // 기본 메시지
  return '문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
}

