import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { resolveArticleStatus } from '@/lib/articleStatus'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('seo_articles')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ articles: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'invalid body' }, { status: 400 })

  const { title, slug, meta_description, body_md, eyecatch_url, tags, status, scheduled_at, published_at } = body

  if (typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 })
  }
  if (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: 'スラッグは半角英小文字・数字・ハイフンのみで入力してください' },
      { status: 400 }
    )
  }

  const resolved = resolveArticleStatus(status, scheduled_at, published_at)
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('seo_articles')
    .insert({
      title,
      slug,
      meta_description: meta_description ?? null,
      body_md: body_md ?? '',
      eyecatch_url: eyecatch_url ?? null,
      tags: Array.isArray(tags) ? tags : [],
      status: resolved.status,
      scheduled_at: resolved.scheduledAt,
      published_at: resolved.status === 'published' ? (resolved.publishedAt ?? new Date().toISOString()) : null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'このスラッグは既に使用されています' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ article: data }, { status: 201 })
}
