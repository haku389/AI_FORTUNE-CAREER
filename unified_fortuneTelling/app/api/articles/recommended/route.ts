import { NextRequest, NextResponse } from 'next/server'
import { getRecommendedArticles } from '@/lib/articleRecommend'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tags = (searchParams.get('tags') ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const articles = await getRecommendedArticles(tags, 3)
  return NextResponse.json({ articles })
}
