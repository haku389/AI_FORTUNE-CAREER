import type { Metadata } from 'next'
import Link from 'next/link'
import Stars from '@/components/Stars'
import MoonImage from '@/components/MoonImage'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '転職精密鑑定 | AI占い師ルナ',
    openGraph: {
      title: '転職精密鑑定 | AI占い師ルナ',
      description: '太陽星座＋月星座＋本命星×MBTIで、あなた固有の転職タイミング・職種・3ヶ月アドバイスを鑑定。',
      images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630 }],
    },
  }
}

export default function LandingPage() {
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

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 20%, #1a0d3a, transparent), radial-gradient(ellipse 50% 60% at 80% 70%, #0a1a3a, transparent)',
        }}
      />

      <MoonImage />

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
          ✦ AI占い師ルナ presents
        </div>

        {/* 見出し */}
        <h1
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: 'clamp(26px, 7vw, 36px)',
            fontWeight: 900,
            lineHeight: 1.15,
            color: '#f0f4ff',
            marginBottom: 14,
            letterSpacing: '0.02em',
          }}
        >
          あなただけの
          <br />
          <span style={{ color: '#f0c060', display: 'block' }}>精密転職鑑定、</span>
          星が深く読み解く
        </h1>

        <p style={{ fontSize: 13, color: '#7888b8', lineHeight: 1.9, marginBottom: 28 }}>
          太陽星座＋月星座＋本命星×MBTIで、
          <br />
          あなた固有の転職タイミングと天職を鑑定。
        </p>

        {/* 3大アウトプット */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {[
            { icon: '🔮', text: '本命星・月星座を使った深い性格鑑定' },
            { icon: '💼', text: '向いている職種・業界をTOP3で提示' },
            { icon: '📅', text: '今後3ヶ月の行動アドバイス付き' },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: '#dde4f8' }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* 区切り線 */}
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #2a3f72, transparent)',
            margin: '0 0 18px',
          }}
        />

        {/* 価格バッジ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            flexWrap: 'wrap',
            background: '#0d1428',
            border: '1px solid #2a3f72',
            borderRadius: 8,
            padding: '8px 14px',
            marginBottom: 18,
            fontSize: 11,
          }}
        >
          <span
            style={{
              background: '#c8952a',
              color: '#1a0c00',
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: 1,
              padding: '2px 7px',
              borderRadius: 3,
            }}
          >
            ¥480
          </span>
          <span style={{ color: '#f0f4ff', fontWeight: 700, fontSize: 13 }}>精密鑑定</span>
          <span style={{ color: '#3a4870' }}>|</span>
          <span style={{ color: '#7888b8' }}>24問・約5分</span>
          <span style={{ marginLeft: 'auto', color: '#a898f8', fontSize: 10, whiteSpace: 'nowrap' }}>
            Stripe決済対応
          </span>
        </div>

        {/* CTA */}
        <Link
          href="/precise"
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
          }}
        >
          🔮 精密鑑定を受ける →
        </Link>

      </div>
    </main>
  )
}
