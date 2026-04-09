import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function calcAge(birthday: string): number {
  const [y, m, d] = birthday.split('-').map(Number)
  const today = new Date()
  let age = today.getFullYear() - y
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--
  return age
}

const TIMING_LABEL: Record<string, string> = {
  now: '今すぐ',
  '3m': '3ヶ月以内',
  '6m': '半年後',
  wait: 'まだ早い',
}

const CAREER_LABEL: Record<string, string> = {
  career:  'キャリアアップ型',
  env:     '環境改善型',
  calling: '天職探し型',
  stable:  '安定志向型',
}

async function notifyNotion(payload: Record<string, unknown>) {
  const apiKey = process.env.NOTION_API_KEY
  const dbId  = process.env.NOTION_DIAGNOSES_DB_ID
  if (!apiKey || !dbId) return

  const timingLabel  = TIMING_LABEL[String(payload.timing)]  ?? String(payload.timing)
  const careerLabel  = CAREER_LABEL[String(payload.career_type)] ?? String(payload.career_type)

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties: {
        ニックネーム:   { title:  [{ text: { content: String(payload.nickname ?? '') } }] },
        性別:           { select: { name: String(payload.gender || 'その他') } },
        生年月日:       { date:   { start: String(payload.birthday) } },
        年齢:           { number: Number(payload.age) },
        星座:           { select: { name: String(payload.zodiac) } },
        転職タイプ:     { select: { name: careerLabel } },
        転職運スコア:   { number: Number(payload.score) },
        タイミング判定: { select: { name: timingLabel } },
        推薦サービス:   { rich_text: [{ text: { content: String(payload.recommended_service ?? '') } }] },
        鑑定文:         { rich_text: [{ text: { content: String(payload.kansen_text ?? '').slice(0, 2000) } }] },
        診断日:         { date:   { start: String(payload.diagnosed_at) } },
      },
    }),
  })
  if (!res.ok) {
    const errBody = await res.text()
    console.error('[Notion diagnose] status:', res.status, errBody)
  }
}

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body  = await request.json()
  const today = new Date().toISOString().slice(0, 10)
  const age   = calcAge(body.birthday)

  const { data, error } = await supabase
    .from('diagnoses')
    .insert({
      diagnosed_at:        today,
      nickname:            body.nickname,
      gender:              body.gender ?? null,
      birthday:            body.birthday,
      age,
      zodiac:              body.zodiac,
      career_type:         body.career_type,
      score:               body.score,
      timing:              body.timing,
      recommended_service: body.recommended_service ?? null,
      kansen_text:         body.kansen_text ?? null,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ id: null, duplicate: true })
    }
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await notifyNotion({ ...body, age, diagnosed_at: today }).catch(e =>
    console.error('Notion notify error:', e)
  )

  return NextResponse.json({ id: data.id })
}
