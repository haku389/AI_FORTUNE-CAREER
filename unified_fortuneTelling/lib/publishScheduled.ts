import { supabaseAdmin } from './supabaseAdmin'

/**
 * 公開予定時刻（scheduled_at）を過ぎた予約投稿記事を公開状態に切り替える。
 *
 * 呼び出し元は2系統:
 * 1. Vercel Cron（/api/cron/publish-scheduled）— 定期実行。プランによって最短間隔が制限される
 *    （Hobbyプランは1日1回まで）ため、これだけには依存しない設計にしている。
 * 2. /column, /column/[slug] へのアクセス時 — 誰かがサイトを訪れるたびに「ついでに」実行する
 *    フォールバック。cronの実行間隔に関係なく、訪問が発生すれば公開予定時刻からほぼ遅延なく反映される。
 *
 * published_at は各記事本来の scheduled_at ではなく、実際にこの処理が実行された時刻を使う
 * （複数行をまとめて更新するため列単位での個別値の書き込みができない。ずれは cron間隔 or
 * 次の訪問までの時間に限られ、通常は数分〜十数分程度）。
 */
export async function publishDueScheduledArticles(): Promise<{ publishedSlugs: string[] }> {
  const { data, error } = await supabaseAdmin
    .from('seo_articles')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString())
    .select('slug')

  if (error) {
    console.error('[publishDueScheduledArticles] failed:', error)
    return { publishedSlugs: [] }
  }

  return { publishedSlugs: (data ?? []).map((a) => a.slug as string) }
}
