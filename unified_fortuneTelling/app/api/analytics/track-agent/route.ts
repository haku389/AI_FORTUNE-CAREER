import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const EVENT_TYPES = ['impression', 'click'] as const

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { diagnose_id, program_name, event_type, source } = body ?? {}

  if (typeof program_name !== 'string' || !program_name) {
    return NextResponse.json({ error: 'program_name is required' }, { status: 400 })
  }
  if (!EVENT_TYPES.includes(event_type)) {
    return NextResponse.json({ error: 'invalid event_type' }, { status: 400 })
  }
  if (diagnose_id !== undefined && diagnose_id !== null && typeof diagnose_id !== 'string') {
    return NextResponse.json({ error: 'invalid diagnose_id' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('agent_events').insert({
    diagnose_id: diagnose_id ?? null,
    program_name,
    event_type,
    source: source ?? null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
