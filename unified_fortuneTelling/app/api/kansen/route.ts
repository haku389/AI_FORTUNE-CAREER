import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { LUNA_SYSTEM_PROMPT, buildKansenUserPrompt } from '@/lib/luna-knowledge'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nickname, zodiacName, zodiacKeyword, score, timing, typeName } = body

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: LUNA_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildKansenUserPrompt({ nickname, zodiacName, zodiacKeyword, score, timing, typeName }),
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
