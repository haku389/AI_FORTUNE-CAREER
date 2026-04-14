import type { Metadata } from 'next'
import Link from 'next/link'
import Stars from '@/components/Stars'

export const metadata: Metadata = {
  title: 'MBTIとは — 性格16タイプと転職 | 転職占い師ルナ',
  description: 'MBTIの4つの軸と16タイプを解説。あなたの性格タイプがどんな職場文化・職種に向いているか、星座と組み合わせた転職鑑定への活かし方がわかります。',
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
    code: 'E / I',
    label: '外向 / 内向',
    desc: 'エネルギーの源泉を示す軸。外向型（E）は人との関わりや刺激を受けることでエネルギーを回復し、内向型（I）は一人の時間や内省によって充電する。職場の密度や会議の多さが合否に直結する。',
  },
  {
    code: 'S / N',
    label: '感覚 / 直感',
    desc: '情報の受け取り方を示す軸。感覚型（S）は現実の事実・詳細・手順を重視し、直感型（N）は可能性・パターン・将来像を優先する。転職先で「実務重視か戦略重視か」の文化と合うかに影響する。',
  },
  {
    code: 'T / F',
    label: '思考 / 感情',
    desc: '意思決定の方法を示す軸。思考型（T）は論理・効率・客観的な基準で判断し、感情型（F）は人への影響・価値観・調和を重視する。評価制度が成果主義か関係性重視かによって働きやすさが変わる。',
  },
  {
    code: 'J / P',
    label: '判断 / 知覚',
    desc: '生活・仕事スタイルを示す軸。判断型（J）は計画・締め切り・秩序を好み、知覚型（P）は柔軟性・即興性・オープンな選択肢を好む。裁量や仕事の進め方の自由度が転職先選びのポイントになる。',
  },
]

const GROUPS = [
  {
    name: '分析家',
    color: '#a898f8',
    types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    desc: '論理・分析・戦略的思考を強みに持つグループ。感情よりも合理性を優先し、複雑な問題を体系的に解決する。知的刺激と成長機会がある環境で最大限に力を発揮し、ルーティン業務や非合理な慣習にはストレスを感じやすい。',
  },
  {
    name: '外交官',
    color: '#3cc4a8',
    types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    desc: '共感力・理想主義・人への深い関心を持つグループ。人の可能性を信じ、成長を支えることに喜びを感じる。仕事に意味や使命を求める傾向が強く、価値観と合わない職場では急速にモチベーションが低下する。',
  },
  {
    name: '探検家',
    color: '#c8952a',
    types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    desc: '実践・即興・現場対応力を強みとするグループ。理論よりも行動を優先し、手を動かしながら問題を解決する。結果がすぐに見える仕事や自由度の高い環境で輝き、細かい管理や長い会議が続く職場は苦手。',
  },
  {
    name: '番人',
    color: '#60c8f0',
    types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    desc: '責任感・誠実さ・実務能力を兼ね備えたグループ。ルールと秩序を大切にし、組織の安定を支える縁の下の力持ち。信頼と実績を積み上げることを重視するため、急激な変化や曖昧な役割分担が続く環境は合わない。',
  },
]

const ALL_TYPES: { code: string; name: string; group: string; color: string }[] = [
  { code: 'INTJ', name: '建築家', group: '分析家', color: '#a898f8' },
  { code: 'INTP', name: '論理学者', group: '分析家', color: '#a898f8' },
  { code: 'ENTJ', name: '指揮官', group: '分析家', color: '#a898f8' },
  { code: 'ENTP', name: '討論者', group: '分析家', color: '#a898f8' },
  { code: 'INFJ', name: '提唱者', group: '外交官', color: '#3cc4a8' },
  { code: 'INFP', name: '仲介者', group: '外交官', color: '#3cc4a8' },
  { code: 'ENFJ', name: '主人公', group: '外交官', color: '#3cc4a8' },
  { code: 'ENFP', name: '広報運動家', group: '外交官', color: '#3cc4a8' },
  { code: 'ISTJ', name: '管理者', group: '番人', color: '#60c8f0' },
  { code: 'ISFJ', name: '擁護者', group: '番人', color: '#60c8f0' },
  { code: 'ESTJ', name: '幹部', group: '番人', color: '#60c8f0' },
  { code: 'ESFJ', name: '領事', group: '番人', color: '#60c8f0' },
  { code: 'ISTP', name: '巨匠', group: '探検家', color: '#c8952a' },
  { code: 'ISFP', name: '冒険家', group: '探検家', color: '#c8952a' },
  { code: 'ESTP', name: '起業家', group: '探検家', color: '#c8952a' },
  { code: 'ESFP', name: 'エンターテイナー', group: '探検家', color: '#c8952a' },
]

export default function MbtiPage() {
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
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1a0d4a88, transparent)',
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
            ✦ MBTI
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
            MBTIとは
          </h1>
          <p
            style={{
              fontSize: 13,
              color: '#a898f8',
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            性格の16タイプ分類と転職への活かし方
          </p>
          <p style={{ fontSize: 13, color: '#8898c8', lineHeight: 2, maxWidth: 340, margin: '0 auto' }}>
            MBTIは、Carl Jungの心理学的タイプ論をもとに体系化された性格分類フレームワークです。4つの軸のどちらに傾くかを組み合わせ、16種類の性格タイプに分類します。「どんな環境で力を発揮するか」「何がモチベーションになるか」「何がストレスになるか」を言語化することで、転職先を選ぶ際の明確な基準になります。自己理解を深めるだけでなく、チームの相性や職場文化との一致を見極めるツールとしても広く活用されています。
          </p>
        </div>
      </div>

      {/* ── 4軸 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 56px' }}>
        <DIVIDER label="4つの指標" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AXES.map(({ code, label, desc }) => (
            <div
              key={code}
              style={{
                background: '#0d1428',
                border: '1px solid #2a3f72',
                borderRadius: 12,
                padding: '16px 16px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  background: '#1a0d3a',
                  border: '1px solid #4a3f72',
                  borderRadius: 6,
                  padding: '6px 10px',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#f0c060',
                  fontFamily: 'var(--font-mincho)',
                  letterSpacing: 1,
                  flexShrink: 0,
                  minWidth: 52,
                  textAlign: 'center',
                }}
              >
                {code}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: '#7888b8', lineHeight: 1.7 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4グループ ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 56px' }}>
        <DIVIDER label="4つのグループ" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {GROUPS.map(({ name, color, types, desc }) => (
            <div
              key={name}
              style={{
                background: '#0d1428',
                border: `1px solid ${color}44`,
                borderRadius: 12,
                padding: '16px 16px',
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
                  borderRadius: '12px 0 0 12px',
                }}
              />
              <div style={{ paddingLeft: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: color }}>{name}</span>
                  <span style={{ fontSize: 11, color: '#5a6a9a' }}>{types.join('・')}</span>
                </div>
                <div style={{ fontSize: 12, color: '#8898c8', lineHeight: 1.7 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 16タイプ一覧 ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 56px' }}>
        <DIVIDER label="16タイプ一覧" />
        {GROUPS.map(({ name, color, types: groupTypes }) => (
          <div key={name} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: color,
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              {name}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}
            >
              {ALL_TYPES.filter((t) => t.group === name).map(({ code, name: typeName }) => (
                <Link
                  key={code}
                  href={`/guide/mbti/${code.toLowerCase()}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: '#0d1428',
                      border: `1px solid ${color}44`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 800, color: color, marginBottom: 2 }}>{code}</div>
                    <div style={{ fontSize: 10, color: '#7888b8' }}>{typeName}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── なぜMBTI×星座なのか ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 56px' }}>
        <DIVIDER label="なぜMBTI×星座なのか" />
        <div
          style={{
            background: 'linear-gradient(135deg, #0d1428, #12102a)',
            border: '1px solid #2a3f72',
            borderRadius: 14,
            padding: '22px 20px',
          }}
        >
          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 2, margin: 0 }}>
            MBTIは「どんな職場文化・チーム・職種に合うか」を示し、星座は「今そこに踏み出す運気があるか」「その一歩を本音で望んでいるか」を示します。たとえば同じINTJでも、木星の恩恵を受けている時期と土星の試練期では、転職の判断は大きく変わります。2つを組み合わせることで、「向いている方向」と「動くべきタイミング」が同時にわかり、転職の成功率を高める鑑定が可能になります。
          </p>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 72px' }}>
        <Link
          href="/premium/form"
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
          💎 MBTI×星座で向いている職種を診断 →
        </Link>
      </div>
    </div>
  )
}
