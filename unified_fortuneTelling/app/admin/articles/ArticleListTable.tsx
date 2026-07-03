'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'
import type { SeoArticle } from '@/lib/supabaseAdmin'
import type { ArticleAnalyticsStats } from '@/lib/articleAnalytics'
import { isoToDatetimeLocal, datetimeLocalToIso } from '@/lib/dateTimeLocal'
import DateTimePicker from './DateTimePicker'

export type ArticleStats = ArticleAnalyticsStats

const STATUS_LABEL: Record<SeoArticle['status'], string> = {
  draft: '下書き',
  scheduled: '予約中',
  published: '公開中',
}
const STATUS_COLOR: Record<SeoArticle['status'], string> = {
  draft: '#7888b8',
  scheduled: '#a898f8',
  published: '#3cc4a8',
}

function StatusEditor({ article, onSaved }: { article: SeoArticle; onSaved: () => void }) {
  const [status, setStatus] = useState<SeoArticle['status']>(article.status)
  const [scheduledAt, setScheduledAt] = useState(isoToDatetimeLocal(article.scheduled_at))
  const [publishedAt, setPublishedAt] = useState(isoToDatetimeLocal(article.published_at))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const save = async () => {
    if (status === 'scheduled' && !scheduledAt) {
      setMessage('予約投稿には公開日時の指定が必要です')
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          scheduled_at: status === 'scheduled' ? datetimeLocalToIso(scheduledAt) : null,
          published_at: status === 'published' ? datetimeLocalToIso(publishedAt) : null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? '保存に失敗しました')
      setMessage('保存しました')
      onSaved()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px solid #1a2444',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['draft', 'scheduled', 'published'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                border: `1px solid ${status === s ? '#c8952a' : '#2a3f72'}`,
                background: status === s ? '#c8952a22' : 'transparent',
                color: status === s ? '#f0c060' : '#7888b8',
              }}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            border: 'none',
            cursor: saving ? 'default' : 'pointer',
            opacity: saving ? 0.6 : 1,
            background: 'linear-gradient(135deg, #c8952a, #e0a830)',
            color: '#1a0c00',
            flexShrink: 0,
          }}
        >
          {saving ? '保存中…' : '保存'}
        </button>
      </div>

      {status === 'scheduled' && (
        <DateTimePicker value={scheduledAt} onChange={setScheduledAt} placeholder="公開日時を選択…" />
      )}
      {status === 'published' && (
        <DateTimePicker value={publishedAt} onChange={setPublishedAt} placeholder="空欄なら現在時刻" />
      )}

      {message && (
        <span style={{ fontSize: 11, color: message === '保存しました' ? '#3cc4a8' : '#ff8080' }}>{message}</span>
      )}
    </div>
  )
}

function ArticleRow({ article, stats }: { article: SeoArticle; stats: ArticleStats }) {
  const router = useRouter()
  const [editorOpen, setEditorOpen] = useState(false)

  return (
    <div
      style={{
        background: '#0d1428',
        border: '1px solid #2a3f72',
        borderRadius: 10,
        padding: '14px 16px',
      }}
    >
      <Link
        href={`/admin/articles/${article.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          textDecoration: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {article.eyecatch_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.eyecatch_url}
              alt=""
              style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#f0f4ff', fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {article.title}
            </div>
            <div style={{ color: '#5a6a9a', fontSize: 11 }}>
              /column/{article.slug} ・ 更新: {new Date(article.updated_at).toLocaleString('ja-JP')}
              {article.status === 'scheduled' && article.scheduled_at && ` ・ 公開予定: ${new Date(article.scheduled_at).toLocaleString('ja-JP')}`}
              {article.tags.length > 0 && ` ・ ${article.tags.join(', ')}`}
            </div>
          </div>
        </div>
        <span
          style={{
            flexShrink: 0,
            fontSize: 10,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 4,
            letterSpacing: 1,
            background: `${STATUS_COLOR[article.status]}22`,
            color: STATUS_COLOR[article.status],
            border: `1px solid ${STATUS_COLOR[article.status]}55`,
          }}
        >
          {STATUS_LABEL[article.status]}
        </span>
      </Link>

      <div style={{ marginTop: 8, fontSize: 11, color: '#7888b8', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Eye size={13} strokeWidth={2} /> {stats.views}回表示
        </span>
        <span>・</span>
        <span>最後まで読了 {stats.scroll100}件（75%到達 {stats.scroll75}件）</span>
        <span>・</span>
        <span>簡易診断へ {stats.quickClicks} / 精密診断へ {stats.detailedClicks}</span>
        <button
          type="button"
          onClick={() => setEditorOpen((v) => !v)}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: '#a898f8',
            fontSize: 11,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {editorOpen ? '閉じる ▲' : '日時・公開設定を変更 ▼'}
        </button>
      </div>

      {editorOpen && (
        <StatusEditor
          article={article}
          onSaved={() => {
            setEditorOpen(false)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

export default function ArticleListTable({
  articles,
  statsByArticleId,
}: {
  articles: SeoArticle[]
  statsByArticleId: Record<string, ArticleStats>
}) {
  const emptyStats: ArticleStats = {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {articles.map((a) => (
        <ArticleRow key={a.id} article={a} stats={statsByArticleId[a.id] ?? emptyStats} />
      ))}
    </div>
  )
}
