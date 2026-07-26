import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { verifyThreadsSignedRequest } from '@/lib/threadsSignedRequest'

/**
 * Metaアプリ設定の「コールバックURLを削除」（データ削除リクエスト）用エンドポイント。
 * 本アプリは投稿用の単一アカウント（@reiko_career1）のみを扱い、Threads側から取得した
 * ユーザーごとの個人データを保存していないため、実際の削除処理は不要。
 * Meta側の仕様（url + confirmation_code をJSONで返す）だけ満たす。
 */
export async function POST(req: NextRequest) {
  const appSecret = process.env.THREADS_APP_SECRET
  if (!appSecret) {
    return NextResponse.json({ error: 'THREADS_APP_SECRET未設定' }, { status: 500 })
  }

  const form = await req.formData().catch(() => null)
  const signedRequest = form?.get('signed_request')
  if (typeof signedRequest !== 'string') {
    return NextResponse.json({ error: 'signed_requestがありません' }, { status: 400 })
  }

  const payload = verifyThreadsSignedRequest(signedRequest, appSecret)
  if (!payload) {
    return NextResponse.json({ error: '署名検証に失敗しました' }, { status: 400 })
  }

  console.log(`[threads] data-deletion受信: user_id=${payload.user_id}`)

  const confirmationCode = randomBytes(8).toString('hex')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://career-uranai.site'

  return NextResponse.json({
    url: `${baseUrl}/threads-deletion-status?code=${confirmationCode}`,
    confirmation_code: confirmationCode,
  })
}
