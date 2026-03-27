import type { Metadata } from 'next'
import Link from 'next/link'
import Stars from '@/components/Stars'
import MoonImage from '@/components/MoonImage'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(
  { searchParams }: { searchParams: SearchParams }
): Promise<Metadata> {
  const params = await searchParams
  const score = params.score as string | undefined
  const timing = params.timing as string | undefined
  const zodiac = params.zodiac as string | undefined
  const zodiacName = params.zodiacName as string | undefined
  const type = params.type as string | undefined

  if (score && timing && zodiac) {
    const ogUrl = `${BASE_URL}/api/og?zodiac=${encodeURIComponent(zodiac)}&zodiacName=${encodeURIComponent(zodiacName || '')}&score=${score}&timing=${timing}&type=${type || ''}`
    const title = `転職運スコア${score}点！${zodiacName ? zodiacName + 'の' : ''}転職運命診断`
    return {
      title,
      openGraph: {
        title,
        description: `転職タイミング診断の結果をチェック。あなたも試してみて！`,
        images: [{ url: ogUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        images: [ogUrl],
      },
    }
  }

  return {}
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

      {/* 背景グラデーション */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 20%, #1a0d3a, transparent), radial-gradient(ellipse 50% 60% at 80% 70%, #0a1a3a, transparent)',
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
          ✦ AI占い師ルナ presents
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
          あなたの
          <br />
          <span style={{ color: '#f0c060', display: 'block' }}>転職スコア、</span>
          星が今すぐ診断
        </h1>

        {/* コピー */}
        <p style={{ fontSize: 13, color: '#7888b8', lineHeight: 1.9, marginBottom: 32 }}>
          誕生日と5つの質問から、
          <br />
          今すぐ転職すべきかを星が答えます。
        </p>

        {/* フィーチャーポイント */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
          {[
            { icon: null, text: '転職タイミング・相性サービスを星座で判定' },
            { icon: '⚡', text: 'たった5問・2分で完了' },
            { icon: '🌙', text: '1日1回限定・毎日0時に更新' },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: '#dde4f8' }}
            >
              {icon === null ? (
                <img src="/crystalBall.png" alt="" style={{ width: 22, height: 22, flexShrink: 0 }} />
              ) : (
                <span style={{ fontSize: 18 }}>{icon}</span>
              )}
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

        {/* ティアバッジ */}
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
              background: '#3cc4a8',
              color: '#042018',
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: 1,
              padding: '2px 7px',
              borderRadius: 3,
            }}
          >
            FREE
          </span>
          <span style={{ color: '#f0f4ff', fontWeight: 700, fontSize: 13 }}>簡易診断</span>
          <span style={{ color: '#3a4870' }}>|</span>
          <span style={{ color: '#7888b8' }}>1日1回</span>
          <span style={{ marginLeft: 'auto', color: '#a898f8', fontSize: 10, whiteSpace: 'nowrap' }}>
            → 精密診断はこちらから
          </span>
        </div>

        {/* CTA */}
        <Link
          href="/diagnosis"
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
          ✨ 転職診断する →
        </Link>
      </div>
    </main>
  )
}
