import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const score = searchParams.get('score') ?? '??'
  const zodiacName = searchParams.get('zodiacName') ?? ''
  const moonSign = searchParams.get('moonSign') ?? ''
  const timing = searchParams.get('timing') ?? ''

  const timingText: Record<string, string> = {
    now:  '⚡ 今すぐが転職の好機',
    '3m': '🌕 3ヶ月以内が好機',
    '6m': '🌙 半年後に波が来る',
    wait: '🌱 充電・準備の時期',
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #060914 0%, #0d1428 50%, #060914 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: '#f0f4ff',
          padding: 60,
        }}
      >
        <div style={{ fontSize: 18, color: '#c8952a', letterSpacing: 4, marginBottom: 20 }}>
          ✦ AI占い師ルナ 精密転職鑑定
        </div>
        <div style={{ fontSize: 28, color: '#a898f8', marginBottom: 16 }}>
          {zodiacName} × 月: {moonSign}
        </div>
        <div style={{ fontSize: 100, fontWeight: 900, color: '#f0c060', lineHeight: 1 }}>
          {score}点
        </div>
        <div style={{ fontSize: 26, color: '#dde4f8', marginTop: 16, marginBottom: 24 }}>
          転職精密スコア
        </div>
        <div style={{
          fontSize: 22, color: '#f0f4ff',
          background: '#1e2d52',
          padding: '12px 32px',
          borderRadius: 8,
          border: '1px solid #2a3f72',
        }}>
          {timingText[timing] ?? '🔮 精密鑑定済み'}
        </div>
        <div style={{ fontSize: 16, color: '#7888b8', marginTop: 28 }}>
          あなたも精密鑑定を受けてみて →
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
