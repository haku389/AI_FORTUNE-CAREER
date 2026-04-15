import { NextRequest, NextResponse } from 'next/server'

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
  const storedState = req.cookies.get('line_state')?.value

  // state 検証
  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/premium/form?line_error=missing_params`)
  }
  if (!storedState || state !== storedState) {
    console.error('[LINE callback] state mismatch', { state, storedState })
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

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 3600,
    path: '/',
  }

  res.cookies.set('line_user_id', (profile.userId as string) ?? '', cookieOpts)
  res.cookies.set('line_display_name', (profile.displayName as string) ?? '', cookieOpts)
  res.cookies.set('line_picture_url', (profile.pictureUrl as string) ?? '', cookieOpts)
  res.cookies.delete('line_state')

  return res
}
