import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { LUNA_PRECISE_SYSTEM_PROMPT, buildPreciseKansenPrompt } from '@/lib/luna-knowledge'

export async function POST(req: NextRequest) {
  const client = new Anthropic()

  try {
    const body = await req.json()

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: LUNA_PRECISE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildPreciseKansenPrompt(body),
        },
      ],
    })

    const text =
      response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    return NextResponse.json({ text })
  } catch (err) {
    console.error('[/api/kansen] error:', err)
    return NextResponse.json({ text: '' }, { status: 500 })
  }
}
