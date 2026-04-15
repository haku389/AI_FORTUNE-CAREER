import { NextRequest, NextResponse } from 'next/server'

const TIMING_LABELS: Record<string, string> = {
  now: '今すぐ動き時 🔥',
  '3m': '3ヶ月以内に行動 ✨',
  '6m': '半年後が本番 🌿',
  wait: 'じっくり充電期 💧',
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

  const token = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN!
  if (!token || !userId) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 })
  }

  const timingLabel = TIMING_LABELS[timing] ?? timing

  const message = {
    type: 'flex',
    altText: `${nickname}さんの転職精密鑑定が完了しました ✨`,
    contents: {
      type: 'bubble',
      size: 'kilo',
      header: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '18px',
        backgroundColor: '#070c1a',
        contents: [
          {
            type: 'text',
            text: '転職占い師◇ルナ',
            size: 'xs',
            color: '#a898f8',
            weight: 'bold',
          },
          {
            type: 'text',
            text: '精密鑑定が完了しました',
            size: 'md',
            color: '#f0f4ff',
            weight: 'bold',
            margin: 'sm',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '18px',
        backgroundColor: '#0d1428',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            paddingBottom: '10px',
            contents: [
              { type: 'text', text: '転職スコア', size: 'sm', color: '#7888b8', flex: 1 },
              {
                type: 'text',
                text: `${score}点`,
                size: 'sm',
                color: '#f0c060',
                weight: 'bold',
                align: 'end',
              },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            paddingBottom: '14px',
            contents: [
              { type: 'text', text: 'タイミング', size: 'sm', color: '#7888b8', flex: 1 },
              {
                type: 'text',
                text: timingLabel,
                size: 'sm',
                color: '#c8952a',
                weight: 'bold',
                align: 'end',
              },
            ],
          },
          {
            type: 'text',
            text: 'いつでもボタンから鑑定結果を確認できます。',
            size: 'xs',
            color: '#7888b8',
            wrap: true,
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '12px',
        backgroundColor: '#0d1428',
        contents: [
          {
            type: 'button',
            action: { type: 'uri', label: '鑑定結果を見る ✨', uri: resultUrl },
            style: 'primary',
            color: '#7c6bdc',
            height: 'sm',
          },
        ],
      },
    },
  }

  const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to: userId, messages: [message] }),
  })

  if (!lineRes.ok) {
    const errText = await lineRes.text()
    console.error('[LINE send] error:', lineRes.status, errText)
    return NextResponse.json({ error: 'send failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
