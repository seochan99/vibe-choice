// 게임 관련 서비스 함수
import { getBrowserClient } from '@/shared/lib/supabase-client'
import type { Database } from '@/shared/types/database'

type Game = Database['public']['Tables']['games']['Row']
type GameInsert = Database['public']['Tables']['games']['Insert']

/**
 * 이미지를 Supabase Storage에 업로드하고 Public URL을 반환
 */
async function uploadImage(
  file: File,
  gameId: string,
  choice: 'a' | 'b'
): Promise<string | null> {
  try {
    const supabase = getBrowserClient()
    if (!supabase) {
      throw new Error('Supabase client is not available')
    }

    // 현재 인증된 사용자 확인
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authUser) {
      throw new Error('User not authenticated for image upload')
    }

    // 파일 확장자 추출
    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `choice_${choice}.${fileExt}`
    const filePath = `${gameId}/${fileName}`

    // 이미지 업로드 (인증된 사용자로)
    const { data, error: uploadError } = await supabase.storage
      .from('game-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Image upload error:', uploadError)
      console.error('Upload error details:', {
        message: uploadError.message,
        name: uploadError.name,
      })
      throw uploadError
    }

    // Public URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('game-images')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Failed to upload image:', error)
    throw error
  }
}

/**
 * 게임 생성
 */
export async function createGame(data: {
  title: string
  choiceA: string
  choiceB: string
  imageA: File | null
  imageB: File | null
}): Promise<Game> {
  const supabase = getBrowserClient()
  if (!supabase) {
    throw new Error('Supabase client is not available')
  }

  try {
    // 현재 인증된 사용자 확인
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authUser) {
      throw new Error('User not authenticated')
    }

    // 1. 먼저 게임 레코드 생성 (이미지 URL 없이)
    const gameData: GameInsert = {
      user_id: authUser.id, // auth.uid()와 일치하도록 직접 사용
      title: data.title.trim(),
      choice_a: data.choiceA.trim(),
      choice_b: data.choiceB.trim(),
      image_a_url: null,
      image_b_url: null,
      view_count: 0,
    }

    const { data: game, error: insertError } = await supabase
      .from('games')
      // @ts-expect-error - Supabase 타입 추론 문제
      .insert(gameData)
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    if (!game) {
      throw new Error('Failed to create game')
    }

    const gameRecord = game as Game

    // 2. 이미지가 있으면 업로드하고 URL 업데이트
    const imageUrls: { image_a_url?: string; image_b_url?: string } = {}

    if (data.imageA) {
      try {
        const imageAUrl = await uploadImage(data.imageA, gameRecord.id, 'a')
        if (imageAUrl) {
          imageUrls.image_a_url = imageAUrl
        }
      } catch (error) {
        console.error('Failed to upload image A:', error)
        // 이미지 업로드 실패해도 게임은 생성됨
      }
    }

    if (data.imageB) {
      try {
        const imageBUrl = await uploadImage(data.imageB, gameRecord.id, 'b')
        if (imageBUrl) {
          imageUrls.image_b_url = imageBUrl
        }
      } catch (error) {
        console.error('Failed to upload image B:', error)
        // 이미지 업로드 실패해도 게임은 생성됨
      }
    }

    // 3. 이미지 URL이 있으면 게임 레코드 업데이트
    if (imageUrls.image_a_url || imageUrls.image_b_url) {
      const { data: updatedGame, error: updateError } = await supabase
        .from('games')
        // @ts-expect-error - Supabase 타입 추론 문제
        .update(imageUrls)
        .eq('id', gameRecord.id)
        .select()
        .single()

      if (updateError) {
        console.error('Failed to update game with image URLs:', updateError)
        // 업데이트 실패해도 게임은 생성됨
        return gameRecord
      }

      return (updatedGame as Game) || gameRecord
    }

    return gameRecord
  } catch (error) {
    console.error('Failed to create game:', error)
    throw error
  }
}

