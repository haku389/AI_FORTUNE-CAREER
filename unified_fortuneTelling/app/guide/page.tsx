import type { Metadata } from 'next'
import Link from 'next/link'
import Stars from '@/components/Stars'
import { Sun, Compass, Brain } from 'lucide-react'

export const metadata: Metadata = {
  title: '占い図鑑 — ルナの鑑定で使う3つの占い | 転職占い師ルナ',
  description: '転職占い師ルナが使う西洋占星術・九星気学・MBTIの3つの占術を詳しく解説。転職タイミングと方向性を読み解く4軸鑑定の全体像がわかります。',
}

const DIVIDER = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #2a3f72)' }} />
    <span style={{ fontSize: 10, letterSpacing: 4, color: '#5a6a9a', whiteSpace: 'nowrap' }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2a3f72, transparent)' }} />
  </div>
)

const CARDS = [
  {
    href: '/guide/seiyou',
    icon: <Sun size={24} color="#a898f8" />,
    title: '西洋占星術',
    badge: 'ASTROLOGY',
    desc: '太陽・月・惑星の動きで転職タイミングを読む。木星や土星のトランジットが示す「動き時」を捉えることで、転職の最適な時期を星の暦から導きます。',
    color: '#a898f8',
  },
  {
    href: '/guide/kyusei',
    icon: <Compass size={24} color="#3cc4a8" />,
    title: '九星気学',
    badge: 'KYUSEI',
    desc: '生まれ年の本命星でキャリアの方向性を読む。9年サイクルの運気の流れを把握し、今が「仕込みの年」なのか「動く年」なのかを見極めます。',
    color: '#3cc4a8',
  },
  {
    href: '/guide/mbti',
    icon: <Brain size={24} color="#c8952a" />,
    title: 'MBTI',
    badge: 'PERSONALITY',
    desc: '16タイプの性格分類で向いている職種を分析。思考・感情・行動のパターンから、長く活躍できる職場環境やチームの雰囲気を具体的に絞り込みます。',
    color: '#c8952a',
  },
]

export default function GuidePage() {
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
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #2a0d4a88, transparent)',
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
            ✦ 占い図鑑
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 'clamp(30px, 8vw, 40px)',
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: 16,
              letterSpacing: '0.04em',
            }}
          >
            ルナの鑑定で使う
            <br />
            <span style={{ color: '#f0c060' }}>3つの占い</span>
          </h1>
          <p style={{ fontSize: 13, color: '#8898c8', lineHeight: 2, maxWidth: 320, margin: '0 auto' }}>
            転職タイミングと方向性を、3つの占術の掛け合わせで読み解きます。西洋占星術・九星気学・MBTIはそれぞれ異なる角度から「あなた」を照らし出し、1つだけでは見えない転職の全体像を浮かび上がらせます。それぞれの特徴を知ることで、鑑定結果がより深く理解できます。
          </p>
        </div>
      </div>

      {/* ── 3 CARDS ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 56px' }}>
        <DIVIDER label="3 METHODS" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CARDS.map(({ href, icon, title, badge, desc, color }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#0d1428',
                  border: `1px solid #2a3f72`,
                  borderRadius: 14,
                  padding: '20px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
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
                    background: `linear-gradient(90deg, ${color}, transparent)`,
                  }}
                />
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: `${color}18`,
                    border: `1px solid ${color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: 8,
                        letterSpacing: 2,
                        color: color,
                        border: `1px solid ${color}55`,
                        padding: '2px 6px',
                        borderRadius: 2,
                      }}
                    >
                      {badge}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      fontFamily: 'var(--font-serif)',
                      color: '#f0f4ff',
                      marginBottom: 4,
                    }}
                  >
                    {title}
                  </div>
                  <div style={{ fontSize: 12, color: '#7888b8', lineHeight: 1.7 }}>{desc}</div>
                </div>
                <div style={{ color: color, fontSize: 14, flexShrink: 0 }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── COMBINATION BANNER ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 56px' }}>
        <DIVIDER label="COMBINATION" />
        <div
          style={{
            background: 'linear-gradient(135deg, #120a28, #0d1428)',
            border: '1px solid #4a3f72',
            borderRadius: 16,
            padding: '28px 20px',
            textAlign: 'center',
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
              background: 'linear-gradient(90deg, #a898f8, #3cc4a8, #c8952a)',
            }}
          />
          <div style={{ fontSize: 28, marginBottom: 12 }}>✦</div>
          <div
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 17,
              fontWeight: 700,
              color: '#f0f4ff',
              marginBottom: 10,
            }}
          >
            3つを組み合わせるとどうなる？
          </div>
          <p style={{ fontSize: 12, color: '#8898c8', lineHeight: 2, marginBottom: 20 }}>
            太陽星座 × 月星座 × 本命星 × MBTI —<br />
            4軸が重なるとき、本当の転職運命が見えてくる。それぞれの占術が示す「断片」を重ね合わせることで、タイミング・動機・適性・相性が一枚の地図として完成します。自分でも気づいていなかった転職の最適解が、ここから見えてきます。
          </p>
          <Link
            href="/guide/combination"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: 'transparent',
              border: '1px solid #a898f8',
              borderRadius: 8,
              color: '#a898f8',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: 0.5,
            }}
          >
            組み合わせ方を見る →
          </Link>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 72px' }}>
        <Link
          href="/premium"
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
          💎 自分の組み合わせを精密鑑定する →
        </Link>
      </div>
    </div>
  )
}
