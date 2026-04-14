import type { Metadata } from 'next'
import Link from 'next/link'
import Stars from '@/components/Stars'

export const metadata: Metadata = {
  title: '西洋占星術とは — 太陽・月・惑星が示す転職タイミング | 転職占い師ルナ',
  description: '西洋占星術の太陽星座・月星座・木星・土星が転職にどう影響するかを解説。ルナの転職鑑定で重視する3つの天体の見方がわかります。',
}

const DIVIDER = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #2a3f72)' }} />
    <span style={{ fontSize: 10, letterSpacing: 4, color: '#5a6a9a', whiteSpace: 'nowrap' }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2a3f72, transparent)' }} />
  </div>
)

const ELEMENTS = [
  {
    symbol: '🔥',
    name: '火',
    signs: '牡羊・獅子・射手',
    trait: '行動力と情熱で直感的に動く。スピード感があり、変化や挑戦を好む',
    color: '#f07a30',
  },
  {
    symbol: '🌍',
    name: '土',
    signs: '牡牛・乙女・山羊',
    trait: '安定・実務を重視し、着実に前進する。長期的な視点で信頼を積み上げる',
    color: '#c8952a',
  },
  {
    symbol: '💨',
    name: '風',
    signs: '双子・天秤・水瓶',
    trait: '知性とコミュ力で新しいアイデアを生む。情報収集と人脈形成が得意',
    color: '#a898f8',
  },
  {
    symbol: '💧',
    name: '水',
    signs: '蟹・蠍・魚',
    trait: '感受性と直感が鋭く、人間関係を深める。共感力と洞察力で場の空気を読む',
    color: '#60c8f0',
  },
]

export default function SeiyouPage() {
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
            ✦ 西洋占星術
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
            西洋占星術とは
          </h1>
          <p
            style={{
              fontSize: 13,
              color: '#a898f8',
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            太陽・月・惑星が示す転職タイミング
          </p>
          <p style={{ fontSize: 13, color: '#8898c8', lineHeight: 2, maxWidth: 340, margin: '0 auto' }}>
            西洋占星術は、生まれた瞬間の天体配置をもとに、性格・運命・転職タイミングを読み解く占術です。古代バビロニアに起源を持ち、ギリシャ・ローマを経て現代まで受け継がれてきた数千年の知恵が凝縮されています。天体はそれぞれ異なるエネルギーを持ち、あなたの出生時にどの星座にあったかで、生まれ持った資質や人生のテーマが浮かび上がります。ルナの鑑定では特に「太陽星座」「月星座」「木星・土星の動き」の3つを重視し、転職の方向性とベストなタイミングを読み解きます。
          </p>
        </div>
      </div>

      {/* ── 太陽星座 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="太陽星座とは" />
        <div
          style={{
            background: '#0d1428',
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
              background: 'linear-gradient(90deg, #f0c060, transparent)',
            }}
          />
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>☀️</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-serif)', color: '#f0f4ff', marginBottom: 6 }}>
                太陽星座
              </div>
              <div style={{ fontSize: 11, color: '#f0c060', letterSpacing: 2 }}>SOLAR SIGN</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 2, marginBottom: 16 }}>
            一般的な「○○座」のこと。誕生日（正確には太陽の黄道上の位置）で決まり、外向きの性格・行動パターン・対外的な魅力を示します。社会の中でどう振る舞うか、何を目標に動くかという「表の顔」を表すのが太陽星座です。転職の場面では「どんな職場文化に馴染むか」「どんな仕事スタイルが自分らしいか」を読むために使います。まずここを知ることで、自分に合った業界・職種の方向性が見えてきます。
          </p>
          <Link
            href="/guide/seiyou/taiyou"
            style={{
              display: 'inline-block',
              padding: '9px 20px',
              background: 'transparent',
              border: '1px solid #f0c06055',
              borderRadius: 6,
              color: '#f0c060',
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            12星座を見る →
          </Link>
        </div>
      </div>

      {/* ── 月星座 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="月星座とは" />
        <div
          style={{
            background: '#0d1428',
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
              background: 'linear-gradient(90deg, #a898f8, transparent)',
            }}
          />
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>🌙</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-serif)', color: '#f0f4ff', marginBottom: 6 }}>
                月星座
              </div>
              <div style={{ fontSize: 11, color: '#a898f8', letterSpacing: 2 }}>LUNAR SIGN</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 2, marginBottom: 16 }}>
            生まれた瞬間の月の位置で決まる、本音・感情・ストレスの原因を表す星座です。月は約2.5日ごとに星座を移動するため、同じ誕生日でも生まれた時刻や場所によって月星座が異なります。太陽星座が「社会に見せる顔」なら、月星座は「内面の欲求や本能的な反応」を示す鏡です。転職においては「なぜ今の職場に違和感を覚えるのか」「本当は何を求めているのか」という深い動機を読み解くカギになります。
          </p>
          <Link
            href="/guide/seiyou/tsuki"
            style={{
              display: 'inline-block',
              padding: '9px 20px',
              background: 'transparent',
              border: '1px solid #a898f855',
              borderRadius: 6,
              color: '#a898f8',
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            月星座について詳しく →
          </Link>
        </div>
      </div>

      {/* ── 惑星の影響 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="惑星の影響" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              symbol: '♃',
              planet: '木星',
              label: 'JUPITER',
              color: '#f0c060',
              desc: 'チャンス・拡大・成長を司る惑星。木星があなたの太陽星座や月星座を通過する約1年間は、新しい機会が舞い込みやすく転職の追い風が吹きます。約12年で全星座を一周するため、「自分の木星期がいつか」を知るだけで行動タイミングが格段に明確になります。',
            },
            {
              symbol: '♄',
              planet: '土星',
              label: 'SATURN',
              color: '#a898f8',
              desc: '試練・転換期・リセットを象徴する惑星。土星があなたの重要な星座に絡むとき、現状維持か次へ進むかを真剣に問われる時期が訪れます。重く感じることもありますが、この時期を乗り越えた先には本物の実力と安定が待っています。約29年で全星座を一周し、人生の大きな節目と重なることが多い惑星です。',
            },
          ].map(({ symbol, planet, label, color, desc }) => (
            <div
              key={planet}
              style={{
                background: '#0d1428',
                border: `1px solid ${color}44`,
                borderRadius: 14,
                padding: '18px 18px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: `${color}18`,
                  border: `1px solid ${color}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: color,
                  fontFamily: 'serif',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {symbol}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-serif)', color: '#f0f4ff' }}>{planet}</span>
                  <span style={{ fontSize: 9, letterSpacing: 2, color: color }}>{label}</span>
                </div>
                <p style={{ fontSize: 12, color: '#8898c8', lineHeight: 1.8, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4元素 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 48px' }}>
        <DIVIDER label="12星座 — 4元素グループ" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          {ELEMENTS.map(({ symbol, name, signs, trait, color }) => (
            <div
              key={name}
              style={{
                background: '#0d1428',
                border: `1px solid ${color}44`,
                borderRadius: 12,
                padding: '14px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{symbol}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: color }}>{name}</span>
              </div>
              <div style={{ fontSize: 11, color: '#5a6a9a', marginBottom: 6 }}>{signs}</div>
              <div style={{ fontSize: 11, color: '#8898c8', lineHeight: 1.6 }}>{trait}</div>
            </div>
          ))}
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
          あなたの太陽・月星座を無料診断する →
        </Link>
      </div>
    </div>
  )
}
