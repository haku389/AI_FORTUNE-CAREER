import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

/**
 * HMAC署名付きstateを検証（cookieなし）
 * state = "timestamp.hmac" の形式
 * 10分以内かつHMACが一致すれば有効
 */
function verifyState(state: string, secret: string): boolean {
  try {
    const dotIndex = state.lastIndexOf('.')
    if (dotIndex === -1) return false
    const timestamp = state.slice(0, dotIndex)
    const receivedHmac = state.slice(dotIndex + 1)

    // 10分以内かチェック
    const ts = parseInt(timestamp, 10)
    if (isNaN(ts) || Date.now() - ts > 10 * 60 * 1000) return false

    // HMAC検証（タイミング攻撃対策でtimingSafeEqual使用）
    const expectedHmac = createHmac('sha256', secret).update(timestamp).digest('hex').slice(0, 24)
    return timingSafeEqual(Buffer.from(receivedHmac), Buffer.from(expectedHmac))
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://career-uranai.site'
  const redirectUri = `${baseUrl}/api/line/callback`

  // LINE がエラーを返した場合（例: ユーザーがキャンセル）
  const lineError = searchParams.get('error')
  if (lineError) {
    const desc = searchParams.get('error_description') ?? lineError
    console.error('[LINE callback] LINE returned error:', lineError, desc)
    return NextResponse.redirect(
      `${baseUrl}/premium/form?line_error=${encodeURIComponent(lineError)}`,
    )
  }

  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/premium/form?line_error=missing_params`)
  }

  // HMAC検証（cookieなし）
  const secret = process.env.LINE_LOGIN_CHANNEL_SECRET ?? process.env.LINE_STATE_SECRET ?? 'fallback-secret'
  if (!verifyState(state, secret)) {
    console.error('[LINE callback] state verification failed (HMAC mismatch or expired)')
    return NextResponse.redirect(`${baseUrl}/premium/form?line_error=state_mismatch`)
  }

  // コードをアクセストークンに交換
  const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINE_LOGIN_CHANNEL_ID!,
      client_secret: process.env.LINE_LOGIN_CHANNEL_SECRET!,
    }),
  })

  if (!tokenRes.ok) {
    const errText = await tokenRes.text()
    console.error('[LINE callback] token exchange failed:', tokenRes.status, errText)
    return NextResponse.redirect(`${baseUrl}/premium/form?line_error=token_failed`)
  }

  const tokenData = await tokenRes.json()

  // プロフィール取得
  const profileRes = await fetch('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })

  if (!profileRes.ok) {
    const errText = await profileRes.text()
    console.error('[LINE callback] profile fetch failed:', profileRes.status, errText)
    return NextResponse.redirect(`${baseUrl}/premium/form?line_error=profile_failed`)
  }

  const profile = await profileRes.json()

  const res = NextResponse.redirect(`${baseUrl}/premium/form?line_login=success`)

  // SameSite=None + Secure: インアプリブラウザ(Instagram/LINE内)でも確実にcookieが設定される
  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as const,
    maxAge: 3600 * 24 * 7, // 7日間
    path: '/',
  }

  res.cookies.set('line_user_id', (profile.userId as string) ?? '', cookieOpts)
  res.cookies.set('line_display_name', (profile.displayName as string) ?? '', cookieOpts)
  res.cookies.set('line_picture_url', (profile.pictureUrl as string) ?? '', cookieOpts)

  return res
}
