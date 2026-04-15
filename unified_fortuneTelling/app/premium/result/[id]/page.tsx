import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '鑑定結果 | 転職占い師ルナ',
  description: 'ルナによる精密転職鑑定の結果ページ',
}

type MonthAdvice = {
  month: string
  label: string
  emoji: string
  advice: string
  highlight: boolean
}

type TopJob = {
  job: string
  score: number
  reason: string
}

type DiagnoseRow = {
  id: string
  nickname: string
  zodiac_sun: string
  zodiac_moon: string | null
  honmei_star: string | null
  mbti_type: string | null
  score_total: number
  score_timing: number
  score_readiness: number
  score_market: number
  kansen_text: string | null
  monthly_advice: MonthAdvice[] | null
  top_jobs: TopJob[] | null
  created_at: string
}

const TIMING_FROM_SCORE = (timing_score: number): string => {
  if (timing_score >= 80) return 'now'
  if (timing_score >= 60) return '3m'
  if (timing_score >= 40) return '6m'
  return 'wait'
}

const TIMING_LABELS: Record<string, { badge: string; color: string }> = {
  now: { badge: '🔥 今すぐ動き時', color: '#ffa040' },
  '3m': { badge: '✨ 3ヶ月以内に行動', color: '#f0c060' },
  '6m': { badge: '🌿 半年後が本番', color: '#a898f8' },
  wait: { badge: '💧 じっくり充電期', color: '#3cc4a8' },
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data, error } = await supabase
    .from('precise_diagnoses')
    .select('id, nickname, zodiac_sun, zodiac_moon, honmei_star, mbti_type, score_total, score_timing, score_readiness, score_market, kansen_text, monthly_advice, top_jobs, created_at')
    .eq('id', id)
    .single()

  if (error || !data) return notFound()

  const row = data as DiagnoseRow
  const timing = TIMING_FROM_SCORE(row.score_timing)
  const timingInfo = TIMING_LABELS[timing]
  const adviceList: MonthAdvice[] = Array.isArray(row.monthly_advice) ? row.monthly_advice : []
  const topJobs: TopJob[] = Array.isArray(row.top_jobs) ? row.top_jobs.slice(0, 3) : []

  const diagDate = new Date(row.created_at)
  const dateStr = `${diagDate.getFullYear()}年${diagDate.getMonth() + 1}月${diagDate.getDate()}日`

  return (
    <div style={{ background: '#060914', minHeight: '100dvh', color: '#f0f4ff' }}>
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '28px 18px 52px' }}>

        {/* ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: '#c8952a', marginBottom: 8 }}>✦ 精密鑑定結果 ✦</div>
          <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 20, fontWeight: 900, marginBottom: 4 }}>
            {row.nickname}さんの転職鑑定
          </h1>
          <p style={{ fontSize: 11, color: '#7888b8' }}>鑑定日：{dateStr}</p>
        </div>

        {/* 星のプロフィール */}
        <div style={{ background: '#0d1428', border: '1px solid #2a3f72', borderRadius: 16, padding: '20px 18px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 14, textAlign: 'center' }}>
            ✦ あなたの星のプロフィール
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: '☀️ 太陽星座', value: row.zodiac_sun, color: '#f0c060' },
              { label: '🌙 月星座',   value: row.zodiac_moon ?? '—', color: '#a898f8' },
              { label: '⭐ 本命星',   value: row.honmei_star ?? '—', color: '#3cc4a8' },
              { label: '🧠 MBTI',    value: row.mbti_type ?? '—', color: '#c8952a' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111c36', borderRadius: 8, padding: '8px 14px' }}>
                <span style={{ fontSize: 12, color: '#7888b8' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* スコア */}
        <div style={{ background: '#0d1428', border: '1px solid #2a3f72', borderRadius: 16, padding: '20px 18px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 16, textAlign: 'center' }}>
            ✦ 転職運スコア
          </div>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 52, fontWeight: 900, color: '#f0c060', lineHeight: 1 }}>
              {row.score_total}
            </span>
            <span style={{ fontSize: 16, color: '#7888b8', marginLeft: 6 }}>点</span>
          </div>
          <div style={{ padding: '12px 14px', background: '#0a0f1e', border: `1px solid ${timingInfo.color}33`, borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: timingInfo.color }}>{timingInfo.badge}</div>
          </div>
        </div>

        {/* TOP職種 */}
        {topJobs.length > 0 && (
          <div style={{ background: '#0d1428', border: '1px solid #2a3f72', borderRadius: 16, padding: '20px 18px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 16 }}>
              ✦ 向いている職種 TOP3
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topJobs.map((job, i) => (
                <div key={job.job} style={{ background: '#111c36', border: `1px solid ${i === 0 ? '#c8952a' : '#1e2d52'}`, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: i === 0 ? '#f0f4ff' : '#dde4f8' }}>
                      {i + 1}位 {job.job}
                    </span>
                    <span style={{ fontSize: 13, color: '#f0c060', fontWeight: 700 }}>{job.score}%</span>
                  </div>
                  <div style={{ height: 3, background: '#0a0f1e', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${job.score}%`, background: i === 0 ? 'linear-gradient(90deg, #c8952a, #f0c060)' : 'linear-gradient(90deg, #2a3f72, #a898f8)', borderRadius: 2 }} />
                  </div>
                  {job.reason && <p style={{ fontSize: 10, color: '#3a4870', lineHeight: 1.6 }}>{job.reason}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3ヶ月アドバイス */}
        {adviceList.length > 0 && (
          <div style={{ background: '#0d1428', border: '1px solid #2a3f72', borderRadius: 16, padding: '20px 18px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 16 }}>
              ✦ 今後3ヶ月の行動アドバイス
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {adviceList.map((ma, i) => (
                <div
                  key={i}
                  style={{
                    background: ma.highlight ? 'linear-gradient(135deg, #c8952a0a, #111c36)' : '#111c36',
                    border: `1px solid ${ma.highlight ? '#c8952a44' : '#1e2d52'}`,
                    borderRadius: 10,
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{ma.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: ma.highlight ? '#f0c060' : '#dde4f8' }}>
                      【{ma.month}】{ma.label}
                    </span>
                    {ma.highlight && (
                      <span style={{ fontSize: 9, color: '#c8952a', letterSpacing: 1 }}>★ 行動月</span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: '#7888b8', lineHeight: 1.7 }}>{ma.advice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ルナのメッセージ */}
        {row.kansen_text && (
          <div style={{ background: 'linear-gradient(135deg, #1a1830, #0d1428)', border: '1px solid #7c6bdc44', borderRadius: 16, padding: '20px 18px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#a898f8', marginBottom: 14, textAlign: 'center' }}>
              ✦ ルナからの精密鑑定メッセージ
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #c8952a, #7c6bdc)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌙</div>
              <div style={{ fontSize: 11, color: '#7888b8' }}>
                <strong style={{ color: '#a898f8' }}>転職占い師◇ルナ</strong>
                <br />@hoshiyomi_luna
              </div>
            </div>
            <div style={{ background: '#0a0f1e', borderRadius: 12, padding: '16px', border: '1px solid #2a3f72' }}>
              <p style={{ fontSize: 13, color: '#dde4f8', lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-serif)' }}>
                {row.kansen_text}
              </p>
            </div>
          </div>
        )}

        {/* フッター */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a
            href="/premium"
            style={{ display: 'inline-block', fontSize: 12, color: '#a898f8', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            ← 精密鑑定のトップへ
          </a>
        </div>

      </div>
    </div>
  )
}
