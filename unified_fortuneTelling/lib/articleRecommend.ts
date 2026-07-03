import { supabaseAdmin, type SeoArticle } from './supabaseAdmin'

export type ArticlePreview = {
  id: string
  title: string
  slug: string
  meta_description: string | null
  eyecatch_url: string | null
  /**
   * 診断結果のタグと記事タグの一致度（0〜100）。
   *
   * 【作成方法】 一致したタグ数 ÷ 診断結果側のタグ数 × 100 を四捨五入。
   * 例: 診断結果のタグが5個（牡羊座・キャリアアップ型・NT・30代前半・now）のうち、
   * 記事に「牡羊座」「NT」の2個が含まれていれば 2/5 = 40%。
   * 一致タグが0個の記事も「最新の公開記事」としてフォールバック表示されるため、その場合は 0%。
   *
   * 【現状の使い道】 取得はしているが、UI（RecommendedArticles）では表示していない。
   * 将来「おすすめ度 40%」のようなバッジを出したくなったら、
   * components/result/RecommendedArticles.tsx 内で article.matchPercent を使って表示すればよい。
   * 並び替え自体は既にこの値（一致タグ数）の降順で行われている。
   */
  matchPercent: number
}

function toPreview(a: SeoArticle, matchPercent: number): ArticlePreview {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    meta_description: a.meta_description,
    eyecatch_url: a.eyecatch_url,
    matchPercent,
  }
}

// レコメンド計算の母数として読み込む公開記事の上限。
// 記事数がこれを大きく超える規模になったら、SQL側での絞り込みに切り替える。
const CANDIDATE_LIMIT = 200

/**
 * タグに最も近い公開記事を返す（完全一致を要求しない）。
 *
 * 公開記事を新着順に最大 CANDIDATE_LIMIT 件取得し、それぞれについて
 * 診断結果タグとの一致数でスコアリングして並べ替える。一致が1つもない記事も
 * 候補に残るため、タグが何も一致しない場合は「最新の公開記事」が自然にフォールバックとして返る。
 */
export async function getRecommendedArticles(tags: string[], limit = 3): Promise<ArticlePreview[]> {
  const { data } = await supabaseAdmin
    .from('seo_articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(CANDIDATE_LIMIT)

  const articles = (data ?? []) as SeoArticle[]
  if (articles.length === 0) return []

  const scored = articles.map((article) => {
    const overlapCount = article.tags.filter((t) => tags.includes(t)).length
    const matchPercent = tags.length > 0 ? Math.round((overlapCount / tags.length) * 100) : 0
    return { article, overlapCount, matchPercent }
  })

  scored.sort((a, b) => {
    if (b.overlapCount !== a.overlapCount) return b.overlapCount - a.overlapCount
    const aTime = a.article.published_at ? new Date(a.article.published_at).getTime() : 0
    const bTime = b.article.published_at ? new Date(b.article.published_at).getTime() : 0
    return bTime - aTime
  })

  return scored.slice(0, limit).map(({ article, matchPercent }) => toPreview(article, matchPercent))
}
