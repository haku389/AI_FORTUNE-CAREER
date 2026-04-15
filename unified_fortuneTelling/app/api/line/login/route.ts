import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID!
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://career-uranai.site'
  const redirectUri = `${baseUrl}/api/line/callback`

  const state = crypto.randomUUID()

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: channelId,
    redirect_uri: redirectUri,
    scope: 'profile openid',
    state,
  })

  const res = NextResponse.redirect(
    `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`,
  )
  res.cookies.set('line_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })
  return res
}
