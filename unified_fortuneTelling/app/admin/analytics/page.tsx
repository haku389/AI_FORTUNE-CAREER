import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin, type SeoArticle } from '@/lib/supabaseAdmin'
import { ADMIN_COOKIE_NAME, verifySessionCookie } from '@/lib/adminAuth'
import { getStatsByArticleId, avgDwellSeconds, completionRate, recommendedClickRate } from '@/lib/articleAnalytics'
import { getDiagnosisStats, getAgentStats } from '@/lib/diagnosisAnalytics'
import AdminHeader from '../AdminHeader'
import AnalyticsTabs from './AnalyticsTabs'
import { type AnalyticsRow } from './AnalyticsTable'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const cookieStore = await cookies()
  const authed = await verifySessionCookie(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!authed) {
    redirect('/admin/login')
  }

  const [{ data }, statsByArticleId, diagnosisStats, agentStats] = await Promise.all([
    supabaseAdmin.from('seo_articles').select('*').order('updated_at', { ascending: false }),
    getStatsByArticleId(),
    getDiagnosisStats(),
    getAgentStats(),
  ])

  const articles = (data ?? []) as SeoArticle[]

  const articleRows: AnalyticsRow[] = articles.map((a) => {
    const stats = statsByArticleId[a.id]
    const empty = {
      views: 0, scroll25: 0, scroll50: 0, scroll75: 0, scroll100: 0,
      quickClicks: 0, detailedClicks: 0,
      dwellTimeTotalSeconds: 0, dwellTimeCount: 0,
      recommendedImpressions: 0, recommendedClicks: 0,
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
      <AnalyticsTabs articleRows={articleRows} diagnosisStats={diagnosisStats} agentStats={agentStats} />
    </div>
  )
}
