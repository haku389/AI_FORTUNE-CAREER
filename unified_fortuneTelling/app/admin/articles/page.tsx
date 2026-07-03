import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin, type SeoArticle } from '@/lib/supabaseAdmin'
import { ADMIN_COOKIE_NAME, verifySessionCookie } from '@/lib/adminAuth'
import AdminHeader from '../AdminHeader'
import ArticleListTable, { type ArticleStats } from './ArticleListTable'

export const dynamic = 'force-dynamic'

async function getStatsByArticleId(): Promise<Record<string, ArticleStats>> {
  const { data } = await supabaseAdmin.from('article_events').select('article_id, event_type, cta_target')

  const stats: Record<string, ArticleStats> = {}
  for (const e of data ?? []) {
    const s = (stats[e.article_id] ??= { views: 0, scroll75: 0, scroll100: 0, quickClicks: 0, detailedClicks: 0 })
    if (e.event_type === 'view') s.views++
    else if (e.event_type === 'scroll_75') s.scroll75++
    else if (e.event_type === 'scroll_100') s.scroll100++
    else if (e.event_type === 'cta_click' && e.cta_target === 'quick_diagnosis') s.quickClicks++
    else if (e.event_type === 'cta_click' && e.cta_target === 'detailed_diagnosis') s.detailedClicks++
  }
  return stats
}

export default async function AdminArticlesPage() {
  const cookieStore = await cookies()
  const authed = await verifySessionCookie(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!authed) {
    redirect('/admin/login')
  }

  const [{ data, error }, statsByArticleId] = await Promise.all([
    supabaseAdmin.from('seo_articles').select('*').order('updated_at', { ascending: false }),
    getStatsByArticleId(),
  ])

  const articles = (data ?? []) as SeoArticle[]

  return (
    <div style={{ minHeight: '100dvh', background: '#070c1a', padding: '32px 20px', maxWidth: 860, margin: '0 auto' }}>
      <AdminHeader title="" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Link
          href="/admin/articles/new"
          style={{
            background: 'linear-gradient(135deg, #c8952a, #e0a830)',
            color: '#1a0c00',
            fontSize: 13,
            fontWeight: 700,
            padding: '10px 18px',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          + 新規作成
        </Link>
      </div>

      {error && (
        <div style={{ color: '#ff8080', fontSize: 13, marginBottom: 16 }}>
          読み込みエラー: {error.message}
        </div>
      )}

      {articles.length === 0 ? (
        <div style={{ color: '#7888b8', fontSize: 13, textAlign: 'center', padding: '60px 0' }}>
          まだ記事がありません。
        </div>
      ) : (
        <ArticleListTable articles={articles} statsByArticleId={statsByArticleId} />
      )}
    </div>
  )
}
