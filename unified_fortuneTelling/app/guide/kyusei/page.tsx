import type { Metadata } from 'next'
import Link from 'next/link'
import Stars from '@/components/Stars'
import { Compass } from 'lucide-react'

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
    desc: '柔軟性と適応力が最大の武器。状況に合わせて自在に形を変え、人脈と情報収集で新しい道を切り開く。',
    jobs: 'コミュニケーション職・企画・営業',
  },
  {
    num: '二黒',
    name: '土星',
    element: '土',
    color: '#c8952a',
    desc: '忍耐力と継続力が際立つ星。コツコツと地道に積み上げることで周囲の厚い信頼を勝ち取り、長期的に評価される。',
    jobs: '管理・サポート・農業・不動産',
  },
  {
    num: '三碧',
    name: '木星',
    element: '木',
    color: '#3cc4a8',
    desc: '行動力と先見性に優れ、スピーディーな決断が得意。新しいことへ積極的に挑戦するほど運気が開き、停滞より変化を選ぶことで本領を発揮する。',
    jobs: 'ベンチャー・クリエイター・営業',
  },
  {
    num: '四緑',
    name: '木星',
    element: '木',
    color: '#3cc4a8',
    desc: '社交性と調和を大切にする星。人との縁を丁寧に育てることで仕事が自然と広がり、橋渡し役やコーディネーターとして力を発揮する。',
    jobs: 'PR・国際・コーディネーター',
  },
  {
    num: '五黄',
    name: '土星',
    element: '土',
    color: '#f0c060',
    desc: '9つの星の中心に位置するカリスマ的な存在。強烈な変革力と突破力を持ち、組織のトップに立つか独立して自分のフィールドを築くことで真の力を発揮する。',
    jobs: '経営・プロジェクトリーダー',
  },
  {
    num: '六白',
    name: '金星',
    element: '金',
    color: '#a898f8',
    desc: '強いリーダーシップと高い完璧主義が特徴。妥協を嫌い、自らも高い水準を保ちながら組織全体を牽引する。責任ある立場でこそ輝く星。',
    jobs: 'マネジメント・士業・専門職',
  },
  {
    num: '七赤',
    name: '金星',
    element: '金',
    color: '#a898f8',
    desc: '抜群の表現力と交渉力を持つ。ユーモアと魅力で人を引きつけ、場を盛り上げながら目標を達成する。対人スキルが仕事の最大の武器になる。',
    jobs: '接客・エンタメ・交渉職',
  },
  {
    num: '八白',
    name: '土星',
    element: '土',
    color: '#c8952a',
    desc: '並外れた粘り強さと、困難を乗り越える変革力が特徴。苦労を厭わずに取り組んだ先に大きな成果が待ち、専門性を極めるほど評価が高まる。',
    jobs: '専門職・研究・起業',
  },
  {
    num: '九紫',
    name: '火星',
    element: '火',
    color: '#f07a30',
    desc: '鋭い直感と豊かな創造性が輝く星。論理より感性を信じ、独自の閃きとセンスで誰も思いつかないような道を切り拓いていく。',
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
            九星気学は、中国の陰陽五行思想を基盤に発展した東洋占術で、日本には平安時代に伝わり独自の体系として洗練されてきました。生まれ年から「一白水星〜九紫火星」の9種類のエネルギー（本命星）に分類し、その人が持つ根本的な気質・得意な方向・運気の波を読み解きます。西洋占星術が天体の位置を見るのに対し、九星気学は「時間の流れの中でどの運気サイクルにいるか」を重視するのが特徴です。転職のタイミングや向いている職種・環境を判断するうえで、非常に実践的な指針を与えてくれます。
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
          <Compass size={32} color="#3cc4a8" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 2, margin: 0 }}>
            本命星とは、生まれた年をもとに算出する「その人の根本的なエネルギー」のことです。一白・二黒・三碧・四緑・五黄・六白・七赤・八白・九紫の9種類があり、それぞれ固有の気質・得意分野・相性のいい職場環境が異なります。太陽星座のように生涯変わらず、その人のベースとなる資質を示す羅針盤のような存在です。転職では「どの方向に進むと本来の力を発揮できるか」「どんな仕事スタイルが自分に合っているか」を読み解くために活用します。
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
            九星気学では、運気が9年サイクルで規則的に動くと考えます。そのサイクルの中には「種まきの年（準備・動き出し）」「開花の年（成果が出やすい）」「休養の年（充電・立て直し）」などの局面があります。本命星によって運気のピークが訪れる年は異なるため、同じタイミングでも人によってベストな行動が違います。このサイクルを知ることで転職の「動くべき年」と「待つべき年」が明確になり、タイミングを外すリスクを大きく減らすことができます。
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
