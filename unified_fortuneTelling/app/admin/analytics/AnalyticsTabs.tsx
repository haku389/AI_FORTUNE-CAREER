'use client'

import { useState } from 'react'
import AnalyticsTable, { type AnalyticsRow } from './AnalyticsTable'
import DiagnosisStatsView from './DiagnosisStatsView'
import AgentStatsTable, { type AgentStatsRow } from './AgentStatsTable'
import type { DiagnosisStats } from '@/lib/diagnosisLabels'

type Tab = 'article' | 'diagnosis' | 'agent'

const TABS: { key: Tab; label: string }[] = [
  { key: 'article', label: '記事' },
  { key: 'diagnosis', label: '診断結果' },
  { key: 'agent', label: 'エージェント' },
]

export default function AnalyticsTabs({
  articleRows,
  diagnosisStats,
  agentStats,
}: {
  articleRows: AnalyticsRow[]
  diagnosisStats: DiagnosisStats
  agentStats: AgentStatsRow[]
}) {
  const [tab, setTab] = useState<Tab>('article')

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid #1a2444' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.key ? '2px solid #f0c060' : '2px solid transparent',
              color: tab === t.key ? '#f0f4ff' : '#7888b8',
              fontSize: 13,
              fontWeight: tab === t.key ? 700 : 400,
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'article' && (
        articleRows.length === 0 ? (
          <div style={{ color: '#7888b8', fontSize: 13, textAlign: 'center', padding: '60px 0' }}>まだ記事がありません。</div>
        ) : (
          <>
            <div style={{ color: '#5a6a9a', fontSize: 11, marginBottom: 14 }}>列見出しをクリックすると並び替えできます。</div>
            <AnalyticsTable rows={articleRows} />
          </>
        )
      )}

      {tab === 'diagnosis' && <DiagnosisStatsView stats={diagnosisStats} />}

      {tab === 'agent' && <AgentStatsTable rows={agentStats} />}
    </div>
  )
}
