import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { marked } from 'marked'
import Stars from '@/components/Stars'
import { supabaseAdmin, type SeoArticle } from '@/lib/supabaseAdmin'
import { publishDueScheduledArticles } from '@/lib/publishScheduled'

export const revalidate = 60

async function getArticle(slug: string): Promise<SeoArticle | null> {
  await publishDueScheduledArticles()

  const { data } = await supabaseAdmin
    .from('seo_articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return (data as SeoArticle) ?? null
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}
  return {
    title: `${article.title} | キャリア未来鑑定士 白石玲子`,
    description: article.meta_description ?? undefined,
    openGraph: article.eyecatch_url
      ? { images: [{ url: article.eyecatch_url }] }
      : undefined,
  }
}

export default async function ColumnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const html = marked.parse(article.body_md, { async: false }) as string

  return (
    <div style={{ background: '#070c1a', color: '#f0f4ff', minHeight: '100dvh', fontFamily: 'var(--font-sans)' }}>
      <Stars />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '56px 24px 80px', position: 'relative', zIndex: 1 }}>
        <Link href="/column" style={{ color: '#a898f8', fontSize: 12, textDecoration: 'none' }}>
          ← コラム一覧
        </Link>

        {article.eyecatch_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.eyecatch_url}
            alt=""
            style={{ width: '100%', aspectRatio: '1200 / 630', objectFit: 'cover', borderRadius: 14, margin: '20px 0' }}
          />
        )}

        <h1
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: 26,
            fontWeight: 900,
            lineHeight: 1.4,
            margin: '16px 0 12px',
          }}
        >
          {article.title}
        </h1>
        <div style={{ color: '#5a6a9a', fontSize: 12, marginBottom: 32 }}>
          {article.published_at ? new Date(article.published_at).toLocaleDateString('ja-JP') : ''}
        </div>

        <div
          className="column-article-body"
          style={{ color: '#dde4f8', fontSize: 15 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div
          style={{
            marginTop: 48,
            padding: '24px 20px',
            background: 'linear-gradient(135deg, #0d1428, #12102a)',
            border: '1px solid #2a3f72',
            borderRadius: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 13, color: '#8898c8', marginBottom: 18, lineHeight: 1.8 }}>
            あなたの転職タイミング、星はどう示しているでしょうか。
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link
              href="/shindan"
              style={{
                display: 'block',
                padding: '15px 0',
                background: 'linear-gradient(135deg, #c8952a, #e0a830)',
                borderRadius: 10,
                color: '#1a0c00',
                fontSize: 14,
                fontWeight: 800,
                textAlign: 'center',
                textDecoration: 'none',
                letterSpacing: 1,
              }}
            >
              ✨ 無料で簡易診断する →
            </Link>
            <Link
              href="/premium"
              style={{
                display: 'block',
                padding: '13px 0',
                background: 'transparent',
                border: '1px solid #4a3f72',
                borderRadius: 10,
                color: '#a898f8',
                fontSize: 13,
                fontWeight: 700,
                textAlign: 'center',
                textDecoration: 'none',
                letterSpacing: 1,
              }}
            >
              💎 精密診断を見る →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
