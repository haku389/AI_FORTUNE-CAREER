export type ArticleStatus = 'draft' | 'scheduled' | 'published'

export type ResolvedStatus =
  | { ok: true; status: ArticleStatus; scheduledAt: string | null; publishedAt: string | null }
  | { ok: false; error: string }

/**
 * リクエストボディの status / scheduled_at / published_at を検証し、DBに書き込む値を確定する。
 * status が 'scheduled' 以外・未指定の場合は寛容に 'draft' として扱う（新規作成時の省略を許すため）。
 * status === 'scheduled' のときのみ scheduled_at を厳密に検証する。
 * status === 'published' のとき、published_at が明示的に渡されればそれを使う（過去日時での指定=バックデートも許可）。
 * 渡されなければ呼び出し側で現在時刻をデフォルトにする（publishedAt: null を返す）。
 */
export function resolveArticleStatus(
  status: unknown,
  scheduledAtRaw: unknown,
  publishedAtRaw?: unknown
): ResolvedStatus {
  if (status === 'scheduled') {
    if (typeof scheduledAtRaw !== 'string' || scheduledAtRaw.trim() === '') {
      return { ok: false, error: '予約投稿には公開日時の指定が必要です' }
    }
    const date = new Date(scheduledAtRaw)
    if (Number.isNaN(date.getTime())) {
      return { ok: false, error: '公開日時の形式が正しくありません' }
    }
    return { ok: true, status: 'scheduled', scheduledAt: date.toISOString(), publishedAt: null }
  }
  if (status === 'published') {
    let publishedAt: string | null = null
    if (typeof publishedAtRaw === 'string' && publishedAtRaw.trim() !== '') {
      const date = new Date(publishedAtRaw)
      if (Number.isNaN(date.getTime())) {
        return { ok: false, error: '公開日時の形式が正しくありません' }
      }
      publishedAt = date.toISOString()
    }
    return { ok: true, status: 'published', scheduledAt: null, publishedAt }
  }
  return { ok: true, status: 'draft', scheduledAt: null, publishedAt: null }
}
