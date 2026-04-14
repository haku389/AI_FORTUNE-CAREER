import type { Metadata } from 'next'
import Link from 'next/link'
import Stars from '@/components/Stars'
import MoonImage from '@/components/MoonImage'

export const metadata: Metadata = {
  title: '精密転職鑑定 | 転職占い師ルナ',
  description: '太陽星座・月星座・本命星・MBTIの4軸で、あなたの転職運命を深く読み解く精密鑑定。',
}

export default function PremiumLandingPage() {
  return (
    <main
      style={{
        position: 'relative',
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        maxWidth: 430,
        margin: '0 auto',
        padding: '0 18px 40px',
      }}
    >
      <Stars />

      {/* 背景グラデーション（プレミアム：紫系） */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 20%, #2a0d4a, transparent), radial-gradient(ellipse 50% 60% at 80% 70%, #1a0a3a, transparent)',
        }}
      />

      <MoonImage />

      {/* コンテンツ */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ラベル */}
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
            marginBottom: 20,
          }}
        >
          ✦ 転職占い師ルナ presents
        </div>

        {/* 見出し */}
        <h1
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: 'clamp(28px, 7.5vw, 38px)',
            fontWeight: 900,
            lineHeight: 1.15,
            color: '#f0f4ff',
            marginBottom: 14,
            letterSpacing: '0.02em',
          }}
        >
          あなたの転職運命、
          <br />
          <span style={{ color: '#f0c060', display: 'block' }}>星が深く</span>
          読み解く
        </h1>

        {/* コピー */}
        <p style={{ fontSize: 13, color: '#7888b8', lineHeight: 1.9, marginBottom: 32 }}>
          太陽・月・本命星の3つの星とMBTIが交差するとき、
          <br />
          あなただけの転職運命が解き明かされます。
        </p>

        {/* フィーチャーポイント */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
          {[
            { icon: '🌙', text: '太陽星座・月星座・本命星の3軸で深掘り鑑定' },
            { icon: '🔮', text: 'MBTIと星座の相性から向いている職種を診断' },
            { icon: '✨', text: '転職エージェント推薦・3ヶ月アドバイス付き' },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: '#dde4f8' }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* 区切り線 */}
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #5a3f9a, transparent)',
            margin: '0 0 18px',
          }}
        />

        {/* ティアバッジ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            flexWrap: 'wrap',
            background: '#0d1428',
            border: '1px solid #4a3f72',
            borderRadius: 8,
            padding: '8px 14px',
            marginBottom: 18,
            fontSize: 11,
          }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #c8952a, #e0a830)',
              color: '#1a0c00',
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: 1,
              padding: '2px 7px',
              borderRadius: 3,
            }}
          >
            PREMIUM
          </span>
          <span style={{ color: '#f0f4ff', fontWeight: 700, fontSize: 13 }}>精密鑑定</span>
          <span style={{ color: '#3a4870' }}>|</span>
          <span style={{ color: '#7888b8' }}>4軸分析</span>
          <Link
            href="/shindan"
            style={{ marginLeft: 'auto', color: '#a898f8', fontSize: 10, whiteSpace: 'nowrap', textDecoration: 'none' }}
          >
            → 無料の簡易診断はこちら
          </Link>
        </div>

        {/* CTA */}
        <Link
          href="/premium/form"
          style={{
            display: 'block',
            width: '100%',
            padding: 16,
            background: 'linear-gradient(135deg, #7b3fe4, #a855f7)',
            borderRadius: 12,
            color: '#f0f4ff',
            fontSize: 15,
            fontWeight: 700,
            textAlign: 'center',
            textDecoration: 'none',
            letterSpacing: 1,
          }}
        >
          💎 精密診断を受ける →
        </Link>
      </div>
    </main>
  )
}
