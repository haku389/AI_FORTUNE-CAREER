import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// タイミングラベル
const TIMING_LABELS: Record<string, { text: string; color: string }> = {
  now: { text: '今すぐ転職を', color: '#ffa040' },
  '3m': { text: '3ヶ月以内が吉', color: '#f0c060' },
  '6m': { text: '半年後が転機', color: '#a898f8' },
  wait: { text: 'じっくり準備を', color: '#3cc4a8' },
}

const TYPE_LABELS: Record<string, string> = {
  career: 'キャリアアップ型',
  env: '環境改善型',
  calling: 'やりがい追求型',
  stable: '安定・待遇型',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const zodiacEn = searchParams.get('zodiac') || ''
  const zodiacName = searchParams.get('zodiacName') || ''
  const score = searchParams.get('score') || ''
  const timing = searchParams.get('timing') || ''
  const type = searchParams.get('type') || ''

  const isPersonalized = !!score && !!timing

  const timingData = TIMING_LABELS[timing] || null
  const typeLabel = TYPE_LABELS[type] || ''

  // Noto Sans JP フォント (fontsourceのWOFF1サブセット - 複数フォントとしてフォールバック)
  const fontsourceDir = path.join(process.cwd(), 'node_modules/@fontsource/noto-sans-jp/files')
  // 日本語文字をカバーするサブセットを並列読み込み
  const subsetIndices = Array.from({ length: 30 }, (_, i) => i)
  const fontBuffers = await Promise.all(
    subsetIndices.map(i =>
      readFile(path.join(fontsourceDir, `noto-sans-jp-${i}-700-normal.woff`)).catch(() => null)
    )
  )
  const validFonts = fontBuffers
    .filter(Boolean)
    .map((data, i) => ({
      name: 'Noto Sans JP',
      data: data as Buffer,
      style: 'normal' as const,
      weight: 700 as const,
    }))

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#060914',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: '"Noto Sans JP"',
          overflow: 'hidden',
        }}
      >
        {/* 背景グラデーション */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 60% at 50% 20%, #1a0d3a, transparent), radial-gradient(ellipse 50% 60% at 80% 70%, #0a1a3a, transparent)',
            display: 'flex',
          }}
        />

        {/* 星ドット */}
        {[
          [80, 60], [200, 120], [350, 40], [500, 90], [700, 50], [900, 130],
          [1050, 70], [1150, 40], [150, 300], [400, 250], [650, 280], [950, 260],
          [1100, 320], [50, 450], [300, 480], [600, 500], [850, 460], [1120, 500],
        ].map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              borderRadius: '50%',
              background: i % 5 === 0 ? '#c8952a' : '#a0b0d8',
              opacity: 0.6 + (i % 4) * 0.1,
              display: 'flex',
            }}
          />
        ))}

        {/* ロゴ行 */}
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: 60,
            fontSize: 14,
            letterSpacing: 4,
            color: '#c8952a',
            border: '1px solid #c8952a55',
            background: '#c8952a0c',
            padding: '5px 14px',
            borderRadius: 3,
            display: 'flex',
          }}
        >
          ✦ 転職占い師ルナ presents
        </div>

        {isPersonalized ? (
          /* ─── パーソナライズ結果カード ─── */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
            }}
          >
            {/* 星座 */}
            <div style={{ lineHeight: 1, marginBottom: 8, display: 'flex' }}>
              {zodiacEn ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${BASE_URL}/assets/img/${zodiacEn}.png`}
                  alt={zodiacName}
                  width={90}
                  height={90}
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div style={{ fontSize: 80, display: 'flex' }}>🔮</div>
              )}
            </div>

            {/* スコア大表示 */}
            <div
              style={{
                fontSize: 90,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #c8952a, #f0c060)',
                backgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1,
                marginBottom: 4,
                display: 'flex',
              }}
            >
              {score}
              <span style={{ fontSize: 36, alignSelf: 'flex-end', marginBottom: 14, color: '#c8952a', display: 'flex' }}>
                点
              </span>
            </div>

            {/* 星座名 + タイプ */}
            <div
              style={{
                fontSize: 22,
                color: '#a898f8',
                fontWeight: 700,
                marginBottom: 16,
                display: 'flex',
                gap: 12,
              }}
            >
              {zodiacName && <span>{zodiacName}</span>}
              {typeLabel && <span style={{ color: '#7888b8' }}>×</span>}
              {typeLabel && <span>{typeLabel}</span>}
            </div>

            {/* タイミングバッジ */}
            {timingData && (
              <div
                style={{
                  padding: '8px 24px',
                  borderRadius: 30,
                  fontSize: 20,
                  fontWeight: 700,
                  color: timingData.color,
                  border: `2px solid ${timingData.color}66`,
                  background: `${timingData.color}18`,
                  display: 'flex',
                }}
              >
                {timingData.text}
              </div>
            )}
          </div>
        ) : (
          /* ─── デフォルトブランディング ─── */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
            }}
          >
            <div style={{ fontSize: 90, lineHeight: 1, marginBottom: 20, display: 'flex' }}>
              🌙
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #f0c060, #c8952a)',
                backgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.15,
                marginBottom: 16,
                display: 'flex',
              }}
            >
              転職運命診断
            </div>
            <div
              style={{
                fontSize: 22,
                color: '#7888b8',
                marginBottom: 28,
                display: 'flex',
              }}
            >
              誕生日と5問で、転職タイミングを星座が答える
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
              }}
            >
              {['🔮 たった5問', '⚡ 2分で完了', '🌟 無料診断'].map((t) => (
                <div
                  key={t}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    fontSize: 16,
                    color: '#dde4f8',
                    background: '#0d1428',
                    border: '1px solid #2a3f72',
                    display: 'flex',
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* フッター */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            right: 60,
            fontSize: 16,
            color: '#3a4870',
            display: 'flex',
            gap: 8,
          }}
        >
          転職運命診断 | AI占い師ルナ @hoshiyomi_luna
        </div>

        {/* ゴールドボーダー */}
        <div
          style={{
            position: 'absolute',
            inset: 12,
            borderRadius: 16,
            border: '1px solid #c8952a22',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: validFonts,
    },
  )
}
