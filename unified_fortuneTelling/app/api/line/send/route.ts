import { NextRequest, NextResponse } from 'next/server'

const TIMING_LABELS: Record<string, string> = {
  now: '今すぐ動き時 🔥',
  '3m': '3ヶ月以内に行動 ✨',
  '6m': '半年後が本番 🌿',
  wait: 'じっくり充電期 💧',
}

/** Channel IDとSecretから短期アクセストークンを取得 */
async function getChannelAccessToken(): Promise<string> {
  const channelId = process.env.LINE_MESSAGING_CHANNEL_ID
  const channelSecret = process.env.LINE_MESSAGING_CHANNEL_SECRET

  if (!channelId || !channelSecret) {
    throw new Error('LINE_MESSAGING_CHANNEL_ID or LINE_MESSAGING_CHANNEL_SECRET is not set')
  }

  const res = await fetch('https://api.line.me/v2/oauth/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: channelId,
      client_secret: channelSecret,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Token fetch failed: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.access_token as string
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, nickname, score, timing, resultUrl } = body as {
    userId: string
    nickname: string
    score: number
    timing: string
    resultUrl: string
  }

  if (!userId) {
    return NextResponse.json({ error: 'missing_user_id' }, { status: 400 })
  }

  let token: string
  try {
    // 既存の長期トークンがあればそちらを優先、なければ動的取得
    token = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN || await getChannelAccessToken()
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[LINE send] token error:', msg)
    return NextResponse.json({ error: 'token_failed', detail: msg }, { status: 500 })
  }

  const timingLabel = TIMING_LABELS[timing] ?? timing

  const textMessage = {
    type: 'text',
    text: [
      `✨ ${nickname}さんの転職精密鑑定が完了しました`,
      '',
      `📊 転職スコア：${score}点`,
      `⏰ タイミング：${timingLabel}`,
      '',
      '🔮 鑑定結果はこちらからいつでも確認できます👇',
      resultUrl,
    ].join('\n'),
  }

  console.log('[LINE send] sending push to:', userId.slice(0, 8) + '...')

  const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to: userId, messages: [textMessage] }),
  })

  const responseText = await lineRes.text()

  if (!lineRes.ok) {
    console.error('[LINE send] LINE API error:', lineRes.status, responseText)
    return NextResponse.json(
      { error: 'line_api_failed', status: lineRes.status, detail: responseText },
      { status: 500 },
    )
  }

  console.log('[LINE send] success')
  return NextResponse.json({ ok: true })
}
