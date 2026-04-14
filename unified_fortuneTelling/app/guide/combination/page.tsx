import type { Metadata } from 'next'
import Link from 'next/link'
import Stars from '@/components/Stars'
import { Sun, Moon, Compass, Brain } from 'lucide-react'

export const metadata: Metadata = {
  title: '3つの占いを組み合わせると — なぜ4軸の鑑定が必要なのか | 転職占い師ルナ',
  description: '太陽星座・月星座・本命星・MBTIの4軸を組み合わせることで転職の最適タイミングと方向性がわかる理由を解説。具体的な組み合わせ例付き。',
}

const DIVIDER = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #2a3f72)' }} />
    <span style={{ fontSize: 10, letterSpacing: 4, color: '#5a6a9a', whiteSpace: 'nowrap' }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2a3f72, transparent)' }} />
  </div>
)

const AXES = [
  {
    key: '太陽星座',
    label: '外向きの性格・行動スタイル',
    result: 'どんな職場文化に合うか',
    color: '#f0c060',
    icon: <Sun size={20} color="#f0c060" />,
  },
  {
    key: '月星座',
    label: '本音・感情・ストレス',
    result: '転職したい本当の理由',
    color: '#a898f8',
    icon: <Moon size={20} color="#a898f8" />,
  },
  {
    key: '本命星',
    label: '運気の方向性・サイクル',
    result: '今が動く時期かどうか',
    color: '#3cc4a8',
    icon: <Compass size={20} color="#3cc4a8" />,
  },
  {
    key: 'MBTI',
    label: '思考・行動パターン',
    result: '向いている職種・チーム',
    color: '#c8952a',
    icon: <Brain size={20} color="#c8952a" />,
  },
]

const EXAMPLE_ITEMS = [
  {
    axis: '牡羊座（太陽）',
    point: '行動力があり変化を好む。現状維持よりも新しい挑戦にエネルギーが向きやすく、スピード感のある職場で実力を発揮しやすい。',
    color: '#f0c060',
  },
  {
    axis: '月蟹座（月）',
    point: '「安心できる職場環境」が本音の動機。表向きはキャリアアップを望んでいても、内側には「居場所のある職場で長く働きたい」という強い欲求がある。',
    color: '#a898f8',
  },
  {
    axis: '三碧木星',
    point: '新しいことへの挑戦が運気を開く時期。9年サイクルの中でも「種まきと行動」の局面にあたり、今動くことで2〜3年後に大きな成果が実る可能性が高い。',
    color: '#3cc4a8',
  },
  {
    axis: 'ENFP',
    point: '人との繋がりと自由度が高い環境で輝く。細かいルールや反復業務より、アイデアを出しながら人を巻き込んでいく仕事スタイルが本来の強みを引き出す。',
    color: '#c8952a',
  },
]

export default function CombinationPage() {
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
            ✦ 組み合わせ
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 'clamp(26px, 7vw, 36px)',
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: 8,
              letterSpacing: '0.04em',
            }}
          >
            3つの占いを
            <br />
            組み合わせると
          </h1>
          <p
            style={{
              fontSize: 13,
              color: '#a898f8',
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            なぜ4軸の鑑定が必要なのか
          </p>
          <p style={{ fontSize: 13, color: '#8898c8', lineHeight: 2, maxWidth: 340, margin: '0 auto' }}>
            人の転職判断は「性格」だけでは語れません。今の運気の流れ、本音の動機、そして職場との相性——この4つが揃って初めて、あなたに本当に合った転職の道筋が見えてきます。1軸や2軸の占いで判断するより、はるかに精度の高いアドバイスが可能になります。
          </p>
        </div>
      </div>

      {/* ── Why section ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="4軸が必要な理由" />
        <div
          style={{
            background: 'linear-gradient(135deg, #0d1428, #12102a)',
            border: '1px solid #2a3f72',
            borderRadius: 14,
            padding: '22px 20px',
          }}
        >
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 2.2, margin: 0 }}>
            太陽星座だけでは「性格の傾向」しかわかりません。月星座を加えると「本音の動機」が見え、本命星を加えると「今の運気の方向性」が、MBTIを加えると「職場環境との相性」が見えてきます。4つが揃ったとき、初めて「あなたに今、転職を勧めるか」という問いに答えられます。例えば性格的に「行動的」でも、運気が停滞期であればむしろ準備に徹する時期かもしれません。逆に運気が上昇していても、職場との相性が合わなければ転職後に後悔するリスクが高まります。4軸を組み合わせることで、こうした矛盾やズレを事前に見抜き、本当に後悔しない転職のタイミングと方向性を見極めることができます。
          </p>
        </div>
      </div>

      {/* ── 4軸の役割 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="4軸の役割" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          {AXES.map(({ key, label, result, color, icon }) => (
            <div
              key={key}
              style={{
                background: '#0d1428',
                border: `1px solid ${color}44`,
                borderRadius: 12,
                padding: '14px 14px',
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
              <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: color, marginBottom: 6 }}>{key}</div>
              <div style={{ fontSize: 11, color: '#7888b8', lineHeight: 1.6, marginBottom: 8 }}>{label}</div>
              <div
                style={{
                  fontSize: 10,
                  color: color,
                  background: `${color}18`,
                  padding: '4px 8px',
                  borderRadius: 4,
                  lineHeight: 1.5,
                }}
              >
                → {result}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 組み合わせ例 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="組み合わせ例" />
        <div
          style={{
            background: 'linear-gradient(135deg, #120a28, #0d1428)',
            border: '1px solid #4a3f72',
            borderRadius: 16,
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
              background: 'linear-gradient(90deg, #f0c060, #a898f8, #3cc4a8, #c8952a)',
            }}
          />

          <div
            style={{
              fontSize: 12,
              color: '#f0c060',
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            牡羊座（太陽）× 蟹座（月）× 三碧木星 × ENFP
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {EXAMPLE_ITEMS.map(({ axis, point, color }) => (
              <div
                key={axis}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: color,
                    background: `${color}18`,
                    padding: '2px 6px',
                    borderRadius: 3,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {axis}
                </span>
                <span style={{ fontSize: 12, color: '#8898c8', lineHeight: 1.7 }}>{point}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: '#0a1020',
              border: '1px solid #3cc4a844',
              borderRadius: 10,
              padding: '14px 14px',
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: 2, color: '#3cc4a8', marginBottom: 8 }}>RESULT</div>
            <p style={{ fontSize: 12, color: '#d0d8f0', lineHeight: 1.9, margin: 0 }}>
              「人との繋がりが強く、ある程度の自由度がある新しい環境への転職が、今まさに運気的にも後押しされている」。具体的には、チームで動くスタートアップや、企画・営業・コミュニティ系の職種との相性が高く、転職活動は今年中に動き始めることが吉。まずは自分のMBTIタイプと本命星を確認し、今の職場とのズレを言語化するところから始めましょう。
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 72px' }}>
        <Link
          href="/premium"
          style={{
            display: 'block',
            padding: '18px 0',
            background: 'linear-gradient(135deg, #c8952a, #e0a830)',
            borderRadius: 10,
            color: '#1a0c00',
            fontSize: 15,
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
