import { supabaseAdmin } from './supabaseAdmin'

export type ArticleAnalyticsStats = {
  views: number
  scroll25: number
  scroll50: number
  scroll75: number
  scroll100: number
  quickClicks: number
  detailedClicks: number
  dwellTimeTotalSeconds: number
  dwellTimeCount: number
  recommendedImpressions: number
  recommendedClicks: number
}

function emptyStats(): ArticleAnalyticsStats {
  return {
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
}

export async function getStatsByArticleId(): Promise<Record<string, ArticleAnalyticsStats>> {
  const { data } = await supabaseAdmin.from('article_events').select('article_id, event_type, cta_target, value')

  const stats: Record<string, ArticleAnalyticsStats> = {}
  for (const e of data ?? []) {
    const s = (stats[e.article_id] ??= emptyStats())
    switch (e.event_type) {
      case 'view':
        s.views++
        break
      case 'scroll_25':
        s.scroll25++
        break
      case 'scroll_50':
        s.scroll50++
        break
      case 'scroll_75':
        s.scroll75++
        break
      case 'scroll_100':
        s.scroll100++
        break
      case 'cta_click':
        if (e.cta_target === 'quick_diagnosis') s.quickClicks++
        else if (e.cta_target === 'detailed_diagnosis') s.detailedClicks++
        break
      case 'dwell_time':
        if (typeof e.value === 'number') {
          s.dwellTimeTotalSeconds += e.value
          s.dwellTimeCount++
        }
        break
      case 'recommended_impression':
        s.recommendedImpressions++
        break
      case 'recommended_click':
        s.recommendedClicks++
        break
    }
  }
  return stats
}

export function avgDwellSeconds(s: ArticleAnalyticsStats): number {
  return s.dwellTimeCount > 0 ? Math.round(s.dwellTimeTotalSeconds / s.dwellTimeCount) : 0
}

export function completionRate(s: ArticleAnalyticsStats): number {
  return s.views > 0 ? Math.round((s.scroll100 / s.views) * 100) : 0
}

export function recommendedClickRate(s: ArticleAnalyticsStats): number {
  return s.recommendedImpressions > 0 ? Math.round((s.recommendedClicks / s.recommendedImpressions) * 100) : 0
}
