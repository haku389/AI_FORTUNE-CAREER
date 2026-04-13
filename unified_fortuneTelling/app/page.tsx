import type { Metadata } from 'next'
import Link from 'next/link'
import Stars from '@/components/Stars'

export const metadata: Metadata = {
  title: '転職占い師ルナ | 星座×転職診断サービス',
  description: '転職占い師ルナが、あなたの転職タイミングを星座で鑑定。無料の簡易診断から4軸分析の精密鑑定まで。',
}

export default function InfoPage() {
  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100dvh',
        maxWidth: 430,
        margin: '0 auto',
        padding: '60px 20px 60px',
        background: '#0a0f1e',
        color: '#f0f4ff',
      }}
    >
      <Stars />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            'radial-gradient(ellipse 70% 40% at 50% 0%, #1a0d3a, transparent)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: 10,
              letterSpacing: 4,
              color: '#c8952a',
              border: '1px solid #c8952a44',
              background: '#c8952a0c',
              padding: '4px 12px',
              borderRadius: 2,
              marginBottom: 16,
            }}
          >
            ✦ OFFICIAL
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 'clamp(26px, 7vw, 34px)',
              fontWeight: 900,
              lineHeight: 1.2,
              color: '#f0f4ff',
              marginBottom: 12,
              letterSpacing: '0.02em',
            }}
          >
            転職占い師
            <br />
            <span style={{ color: '#f0c060' }}>ルナ</span>
          </h1>
          <p style={{ fontSize: 13, color: '#7888b8', lineHeight: 1.8 }}>
            星座と数秘術で転職タイミングを鑑定する、
            <br />
            AIベースの転職占いサービスです。
          </p>
        </div>

        {/* 区切り線 */}
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #2a3f72, transparent)',
            marginBottom: 40,
          }}
        />

        {/* ルナについて */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 16,
              fontWeight: 700,
              color: '#f0c060',
              marginBottom: 16,
              letterSpacing: 1,
            }}
          >
            🌙 転職占い師ルナとは
          </h2>
          <p style={{ fontSize: 13, color: '#b8c4e8', lineHeight: 1.9 }}>
            ルナは、転職を迷う方の背中をそっと押すために生まれたAI占い師です。
            太陽星座・月星座・本命星（九星気学）、そしてMBTIを組み合わせた独自の鑑定で、
            あなたの転職タイミングと向いている方向性を星の言葉で伝えます。
          </p>
        </section>

        {/* サービス比較 */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 16,
              fontWeight: 700,
              color: '#f0c060',
              marginBottom: 20,
              letterSpacing: 1,
            }}
          >
            ✦ 診断メニュー
          </h2>

          {/* 簡易診断カード */}
          <Link
            href="/shindan"
            style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}
          >
            <div
              style={{
                background: '#0d1428',
                border: '1px solid #2a3f72',
                borderRadius: 12,
                padding: '20px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span
                  style={{
                    background: '#3cc4a8',
                    color: '#042018',
                    fontWeight: 800,
                    fontSize: 10,
                    letterSpacing: 1,
                    padding: '2px 8px',
                    borderRadius: 3,
                  }}
                >
                  FREE
                </span>
                <span style={{ color: '#f0f4ff', fontWeight: 700, fontSize: 15 }}>簡易転職診断</span>
              </div>
              <ul style={{ fontSize: 12, color: '#8898c8', lineHeight: 2, paddingLeft: 16, margin: 0 }}>
                <li>誕生日と5問の質問で転職スコアを算出</li>
                <li>転職タイミング・相性サービスを星座で判定</li>
                <li>1日1回・毎日0時に更新</li>
              </ul>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 12,
                  color: '#c8952a',
                  fontWeight: 700,
                  textAlign: 'right',
                }}
              >
                診断する →
              </div>
            </div>
          </Link>

          {/* 精密鑑定カード */}
          <Link
            href="/premium"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                background: '#0d1428',
                border: '1px solid #4a3f72',
                borderRadius: 12,
                padding: '20px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #c8952a, #e0a830)',
                    color: '#1a0c00',
                    fontWeight: 800,
                    fontSize: 10,
                    letterSpacing: 1,
                    padding: '2px 8px',
                    borderRadius: 3,
                  }}
                >
                  PREMIUM
                </span>
                <span style={{ color: '#f0f4ff', fontWeight: 700, fontSize: 15 }}>精密転職鑑定</span>
              </div>
              <ul style={{ fontSize: 12, color: '#8898c8', lineHeight: 2, paddingLeft: 16, margin: 0 }}>
                <li>太陽星座・月星座・本命星の3軸で深掘り鑑定</li>
                <li>MBTIと星座の相性から向いている職種を診断</li>
                <li>転職エージェント推薦・3ヶ月アドバイス付き</li>
              </ul>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 12,
                  color: '#a898f8',
                  fontWeight: 700,
                  textAlign: 'right',
                }}
              >
                詳しく見る →
              </div>
            </div>
          </Link>
        </section>

        {/* 鑑定の流れ */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 16,
              fontWeight: 700,
              color: '#f0c060',
              marginBottom: 20,
              letterSpacing: 1,
            }}
          >
            ✦ 鑑定の流れ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { step: '01', text: '誕生日・ニックネームを入力' },
              { step: '02', text: '5つの質問に答える' },
              { step: '03', text: 'AIが星座データを解析' },
              { step: '04', text: 'あなただけの鑑定文が完成' },
            ].map(({ step, text }) => (
              <div
                key={step}
                style={{ display: 'flex', alignItems: 'center', gap: 14 }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#c8952a',
                    letterSpacing: 1,
                    minWidth: 24,
                  }}
                >
                  {step}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: 'linear-gradient(90deg, #c8952a44, transparent)',
                    marginRight: 8,
                  }}
                />
                <span style={{ fontSize: 13, color: '#b8c4e8' }}>{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 区切り線 */}
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #2a3f72, transparent)',
            marginBottom: 32,
          }}
        />

        {/* CTA */}
        <Link
          href="/shindan"
          style={{
            display: 'block',
            width: '100%',
            padding: 16,
            background: 'linear-gradient(135deg, #c8952a, #e0a830)',
            borderRadius: 12,
            color: '#1a0c00',
            fontSize: 15,
            fontWeight: 700,
            textAlign: 'center',
            textDecoration: 'none',
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          ✨ 無料で転職診断する →
        </Link>
        <Link
          href="/premium"
          style={{
            display: 'block',
            width: '100%',
            padding: 14,
            background: 'transparent',
            border: '1px solid #4a3f72',
            borderRadius: 12,
            color: '#a898f8',
            fontSize: 14,
            fontWeight: 700,
            textAlign: 'center',
            textDecoration: 'none',
            letterSpacing: 1,
          }}
        >
          💎 精密鑑定を見る →
        </Link>
      </div>
    </main>
  )
}
