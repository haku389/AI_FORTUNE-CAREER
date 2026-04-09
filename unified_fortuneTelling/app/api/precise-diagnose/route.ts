import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function calcAge(birthday: string): number {
  const [y, m, d] = birthday.split('-').map(Number)
  const today = new Date()
  let age = today.getFullYear() - y
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--
  return age
}

async function notifyNotion(payload: Record<string, unknown>) {
  const apiKey = process.env.NOTION_API_KEY
  const dbId  = process.env.NOTION_PRECISE_DB_ID
  if (!apiKey || !dbId) return

  const topJobsText       = payload.top_jobs       ? JSON.stringify(payload.top_jobs,       null, 2) : ''
  const topIndustriesText = payload.top_industries  ? JSON.stringify(payload.top_industries, null, 2) : ''
  const adviceText        = payload.monthly_advice  ? JSON.stringify(payload.monthly_advice, null, 2) : ''
  const agentsText        = payload.recommended_agents ? JSON.stringify(payload.recommended_agents, null, 2) : ''
  const answersText       = payload.answers         ? JSON.stringify(payload.answers) : ''

  const properties: Record<string, unknown> = {
    ニックネーム:   { title:  [{ text: { content: String(payload.nickname ?? '') } }] },
    性別:           { select: { name: String(payload.gender || 'その他') } },
    生年月日:       { date:   { start: String(payload.birthday) } },
    年齢:           { number: Number(payload.age) },
    出生時刻:       { rich_text: [{ text: { content: String(payload.birthtime ?? '') } }] },
    太陽星座:       { select: { name: String(payload.zodiac_sun ?? '') } },
    MBTIタイプ:     { rich_text: [{ text: { content: String(payload.mbti_type ?? '') } }] },
    総合スコア:     { number: Number(payload.score_total  ?? 0) },
    タイミングスコア: { number: Number(payload.score_timing  ?? 0) },
    準備スコア:     { number: Number(payload.score_readiness ?? 0) },
    市場相性スコア: { number: Number(payload.score_market ?? 0) },
    向いている職種: { rich_text: [{ text: { content: topJobsText.slice(0, 2000) } }] },
    向いている業界: { rich_text: [{ text: { content: topIndustriesText.slice(0, 2000) } }] },
    '3ヶ月アドバイス': { rich_text: [{ text: { content: adviceText.slice(0, 2000) } }] },
    推薦エージェント: { rich_text: [{ text: { content: agentsText.slice(0, 2000) } }] },
    鑑定文:         { rich_text: [{ text: { content: String(payload.kansen_text ?? '').slice(0, 2000) } }] },
    回答データ:     { rich_text: [{ text: { content: answersText.slice(0, 2000) } }] },
    決済ID:         { rich_text: [{ text: { content: String(payload.payment_id ?? '') } }] },
    支払い金額:     { number: Number(payload.amount ?? 0) },
  }

  // select型は値が空の場合スキップ（Notionがエラーになるため）
  if (payload.zodiac_moon) {
    properties['月星座'] = { select: { name: String(payload.zodiac_moon) } }
  }
  if (payload.honmei_star) {
    properties['本命星'] = { select: { name: String(payload.honmei_star) } }
  }
  if (payload.payment_id) {
    properties['決済日時'] = { date: { start: new Date().toISOString() } }
  }

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({ parent: { database_id: dbId }, properties }),
  })
  if (!res.ok) {
    const errBody = await res.text()
    console.error('[Notion precise] status:', res.status, errBody)
  }
}

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const body = await request.json()
  const age  = calcAge(body.birthday)

  const { data, error } = await supabase
    .from('precise_diagnoses')
    .insert({
      nickname:           body.nickname,
      gender:             body.gender ?? null,
      birthday:           body.birthday,
      age,
      birthtime:          body.birthtime ?? null,
      zodiac_sun:         body.zodiac_sun,
      zodiac_moon:        body.zodiac_moon ?? null,
      honmei_star:        body.honmei_star ?? null,
      mbti_type:          body.mbti_type ?? null,
      answers:            body.answers,
      score_total:        body.score_total        ?? null,
      score_timing:       body.score_timing       ?? null,
      score_readiness:    body.score_readiness    ?? null,
      score_market:       body.score_market       ?? null,
      top_jobs:           body.top_jobs           ?? null,
      top_industries:     body.top_industries     ?? null,
      monthly_advice:     body.monthly_advice     ?? null,
      kansen_text:        body.kansen_text        ?? null,
      recommended_agents: body.recommended_agents ?? null,
      payment_id:         body.payment_id         ?? null,
      paid_at:            body.payment_id ? new Date().toISOString() : null,
      amount:             body.amount             ?? null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await notifyNotion({ ...body, age }).catch(e =>
    console.error('Notion notify error:', e)
  )

  return NextResponse.json({ id: data.id })
}
