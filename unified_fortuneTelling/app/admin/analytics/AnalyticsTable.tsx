'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

export type AnalyticsRow = {
  id: string
  title: string
  slug: string
  status: 'draft' | 'scheduled' | 'published'
  views: number
  completionRate: number
  avgDwellSeconds: number
  quickClicks: number
  detailedClicks: number
  recommendedImpressions: number
  recommendedClicks: number
  recommendedClickRate: number
}

type ColumnKey = keyof Omit<AnalyticsRow, 'id' | 'title' | 'slug' | 'status'>

const COLUMNS: { key: ColumnKey; label: string; format: (r: AnalyticsRow) => string }[] = [
  { key: 'views', label: '表示回数', format: (r) => `${r.views}` },
  { key: 'completionRate', label: '完読率', format: (r) => `${r.completionRate}%` },
  { key: 'avgDwellSeconds', label: '平均滞在時間', format: (r) => formatSeconds(r.avgDwellSeconds) },
  { key: 'quickClicks', label: '簡易診断へ', format: (r) => `${r.quickClicks}` },
  { key: 'detailedClicks', label: '精密診断へ', format: (r) => `${r.detailedClicks}` },
  { key: 'recommendedImpressions', label: 'おすすめ表示', format: (r) => `${r.recommendedImpressions}` },
  { key: 'recommendedClickRate', label: 'おすすめ→記事率', format: (r) => `${r.recommendedClickRate}%（${r.recommendedClicks}件）` },
]

function formatSeconds(sec: number): string {
  if (sec <= 0) return '-'
  if (sec < 60) return `${sec}秒`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s > 0 ? `${m}分${s}秒` : `${m}分`
}

export default function AnalyticsTable({ rows }: { rows: AnalyticsRow[] }) {
  const [sortKey, setSortKey] = useState<ColumnKey>('views')
  const [sortDesc, setSortDesc] = useState(true)

  const sorted = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => (sortDesc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]))
    return copy
  }, [rows, sortKey, sortDesc])

  const toggleSort = (key: ColumnKey) => {
    if (key === sortKey) {
      setSortDesc((v) => !v)
    } else {
      setSortKey(key)
      setSortDesc(true)
    }
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 900 }}>
        <thead>
          <tr>
            <th style={thStyle('left')}>記事</th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => toggleSort(col.key)}
                style={{ ...thStyle('right'), cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
              >
                {col.label}
                {sortKey === col.key && <span style={{ color: '#f0c060', marginLeft: 4 }}>{sortDesc ? '▼' : '▲'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : '#0d142880' }}>
              <td style={tdStyle('left')}>
                <Link
                  href={`/admin/articles/${r.id}`}
                  style={{
                    color: '#f0f4ff',
                    textDecoration: 'none',
                    fontWeight: 700,
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    maxWidth: 280,
                  }}
                >
                  {r.title}
                </Link>
                {r.status !== 'published' && (
                  <span style={{ marginLeft: 6, fontSize: 10, color: '#7888b8' }}>
                    ({r.status === 'draft' ? '下書き' : '予約中'})
                  </span>
                )}
              </td>
              {COLUMNS.map((col) => (
                <td key={col.key} style={tdStyle('right')}>
                  {col.format(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function thStyle(align: 'left' | 'right'): React.CSSProperties {
  return {
    textAlign: align,
    padding: '10px 12px',
    borderBottom: '1px solid #2a3f72',
    color: '#7888b8',
    fontWeight: 700,
    fontSize: 11,
  }
}
function tdStyle(align: 'left' | 'right'): React.CSSProperties {
  return {
    textAlign: align,
    padding: '10px 12px',
    borderBottom: '1px solid #1a2444',
    color: '#dde4f8',
  }
}
