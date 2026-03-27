import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await request.json()

  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  const { data, error } = await supabase
    .from('diagnoses')
    .insert({
      diagnosed_at: today,
      nickname: body.nickname,
      birthday: body.birthday,
      zodiac: body.zodiac,
      career_type: body.career_type,
      score: body.score,
      timing: body.timing,
      recommended_service: body.recommended_service ?? null,
      kansen_text: body.kansen_text ?? null,
    })
    .select('id')
    .single()

  if (error) {
    // UNIQUE制約違反（1日1回）は正常ケースとして200を返す
    if (error.code === '23505') {
      return NextResponse.json({ id: null, duplicate: true })
    }
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}
