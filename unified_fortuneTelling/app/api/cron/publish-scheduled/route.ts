import { NextRequest, NextResponse } from 'next/server'
import { publishDueScheduledArticles } from '@/lib/publishScheduled'

// Vercel Cronから定期的に叩かれるエンドポイント。CRON_SECRETを設定している場合、
// VercelはCronリクエストに自動で `Authorization: Bearer <CRON_SECRET>` を付与する。
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  const { publishedSlugs } = await publishDueScheduledArticles()
  return NextResponse.json({ ok: true, publishedCount: publishedSlugs.length, publishedSlugs })
}
