import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const TIMING_LABELS: Record<string, string> = {
  now: '今すぐ動き時 🔥',
  '3m': '3ヶ月以内に行動 ✨',
  '6m': '半年後が本番 🌿',
  wait: 'じっくり充電期 💧',
}

/** Channel ID + Secret から短期アクセストークンを取得 */
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

/** LINE push メッセージを1件送信 */
async function pushMessage(token: string, userId: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: 'text', text }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return { ok: false, error: `${res.status}: ${err}` }
  }
  return { ok: true }
}

/** ユーザーデータからパーソナライズメッセージを生成 */
function buildMessage(row: {
  nickname: string
  score_total: number | null
  score_timing: number | null
  zodiac_sun: string | null
  zodiac_moon: string | null
  honmei_star: string | null
  mbti_type: string | null
  top_jobs: { job: string }[] | null
  id: string
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://career-uranai.site'
  const resultUrl = `${baseUrl}/premium/result/${row.id}`

  const score = row.score_total ?? 0
  const topJob = row.top_jobs?.[0]?.job ?? '未分析'
  const sun = row.zodiac_sun ?? '不明'
  const moon = row.zodiac_moon ? `・月星座：${row.zodiac_moon}` : ''

  // スコアに応じたメッセージトーン
  let timingMsg = '🌙 今は力を蓄えるとき。'
  if (score >= 80) timingMsg = '🔥 今がチャンス！転職の星が強く輝いています。'
  else if (score >= 65) timingMsg = '✨ 転職への準備が整いつつあります。'
  else if (score >= 52) timingMsg = '🌿 少しずつ準備を進めましょう。'

  return [
    `こんにちは、${row.nickname}さん ✨`,
    '',
    `今週の転職運をお届けします。`,
    '',
    `【あなたの星】`,
    `☀️ 太陽星座：${sun}${moon}`,
    ...(row.mbti_type ? [`🧠 MBTI：${row.mbti_type}`] : []),
    '',
    timingMsg,
    '',
    `📊 転職スコア：${score}点`,
    `💼 向いている職種：${topJob}`,
    '',
    `🔮 詳しい鑑定結果はこちら👇`,
    resultUrl,
  ].join('\n')
}

export async function POST(req: NextRequest) {
  // Cron認証チェック（Vercel Cron はヘッダーで検証）
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // line_user_id がある最新診断を各ユーザーごとに1件取得
  const { data: rows, error } = await supabase
    .from('precise_diagnoses')
    .select('id, nickname, line_user_id, score_total, score_timing, zodiac_sun, zodiac_moon, honmei_star, mbti_type, top_jobs')
    .not('line_user_id', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[broadcast] Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json({ sent: 0, message: 'no users with LINE connected' })
  }

  // 同一 line_user_id は最新1件のみ（重複排除）
  const seen = new Set<string>()
  const targets = rows.filter(r => {
    if (!r.line_user_id || seen.has(r.line_user_id)) return false
    seen.add(r.line_user_id)
    return true
  })

  let token: string
  try {
    token = await getChannelAccessToken()
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[broadcast] token error:', msg)
    return NextResponse.json({ error: 'token_failed', detail: msg }, { status: 500 })
  }

  let sentCount = 0
  const errors: string[] = []

  for (const row of targets) {
    const text = buildMessage(row)
    const result = await pushMessage(token, row.line_user_id!, text)
    if (result.ok) {
      sentCount++
    } else {
      errors.push(`${row.line_user_id?.slice(0, 8)}...: ${result.error}`)
      console.error('[broadcast] push failed for', row.line_user_id?.slice(0, 8), result.error)
    }
  }

  console.log(`[broadcast] done: sent=${sentCount}, errors=${errors.length}`)
  return NextResponse.json({
    sent: sentCount,
    total: targets.length,
    errors: errors.length > 0 ? errors : undefined,
  })
}

// Vercel Cron からの GET リクエストにも対応
export async function GET(req: NextRequest) {
  return POST(req)
}
