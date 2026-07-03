import { supabaseAdmin, type SeoArticle } from '@/lib/supabaseAdmin'
import { getStatsByArticleId, avgDwellSeconds, completionRate, recommendedClickRate } from '@/lib/articleAnalytics'
import AdminHeader from '../AdminHeader'
import AnalyticsTable, { type AnalyticsRow } from './AnalyticsTable'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const [{ data }, statsByArticleId] = await Promise.all([
    supabaseAdmin.from('seo_articles').select('*').order('updated_at', { ascending: false }),
    getStatsByArticleId(),
  ])

  const articles = (data ?? []) as SeoArticle[]

  const rows: AnalyticsRow[] = articles.map((a) => {
    const stats = statsByArticleId[a.id]
    const empty = {
      views: 0,
      scroll25: 0,
      scroll50: 0,
      scroll75: 0,
      scroll100: 0,
      quickClicks: 0,
      detailedClicks: 0,
      dwellTimeTotalSeconds: 0,
      dwellTimeCount: 0,
      recommendedImpressions: 0,
      recommendedClicks: 0,
    }
    const s = stats ?? empty
    return {
      id: a.id,
      title: a.title,
      slug: a.slug,
      status: a.status,
      views: s.views,
      completionRate: completionRate(s),
      avgDwellSeconds: avgDwellSeconds(s),
      quickClicks: s.quickClicks,
      detailedClicks: s.detailedClicks,
      recommendedImpressions: s.recommendedImpressions,
      recommendedClicks: s.recommendedClicks,
      recommendedClickRate: recommendedClickRate(s),
    }
  })

  return (
    <div style={{ minHeight: '100dvh', background: '#070c1a', padding: '32px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <AdminHeader title="アナリティクス" />

      {rows.length === 0 ? (
        <div style={{ color: '#7888b8', fontSize: 13, textAlign: 'center', padding: '60px 0' }}>
          まだ記事がありません。
        </div>
      ) : (
        <>
          <div style={{ color: '#5a6a9a', fontSize: 11, marginBottom: 14 }}>
            列見出しをクリックすると並び替えできます。
          </div>
          <AnalyticsTable rows={rows} />
        </>
      )}
    </div>
  )
}
