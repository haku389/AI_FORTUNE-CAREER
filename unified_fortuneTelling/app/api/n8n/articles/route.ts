import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { verifyN8nApiKey } from '@/lib/n8nAuth'
import { ALL_TAG_VALUES } from '@/lib/articleTags'
import { resolveArticleStatus } from '@/lib/articleStatus'

export async function POST(req: NextRequest) {
  if (!verifyN8nApiKey(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'invalid body' }, { status: 400 })

  const { title, meta_description, body_md, eyecatch_url, status, scheduled_at } = body
  let slug = body.slug

  if (typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json({ error: 'タイトル（title）は必須です' }, { status: 400 })
  }
  if (typeof body_md !== 'string' || body_md.trim() === '') {
    return NextResponse.json({ error: '本文（body_md）は必須です' }, { status: 400 })
  }

  // スラッグが未指定/不正な場合は自動採番（半角英小文字・数字・ハイフンのみ）
  if (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
    slug = `article-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  }

  const requestedTags: string[] = Array.isArray(body.tags) ? body.tags : []
  const tags = requestedTags.filter((t) => ALL_TAG_VALUES.includes(t))
  const droppedTags = requestedTags.filter((t) => !ALL_TAG_VALUES.includes(t))

  const resolved = resolveArticleStatus(status, scheduled_at)
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('seo_articles')
    .insert({
      title,
      slug,
      meta_description: meta_description ?? null,
      body_md,
      eyecatch_url: eyecatch_url ?? null,
      tags,
      status: resolved.status,
      scheduled_at: resolved.scheduledAt,
      published_at: resolved.status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'このスラッグは既に使用されています' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ article: data, droppedTags }, { status: 201 })
}
