import { NextRequest, NextResponse } from 'next/server'
import { verifyThreadsSignedRequest } from '@/lib/threadsSignedRequest'

/**
 * Metaアプリ設定の「コールバックURLをアンインストール」用エンドポイント。
 * ユーザー（このアプリでは@reiko_career1のみ）がアプリの許可を取り消すとMetaがPOSTしてくる。
 * 本アプリは投稿用の単一アカウントのみを扱い、ユーザーごとの保存データを持たないため、
 * 署名検証のうえ受理したことだけを返す。
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

  console.log(`[threads] deauthorize受信: user_id=${payload.user_id}`)
  return NextResponse.json({ status: 'ok' })
}
