import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://career-uranai.site'

  if (!channelId) {
    console.error('[LINE login] LINE_LOGIN_CHANNEL_ID is not set')
    return NextResponse.redirect(`${baseUrl}/premium/form?line_error=config`)
  }

  const redirectUri = `${baseUrl}/api/line/callback`
  const state = crypto.randomUUID()

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: channelId,
    redirect_uri: redirectUri,
    // openid は nonce が必要なため使用しない。profile だけで十分
    scope: 'profile',
    state,
    // ログインと同時に公式アカウントの友だち追加を促す（LINE DevelopersでLoginチャンネルとMessaging APIチャンネルをリンク済みの場合に有効）
    bot_prompt: 'aggressive',
  })

  const res = NextResponse.redirect(
    `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`,
  )
  res.cookies.set('line_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })
  return res
}
