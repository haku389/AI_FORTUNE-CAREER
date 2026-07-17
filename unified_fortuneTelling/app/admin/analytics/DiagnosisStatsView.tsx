import type { DiagnosisStats } from '@/lib/diagnosisLabels'
import { MBTI_LABELS, TIMING_LABELS } from '@/lib/diagnosisLabels'

const cardStyle: React.CSSProperties = {
  background: '#0d1428',
  border: '1px solid #2a3f72',
  borderRadius: 12,
  padding: '18px 20px',
  marginBottom: 16,
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff', marginBottom: 14 }}>{children}</div>
}

function BarRow({ label, count, max, color = '#a898f8' }: { label: string; count: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#dde4f8', marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ color: '#7888b8' }}>{count}件</span>
      </div>
      <div style={{ height: 8, background: '#0a0f1e', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.max(pct, count > 0 ? 2 : 0)}%`, background: color, borderRadius: 4 }} />
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ ...cardStyle, marginBottom: 0, flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: '#7888b8', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#f0c060', fontFamily: 'var(--font-mincho)' }}>{value}</div>
    </div>
  )
}

export default function DiagnosisStatsView({ stats }: { stats: DiagnosisStats }) {
  if (stats.total === 0) {
    return <div style={{ color: '#7888b8', fontSize: 13, textAlign: 'center', padding: '60px 0' }}>まだ精密診断のデータがありません。</div>
  }

  const maxScoreBucket = Math.max(...stats.scoreBuckets.map((b) => b.count), 1)
  const maxMbti = Math.max(...Object.values(stats.mbti), 1)
  const maxJob = Math.max(...stats.topJobs.map((j) => j.count), 1)
  const maxIndustry = Math.max(...stats.topIndustries.map((i) => i.count), 1)
  const maxTiming = Math.max(...Object.values(stats.timing), 1)
  const maxZodiac = Math.max(...stats.zodiacSun.map((z) => z.count), 1)
  const maxDaily = Math.max(...stats.dailyCounts.map((d) => d.count), 1)

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <SummaryCard label="精密診断 総件数" value={`${stats.total}件`} />
        <SummaryCard label="平均転職スコア" value={stats.avgScore !== null ? `${stats.avgScore}点` : '-'} />
      </div>

      {/* 優先度高: 転職スコア分布 */}
      <div style={cardStyle}>
        <SectionTitle>✦ 転職スコアの分布</SectionTitle>
        {stats.scoreBuckets.map((b) => (
          <BarRow key={b.range} label={b.range} count={b.count} max={maxScoreBucket} color="#f0c060" />
        ))}
      </div>

      {/* 優先度高: MBTIタイプ内訳 */}
      <div style={cardStyle}>
        <SectionTitle>✦ MBTIタイプの内訳</SectionTitle>
        {Object.entries(stats.mbti)
          .sort((a, b) => b[1] - a[1])
          .map(([key, count]) => (
            <BarRow key={key} label={MBTI_LABELS[key] ?? key} count={count} max={maxMbti} color="#a898f8" />
          ))}
      </div>

      {/* 優先度高: 向いている職種TOP */}
      <div style={cardStyle}>
        <SectionTitle>✦ 向いている職種 TOP{stats.topJobs.length}</SectionTitle>
        {stats.topJobs.length === 0 ? (
          <div style={{ color: '#7888b8', fontSize: 12 }}>データがありません。</div>
        ) : (
          stats.topJobs.map((j) => (
            <BarRow key={j.job} label={j.job} count={j.count} max={maxJob} color="#3cc4a8" />
          ))
        )}
      </div>

      {/* 深掘り: タイミング内訳 */}
      <div style={cardStyle}>
        <SectionTitle>転職タイミングの内訳</SectionTitle>
        {(Object.entries(stats.timing) as [keyof typeof TIMING_LABELS, number][]).map(([key, count]) => (
          <BarRow key={key} label={TIMING_LABELS[key]} count={count} max={maxTiming} color="#ffa040" />
        ))}
      </div>

      {/* 深掘り: 向いている業界TOP */}
      <div style={cardStyle}>
        <SectionTitle>向いている業界 TOP{stats.topIndustries.length}</SectionTitle>
        {stats.topIndustries.length === 0 ? (
          <div style={{ color: '#7888b8', fontSize: 12 }}>データがありません。</div>
        ) : (
          stats.topIndustries.map((i) => (
            <BarRow key={i.name} label={i.name} count={i.count} max={maxIndustry} color="#f0c060" />
          ))
        )}
      </div>

      {/* 深掘り: 太陽星座内訳 */}
      <div style={cardStyle}>
        <SectionTitle>太陽星座の内訳</SectionTitle>
        {stats.zodiacSun.map((z) => (
          <BarRow key={z.name} label={z.name} count={z.count} max={maxZodiac} color="#dde4f8" />
        ))}
      </div>

      {/* 深掘り: 日別診断数の推移 */}
      <div style={cardStyle}>
        <SectionTitle>日別 診断数の推移（直近{stats.dailyCounts.length}日）</SectionTitle>
        {stats.dailyCounts.length === 0 ? (
          <div style={{ color: '#7888b8', fontSize: 12 }}>データがありません。</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100 }}>
            {stats.dailyCounts.map((d) => (
              <div key={d.date} style={{ flex: 1, textAlign: 'center' }} title={`${d.date}: ${d.count}件`}>
                <div
                  style={{
                    height: `${Math.max((d.count / maxDaily) * 80, d.count > 0 ? 4 : 0)}px`,
                    background: '#a898f8',
                    borderRadius: 2,
                    marginBottom: 4,
                  }}
                />
                <div style={{ fontSize: 8, color: '#5a6a9a' }}>{d.date.slice(5)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
