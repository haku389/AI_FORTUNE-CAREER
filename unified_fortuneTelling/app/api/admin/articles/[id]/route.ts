import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { resolveArticleStatus } from '@/lib/articleStatus'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabaseAdmin.from('seo_articles').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ article: data })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'invalid body' }, { status: 400 })

  const { title, slug, meta_description, body_md, eyecatch_url, tags, status, scheduled_at } = body

  if (slug !== undefined && !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: 'スラッグは半角英小文字・数字・ハイフンのみで入力してください' },
      { status: 400 }
    )
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (title !== undefined) update.title = title
  if (slug !== undefined) update.slug = slug
  if (meta_description !== undefined) update.meta_description = meta_description
  if (body_md !== undefined) update.body_md = body_md
  if (eyecatch_url !== undefined) update.eyecatch_url = eyecatch_url
  if (tags !== undefined) update.tags = Array.isArray(tags) ? tags : []
  if (status !== undefined) {
    const resolved = resolveArticleStatus(status, scheduled_at)
    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: 400 })
    }
    update.status = resolved.status
    update.scheduled_at = resolved.scheduledAt
    if (resolved.status === 'published') {
      const { data: current } = await supabaseAdmin
        .from('seo_articles')
        .select('published_at')
        .eq('id', id)
        .single()
      if (!current?.published_at) {
        update.published_at = new Date().toISOString()
      }
    }
  }

  const { data, error } = await supabaseAdmin
    .from('seo_articles')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'このスラッグは既に使用されています' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ article: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await supabaseAdmin.from('seo_articles').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
