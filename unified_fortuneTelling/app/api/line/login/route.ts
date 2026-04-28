import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

/**
 * HMAC署名付きstateを生成（cookieなし）
 * state = "timestamp.hmac" の形式
 * cookieに依存しないためSafari/Instagram/Googleアプリ等すべてのブラウザで動作する
 */
function generateState(secret: string): string {
  const timestamp = Date.now().toString()
  const hmac = createHmac('sha256', secret).update(timestamp).digest('hex').slice(0, 24)
  return `${timestamp}.${hmac}`
}

export async function GET(_req: NextRequest) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://career-uranai.site'

  if (!channelId) {
    console.error('[LINE login] LINE_LOGIN_CHANNEL_ID is not set')
    return NextResponse.redirect(`${baseUrl}/premium/form?line_error=config`)
  }

  const secret = process.env.LINE_LOGIN_CHANNEL_SECRET ?? process.env.LINE_STATE_SECRET ?? 'fallback-secret'
  const state = generateState(secret)
  const redirectUri = `${baseUrl}/api/line/callback`

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: channelId,
    redirect_uri: redirectUri,
    scope: 'profile',
    state,
    // ログインと同時に公式アカウント追加を促す（LINE DevelopersでLoginチャンネルとMessaging APIチャンネルをリンク済みの場合に有効）
    bot_prompt: 'aggressive',
  })

  // cookieは不要（stateはHMAC自己検証型）
  return NextResponse.redirect(
    `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`,
  )
}
