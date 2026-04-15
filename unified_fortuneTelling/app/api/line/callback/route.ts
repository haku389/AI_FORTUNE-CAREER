import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = req.cookies.get('line_state')?.value

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://career-uranai.site'
  const redirectUri = `${baseUrl}/api/line/callback`

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(`${baseUrl}/premium/form?line_error=1`)
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
    console.error('[LINE callback] token exchange failed:', await tokenRes.text())
    return NextResponse.redirect(`${baseUrl}/premium/form?line_error=2`)
  }

  const tokenData = await tokenRes.json()

  // プロフィール取得
  const profileRes = await fetch('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })

  if (!profileRes.ok) {
    console.error('[LINE callback] profile fetch failed:', await profileRes.text())
    return NextResponse.redirect(`${baseUrl}/premium/form?line_error=3`)
  }

  const profile = await profileRes.json()

  const res = NextResponse.redirect(`${baseUrl}/premium/form?line_login=success`)

  // LINE情報をCookieに保存（1時間）
  res.cookies.set('line_user_id', profile.userId as string, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 3600,
    path: '/',
  })
  res.cookies.set('line_display_name', (profile.displayName as string) ?? '', {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 3600,
    path: '/',
  })
  res.cookies.set('line_picture_url', (profile.pictureUrl as string) ?? '', {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 3600,
    path: '/',
  })
  res.cookies.delete('line_state')

  return res
}
