import Link from 'next/link'
import type { Metadata } from 'next'
import Stars from '@/components/Stars'
import PolicyFooter from '@/components/PolicyFooter'
import { supabaseAdmin, type SeoArticle } from '@/lib/supabaseAdmin'
import { publishDueScheduledArticles } from '@/lib/publishScheduled'

export const metadata: Metadata = {
  title: 'コラム | キャリア未来鑑定士 白石玲子',
  description: '転職・キャリア・占いにまつわるお役立ち記事一覧。',
}

export const revalidate = 60

export default async function ColumnIndexPage() {
  await publishDueScheduledArticles()

  const { data } = await supabaseAdmin
    .from('seo_articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const articles = (data ?? []) as SeoArticle[]

  return (
    <div style={{ background: '#070c1a', color: '#f0f4ff', minHeight: '100dvh', fontFamily: 'var(--font-sans)' }}>
      <Stars />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '56px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: '#c8952a', marginBottom: 14 }}>✦ COLUMN</div>
        <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 28, fontWeight: 900, marginBottom: 32 }}>
          コラム
        </h1>

        {articles.length === 0 ? (
          <p style={{ color: '#7888b8', fontSize: 13 }}>まだ記事がありません。</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/column/${a.slug}`}
                style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #0d1428, #12102a)',
                  border: '1px solid #2a3f72',
                  borderRadius: 14,
                  overflow: 'hidden',
                  textDecoration: 'none',
                }}
              >
                {a.eyecatch_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.eyecatch_url}
                    alt=""
                    style={{ width: '100%', aspectRatio: '1200 / 630', objectFit: 'cover', display: 'block' }}
                  />
                )}
                <div style={{ padding: '20px 18px' }}>
                  <div style={{ color: '#5a6a9a', fontSize: 11, marginBottom: 6 }}>
                    {a.published_at ? new Date(a.published_at).toLocaleDateString('ja-JP') : ''}
                  </div>
                  <div style={{ color: '#f0f4ff', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{a.title}</div>
                  {a.meta_description && (
                    <div style={{ color: '#8898c8', fontSize: 13, lineHeight: 1.7 }}>{a.meta_description}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <PolicyFooter />
    </div>
  )
}
