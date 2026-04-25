import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import AgentLink from '@/components/result/AgentLink'
import { ZODIAC } from '@/lib/zodiac'
import { getHonmeiStarKeyword } from '@/lib/honmeiStar'

export const metadata: Metadata = {
  title: '鑑定結果 | 転職占い師ルナ',
  description: 'ルナによる精密転職鑑定の結果ページ',
}

type MonthAdvice = {
  month: string; label: string; emoji: string; advice: string; highlight: boolean
}
type TopJob = { job: string; score: number; reason: string }
type IndustryMatch = { name: string; emoji: string }
type AgentMatch = { name: string; url: string; desc: string; luna: string }

type DiagnoseRow = {
  id: string
  nickname: string
  zodiac_sun: string
  zodiac_moon: string | null
  honmei_star: string | null
  mbti_type: string | null
  score_total: number
  score_timing: number
  kansen_text: string | null
  monthly_advice: MonthAdvice[] | null
  top_jobs: TopJob[] | null
  top_industries: IndustryMatch[] | null
  recommended_agents: AgentMatch[] | null
  created_at: string
}

const ZODIAC_EN: Record<string, string> = {
  '牡羊座': 'Aries', '牡牛座': 'Taurus', '双子座': 'Gemini',
  '蟹座': 'Cancer', '獅子座': 'Leo', '乙女座': 'Virgo',
  '天秤座': 'Libra', '蠍座': 'Scorpio', '射手座': 'Sagittarius',
  '山羊座': 'Capricorn', '水瓶座': 'Aquarius', '魚座': 'Pisces',
}

const TIMING_FROM_SCORE = (s: number): string => {
  if (s >= 80) return 'now'
  if (s >= 60) return '3m'
  if (s >= 40) return '6m'
  return 'wait'
}

const TIMING_LABELS: Record<string, { badge: string; color: string }> = {
  now:  { badge: '🔥 今すぐ動き時',    color: '#ffa040' },
  '3m': { badge: '✨ 3ヶ月以内に行動', color: '#f0c060' },
  '6m': { badge: '🌿 半年後が本番',    color: '#a898f8' },
  wait: { badge: '💧 じっくり充電期',  color: '#3cc4a8' },
}

const card: React.CSSProperties = {
  background: '#0d1428', border: '1px solid #2a3f72',
  borderRadius: 16, padding: '20px 18px', marginBottom: 12,
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data, error } = await supabase
    .from('precise_diagnoses')
    .select('id, nickname, zodiac_sun, zodiac_moon, honmei_star, mbti_type, score_total, score_timing, kansen_text, monthly_advice, top_jobs, top_industries, recommended_agents, created_at')
    .eq('id', id)
    .single()

  if (error || !data) return notFound()

  const row = data as DiagnoseRow
  const timing = TIMING_FROM_SCORE(row.score_timing)
  const timingInfo = TIMING_LABELS[timing]
  const adviceList: MonthAdvice[] = Array.isArray(row.monthly_advice) ? row.monthly_advice : []
  const topJobs: TopJob[] = Array.isArray(row.top_jobs) ? row.top_jobs.slice(0, 3) : []
  const topIndustries: IndustryMatch[] = Array.isArray(row.top_industries) ? row.top_industries : []
  const agents: AgentMatch[] = Array.isArray(row.recommended_agents) ? row.recommended_agents : []

  const diagDate = new Date(row.created_at)
  const dateStr = `${diagDate.getFullYear()}年${diagDate.getMonth() + 1}月${diagDate.getDate()}日`
  const sunEn = ZODIAC_EN[row.zodiac_sun] ?? ''
  const mbtiLower = row.mbti_type?.toLowerCase() ?? ''
  const sunKeyword = ZODIAC.find(z => z.name === row.zodiac_sun)?.keyword ?? ''
  const moonKeyword = row.zodiac_moon ? (ZODIAC.find(z => z.name === row.zodiac_moon)?.keyword ?? '') : ''
  const honmeiKeyword = row.honmei_star ? getHonmeiStarKeyword(row.honmei_star as Parameters<typeof getHonmeiStarKeyword>[0]) : ''

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

        {/* ══ 星のプロフィール ══ */}
        <div style={{ ...card, background: 'linear-gradient(135deg, #111c36, #0d1428)' }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 14, textAlign: 'center' }}>
            ✦ あなたの星のプロフィール
          </div>

          {/* 太陽星座アイコン */}
          {sunEn && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #2a3f72', borderRadius: 8, padding: '7px 14px', background: '#060914' }}>
                <Image src={`/assets/img/${sunEn}.png`} alt={row.zodiac_sun} width={18} height={18} style={{ objectFit: 'contain' }} />
                <span style={{ fontSize: 12, color: '#a898f8', fontWeight: 700 }}>{row.zodiac_sun}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: '☀️ 太陽星座', value: sunKeyword ? `${row.zodiac_sun}（${sunKeyword}）` : row.zodiac_sun,                             color: '#f0c060', href: '/guide/seiyou' },
              { label: '🌙 月星座',   value: row.zodiac_moon ? (moonKeyword ? `${row.zodiac_moon}（${moonKeyword}）` : row.zodiac_moon) : '—', color: '#a898f8', href: '/guide/seiyou' },
              { label: '⭐ 本命星',   value: row.honmei_star ? (honmeiKeyword ? `${row.honmei_star}（${honmeiKeyword}）` : row.honmei_star) : '—', color: '#3cc4a8', href: '/guide/kyusei' },
              ...(row.mbti_type ? [{ label: '🧠 MBTI', value: row.mbti_type, color: '#c8952a', href: `/guide/mbti/${mbtiLower}` }] : []),
            ].map(({ label, value, color, href }) => (
              <a key={label} href={href} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#111c3688', border: '1px solid #1e2d52', borderRadius: 10, padding: '10px 14px', textDecoration: 'none' }}>
                <span style={{ fontSize: 11, color: '#7888b8', flexShrink: 0, width: 72, lineHeight: 1.6 }}>{label}</span>
                <span style={{ fontSize: 12, color, fontWeight: 600, lineHeight: 1.6, flex: 1 }}>{value}</span>
                <span style={{ fontSize: 9, color: '#3a4870', alignSelf: 'center' }}>→</span>
              </a>
            ))}
          </div>
        </div>

        {/* ══ 転職スコア ══ */}
        <div style={card}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 16, textAlign: 'center' }}>✦ 転職スコア</div>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 52, fontWeight: 900, color: '#f0c060', lineHeight: 1 }}>{row.score_total}</span>
            <span style={{ fontSize: 16, color: '#7888b8', marginLeft: 6 }}>点</span>
          </div>
          <div style={{ padding: '12px 14px', background: '#0a0f1e', border: `1px solid ${timingInfo.color}33`, borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: timingInfo.color }}>{timingInfo.badge}</div>
          </div>
        </div>

        {/* ══ 向いている職種・業界 ══ */}
        {topJobs.length > 0 && (
          <div style={card}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 16 }}>✦ 向いている職種・業界</div>

            <div style={{ fontSize: 11, color: '#7888b8', marginBottom: 10 }}>【TOP 3 職種】</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {topJobs.map((job, i) => (
                <div key={job.job} style={{ background: '#111c36', border: `1px solid ${i === 0 ? '#c8952a' : '#1e2d52'}`, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: i === 0 ? '#c8952a' : '#7888b8', fontWeight: 700 }}>{i + 1}位</span>
                      <span style={{ fontSize: 13, color: i === 0 ? '#f0f4ff' : '#dde4f8', fontWeight: 600 }}>{job.job}</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#f0c060', fontWeight: 700 }}>{job.score}%</span>
                  </div>
                  <div style={{ height: 3, background: '#0a0f1e', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${job.score}%`, background: i === 0 ? 'linear-gradient(90deg, #c8952a, #f0c060)' : 'linear-gradient(90deg, #2a3f72, #a898f8)', borderRadius: 2 }} />
                  </div>
                  {job.reason && <p style={{ fontSize: 10, color: '#3a4870', lineHeight: 1.6 }}>{job.reason}</p>}
                </div>
              ))}
            </div>

            {topIndustries.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: '#7888b8', marginBottom: 8 }}>【向いている業界】</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {topIndustries.map(ind => (
                    <div key={ind.name} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111c36', border: '1px solid #2a3f72', borderRadius: 20, padding: '6px 14px', fontSize: 12, color: '#dde4f8' }}>
                      <span>{ind.emoji}</span><span>{ind.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {agents.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: '#7888b8', marginBottom: 8 }}>【おすすめ転職エージェント】</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {agents.map(agent => (
                    <AgentLink key={agent.name} agent={agent} />
                  ))}
                </div>
                <p style={{ fontSize: 10, color: '#3a4870', marginTop: 10, textAlign: 'right' }}>※ 広告を含みます</p>
              </>
            )}
          </div>
        )}

        {/* ══ 3ヶ月アドバイス ══ */}
        {adviceList.length > 0 && (
          <div style={card}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8952a', marginBottom: 16 }}>✦ 今後3ヶ月の行動アドバイス</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {adviceList.map((ma, i) => (
                <div key={i} style={{ background: ma.highlight ? 'linear-gradient(135deg, #c8952a0a, #111c36)' : '#111c36', border: `1px solid ${ma.highlight ? '#c8952a44' : '#1e2d52'}`, borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{ma.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: ma.highlight ? '#f0c060' : '#dde4f8' }}>【{ma.month}】{ma.label}</span>
                    {ma.highlight && <span style={{ fontSize: 9, color: '#c8952a', letterSpacing: 1 }}>★ 行動月</span>}
                  </div>
                  <p style={{ fontSize: 11, color: '#7888b8', lineHeight: 1.7 }}>{ma.advice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ルナのメッセージ ══ */}
        {row.kansen_text && (
          <div style={{ ...card, background: 'linear-gradient(135deg, #1a1830, #0d1428)', border: '1px solid #7c6bdc44' }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#a898f8', marginBottom: 14, textAlign: 'center' }}>
              ✦ ルナからの精密鑑定メッセージ
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <Image src="/luna_mainIcon.png" alt="ルナ" width={36} height={36} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid #7c6bdc44' }} />
              <div style={{ fontSize: 11, color: '#7888b8' }}>
                <strong style={{ color: '#a898f8' }}>転職占い師◇ルナ</strong><br />@hoshiyomi_luna
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
          <a href="/premium" style={{ fontSize: 12, color: '#a898f8', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            ← 精密鑑定のトップへ
          </a>
        </div>

      </div>
    </div>
  )
}
