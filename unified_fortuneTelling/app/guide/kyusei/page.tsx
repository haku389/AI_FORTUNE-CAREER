import type { Metadata } from 'next'
import Link from 'next/link'
import Stars from '@/components/Stars'

export const metadata: Metadata = {
  title: '九星気学とは — 本命星が示すキャリアの方向性 | 転職占い師ルナ',
  description: '九星気学の9種類の本命星と転職への影響を解説。生まれ年で決まる運気サイクルと転職タイミングの関係がわかります。',
}

const DIVIDER = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #2a3f72)' }} />
    <span style={{ fontSize: 10, letterSpacing: 4, color: '#5a6a9a', whiteSpace: 'nowrap' }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2a3f72, transparent)' }} />
  </div>
)

const STARS_DATA = [
  {
    num: '一白',
    name: '水星',
    element: '水',
    color: '#60c8f0',
    desc: '柔軟性・適応力。人脈と情報収集で道を開く。',
    jobs: 'コミュニケーション職・企画・営業',
  },
  {
    num: '二黒',
    name: '土星',
    element: '土',
    color: '#c8952a',
    desc: '忍耐・継続力。地道な積み上げで信頼を築く。',
    jobs: '管理・サポート・農業・不動産',
  },
  {
    num: '三碧',
    name: '木星',
    element: '木',
    color: '#3cc4a8',
    desc: '行動力・先見性。新しいことへの挑戦が運気を開く。',
    jobs: 'ベンチャー・クリエイター・営業',
  },
  {
    num: '四緑',
    name: '木星',
    element: '木',
    color: '#3cc4a8',
    desc: '社交性・調和。人との縁で仕事が広がる。',
    jobs: 'PR・国際・コーディネーター',
  },
  {
    num: '五黄',
    name: '土星',
    element: '土',
    color: '#f0c060',
    desc: 'カリスマ・変革力。組織のトップか独立が向く。',
    jobs: '経営・プロジェクトリーダー',
  },
  {
    num: '六白',
    name: '金星',
    element: '金',
    color: '#a898f8',
    desc: 'リーダーシップ・完璧主義。高い基準で組織を牽引。',
    jobs: 'マネジメント・士業・専門職',
  },
  {
    num: '七赤',
    name: '金星',
    element: '金',
    color: '#a898f8',
    desc: '表現力・交渉力。人を楽しませ、場を盛り上げる。',
    jobs: '接客・エンタメ・交渉職',
  },
  {
    num: '八白',
    name: '土星',
    element: '土',
    color: '#c8952a',
    desc: '粘り強さ・変革。苦労の先に大きな成果。',
    jobs: '専門職・研究・起業',
  },
  {
    num: '九紫',
    name: '火星',
    element: '火',
    color: '#f07a30',
    desc: '直感・創造性。閃きとセンスで道を切り拓く。',
    jobs: 'クリエイター・コンサル・教育',
  },
]

export default function KyuseiPage() {
  return (
    <div
      style={{
        background: '#070c1a',
        color: '#f0f4ff',
        minHeight: '100dvh',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Stars />

      {/* ── HERO ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          maxWidth: 430,
          margin: '0 auto',
          padding: '72px 24px 56px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #0d2a1a88, transparent)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: 9,
              letterSpacing: 5,
              color: '#c8952a',
              border: '1px solid #c8952a55',
              background: '#c8952a0a',
              padding: '4px 14px',
              borderRadius: 2,
              marginBottom: 20,
            }}
          >
            ✦ 九星気学
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 'clamp(28px, 8vw, 38px)',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: 8,
              letterSpacing: '0.04em',
            }}
          >
            九星気学とは
          </h1>
          <p
            style={{
              fontSize: 13,
              color: '#3cc4a8',
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            本命星が示すキャリアの方向性
          </p>
          <p style={{ fontSize: 13, color: '#8898c8', lineHeight: 2, maxWidth: 340, margin: '0 auto' }}>
            九星気学は、生まれ年をもとに9種類のエネルギー（本命星）に分類する東洋占術。陰陽五行の思想を基盤に、個人の持つ気質・運気サイクルを読み解きます。
          </p>
        </div>
      </div>

      {/* ── 本命星とは ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="本命星とは" />
        <div
          style={{
            background: 'linear-gradient(135deg, #0d1428, #12102a)',
            border: '1px solid #2a3f72',
            borderRadius: 14,
            padding: '22px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, #3cc4a8, transparent)',
            }}
          />
          <div style={{ fontSize: 28, marginBottom: 12 }}>☯️</div>
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 2, margin: 0 }}>
            生まれた年から算出する「その人の基本エネルギー」。9種類それぞれに固有の方向性・得意分野・運気サイクルがあり、転職では「どの方向に進むと力を発揮できるか」を示します。
          </p>
        </div>
      </div>

      {/* ── 9種類の本命星 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="9種類の本命星" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STARS_DATA.map(({ num, name, color, desc, jobs }) => (
            <div
              key={num}
              style={{
                background: '#0d1428',
                border: `1px solid #2a3f72`,
                borderRadius: 12,
                padding: '14px 16px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: 3,
                  background: color,
                }}
              />
              <div style={{ paddingLeft: 8, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      fontFamily: 'var(--font-mincho)',
                      color: color,
                    }}
                  >
                    {num}{name}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#b0bcd8', lineHeight: 1.7, marginBottom: 6 }}>{desc}</p>
                <div style={{ fontSize: 11, color: '#5a6a9a' }}>
                  向き: <span style={{ color: color }}>{jobs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 転職との関係 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="転職との関係" />
        <div
          style={{
            background: 'linear-gradient(135deg, #0d1428, #12102a)',
            border: '1px solid #2a4a3a',
            borderRadius: 14,
            padding: '22px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, #3cc4a8, #c8952a, transparent)',
            }}
          />
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {['種まきの年', '開花の年', '休養の年'].map((label) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  background: '#0a1020',
                  border: '1px solid #2a3f72',
                  borderRadius: 8,
                  padding: '8px 6px',
                  textAlign: 'center',
                  fontSize: 11,
                  color: '#8898c8',
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 2, margin: 0 }}>
            運気は9年サイクルで動き、「種まきの年」「開花の年」「休養の年」がある。本命星によって運気のピークの年が異なり、そのタイミングを知ることで転職の「最適な時期」がわかります。
          </p>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 72px' }}>
        <Link
          href="/shindan"
          style={{
            display: 'block',
            padding: '16px 0',
            background: 'linear-gradient(135deg, #c8952a, #e0a830)',
            borderRadius: 10,
            color: '#1a0c00',
            fontSize: 14,
            fontWeight: 800,
            textAlign: 'center',
            textDecoration: 'none',
            letterSpacing: 1,
          }}
        >
          本命星を無料で調べる →
        </Link>
      </div>
    </div>
  )
}
