import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const body = await request.json()

  const { data, error } = await supabase
    .from('precise_diagnoses')
    .insert({
      nickname:           body.nickname,
      birthday:           body.birthday,
      birthtime:          body.birthtime ?? null,
      zodiac_sun:         body.zodiac_sun,
      zodiac_moon:        body.zodiac_moon ?? null,
      honmei_star:        body.honmei_star ?? null,
      mbti_type:          body.mbti_type ?? null,
      answers:            body.answers,
      score_total:        body.score_total ?? null,
      score_timing:       body.score_timing ?? null,
      score_readiness:    body.score_readiness ?? null,
      score_market:       body.score_market ?? null,
      top_jobs:           body.top_jobs ?? null,
      top_industries:     body.top_industries ?? null,
      monthly_advice:     body.monthly_advice ?? null,
      kansen_text:        body.kansen_text ?? null,
      recommended_agents: body.recommended_agents ?? null,
      payment_id:         body.payment_id ?? null,
      paid_at:            body.payment_id ? new Date().toISOString() : null,
      amount:             body.amount ?? null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}
