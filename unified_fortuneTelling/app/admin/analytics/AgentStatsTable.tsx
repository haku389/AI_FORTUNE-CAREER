'use client'

import { useState, useMemo } from 'react'

export type AgentStatsRow = {
  programName: string
  recommendedCount: number
  impressions: number
  clicks: number
  clickRate: number
}

type ColumnKey = keyof Omit<AgentStatsRow, 'programName'>

const COLUMNS: { key: ColumnKey; label: string; format: (r: AgentStatsRow) => string }[] = [
  { key: 'recommendedCount', label: '推薦された回数', format: (r) => `${r.recommendedCount}` },
  { key: 'impressions', label: '表示回数', format: (r) => `${r.impressions}` },
  { key: 'clicks', label: 'クリック数', format: (r) => `${r.clicks}` },
  { key: 'clickRate', label: 'タップ率', format: (r) => `${r.clickRate}%` },
]

export default function AgentStatsTable({ rows }: { rows: AgentStatsRow[] }) {
  const [sortKey, setSortKey] = useState<ColumnKey>('recommendedCount')
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

  if (rows.length === 0) {
    return <div style={{ color: '#7888b8', fontSize: 13, textAlign: 'center', padding: '60px 0' }}>まだデータがありません。</div>
  }

  return (
    <div>
      <div style={{ color: '#5a6a9a', fontSize: 11, marginBottom: 14 }}>
        「表示回数」「クリック数」「タップ率」は新規追加した計測のため、本日以降のデータのみ集計されます（過去分は遡って取得できません）。「推薦された回数」は診断結果に基づき、これまでの全期間で集計しています。
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700 }}>
          <thead>
            <tr>
              <th style={thStyle('left')}>案件名</th>
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
              <tr key={r.programName} style={{ background: i % 2 === 0 ? 'transparent' : '#0d142880' }}>
                <td style={{ ...tdStyle('left'), maxWidth: 320 }}>{r.programName}</td>
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
