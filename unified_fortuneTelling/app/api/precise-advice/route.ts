import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { LUNA_ADVICE_SYSTEM_PROMPT, buildAdvicePrompt } from '@/lib/luna-knowledge'
import { calcMonthlyAdvice } from '@/lib/monthlyAdvice'
import type { TimingKey } from '@/lib/scoring'

export async function POST(req: NextRequest) {
  const client = new Anthropic()
  const body = await req.json()
  const now = new Date()

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: LUNA_ADVICE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildAdvicePrompt({
            nickname: body.nickname,
            sunSign: body.sunSign,
            moonSign: body.moonSign,
            honmeiStar: body.honmeiStar,
            mbti: body.mbti,
            timing: body.timing,
            startMonth: now.getMonth() + 1,
            startYear: now.getFullYear(),
          }),
        },
      ],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    // JSON部分だけ抽出（コードブロックや前後の説明文を除去）
    const jsonMatch = raw.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('JSON not found in response')

    const advice = JSON.parse(jsonMatch[0])
    return NextResponse.json({ advice })
  } catch (err) {
    console.error('[/api/precise-advice] error:', err)
    // フォールバック: テンプレートで返す
    const fallback = calcMonthlyAdvice((body.timing as TimingKey) ?? 'now')
    return NextResponse.json({ advice: fallback, fallback: true })
  }
}
