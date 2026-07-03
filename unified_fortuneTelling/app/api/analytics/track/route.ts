import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const EVENT_TYPES = ['view', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_100', 'cta_click'] as const
const CTA_TARGETS = ['quick_diagnosis', 'detailed_diagnosis'] as const

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { article_id, event_type, cta_target } = body ?? {}

  if (typeof article_id !== 'string' || !article_id) {
    return NextResponse.json({ error: 'article_id is required' }, { status: 400 })
  }
  if (!EVENT_TYPES.includes(event_type)) {
    return NextResponse.json({ error: 'invalid event_type' }, { status: 400 })
  }
  if (cta_target !== undefined && cta_target !== null && !CTA_TARGETS.includes(cta_target)) {
    return NextResponse.json({ error: 'invalid cta_target' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('article_events').insert({
    article_id,
    event_type,
    cta_target: cta_target ?? null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
