import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PenLine, HelpCircle, Telescope, Moon } from 'lucide-react'
import Stars from '@/components/Stars'

export const metadata: Metadata = {
  title: '転職占い師ルナ | 星座×転職診断サービス',
  description: '転職占い師ルナが、あなたの転職タイミングを星座で鑑定。無料の簡易占いから4軸分析の精密占いまで。',
}

const ICON_COLOR = '#c8952a'
const ICON_SIZE = 20

export default function InfoPage() {
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
            ✦ Official Site
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 'clamp(38px, 10vw, 52px)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 6,
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ color: '#f0c060' }}>転職占い師</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #f0f4ff, #a898f8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ルナ
            </span>
          </h1>

          <p style={{ fontSize: 11, letterSpacing: 4, color: '#5a6a9a', marginBottom: 28 }}>
            Luna — Career Fortune Teller
          </p>

          <p style={{ fontSize: 14, color: '#8898c8', lineHeight: 2, marginBottom: 36 }}>
            転職するか迷っているすべての人へ。
            <br />
            星の声があなたの背中をそっと押します。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link
              href="/shindan"
              style={{
                display: 'block',
                padding: '15px 0',
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
              ✨ 無料で転職占いする →
            </Link>
            <Link
              href="/premium"
              style={{
                display: 'block',
                padding: '13px 0',
                background: 'transparent',
                border: '1px solid #4a3f72',
                borderRadius: 10,
                color: '#a898f8',
                fontSize: 13,
                fontWeight: 700,
                textAlign: 'center',
                textDecoration: 'none',
                letterSpacing: 1,
              }}
            >
              💎 精密占いを見る →
            </Link>
          </div>
        </div>
      </div>

      {/* ── ABOUT LUNA ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #2a3f72)' }} />
          <span style={{ fontSize: 10, letterSpacing: 4, color: '#5a6a9a', whiteSpace: 'nowrap' }}>ABOUT</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2a3f72, transparent)' }} />
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #0d1428, #12102a)',
            border: '1px solid #2a3f72',
            borderRadius: 16,
            padding: '24px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '2px solid #7c6bdc',
                boxShadow: '0 0 20px #7c6bdc44',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Image
                src="/luna_main.png"
                alt="転職占い師ルナ"
                width={60}
                height={60}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mincho)', color: '#f0f4ff', marginBottom: 4 }}>
                ルナ（Luna）
              </div>
              <div style={{ fontSize: 11, color: '#7888b8', letterSpacing: 2 }}>AI転職占い師</div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: '#b0bcd8', lineHeight: 2, marginBottom: 16 }}>
            転職するか迷っている方に向けて、星座・数秘・MBTIを
            組み合わせた独自の鑑定で「今あなたに必要なこと」を
            星の言葉で伝えます。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: '専門', value: '転職タイミング・キャリア鑑定' },
              { label: '鑑定手法', value: '西洋占星術・九星気学・MBTI分析' },
              { label: '特徴', value: '星座の特性と今の運気を組み合わせ、転職の「時期」と「方向性」を具体的に示す' },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '8px 0',
                  borderTop: '1px solid #1a2444',
                  fontSize: 12,
                }}
              >
                <span style={{ color: '#c8952a', minWidth: 60, fontWeight: 700, flexShrink: 0 }}>{label}</span>
                <span style={{ color: '#8898c8' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #2a3f72)' }} />
          <span style={{ fontSize: 10, letterSpacing: 4, color: '#5a6a9a', whiteSpace: 'nowrap' }}>SERVICES</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2a3f72, transparent)' }} />
        </div>

        {/* 簡易占い */}
        <Link href="/shindan" style={{ textDecoration: 'none', display: 'block', marginBottom: 14 }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0d1428, #0a1a2e)',
              border: '1px solid #2a4060',
              borderRadius: 14,
              padding: '22px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #3cc4a8, transparent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span
                  style={{
                    background: '#3cc4a8',
                    color: '#042018',
                    fontWeight: 800,
                    fontSize: 9,
                    letterSpacing: 2,
                    padding: '3px 8px',
                    borderRadius: 3,
                    display: 'inline-block',
                    marginBottom: 8,
                  }}
                >
                  FREE
                </span>
                <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-serif)', color: '#f0f4ff' }}>
                  簡易転職占い
                </div>
              </div>
              <span style={{ fontSize: 22 }}>⭐</span>
            </div>
            <ul style={{ fontSize: 12, color: '#7888b8', lineHeight: 2.2, paddingLeft: 0, margin: '0 0 14px', listStyle: 'none' }}>
              {['星座で転職タイミングを判定', 'たった5問・約2分で完了', '1日1回 / 毎日0時リセット'].map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#3cc4a8', fontSize: 10 }}>✦</span>{t}
                </li>
              ))}
            </ul>
            <div style={{ fontSize: 12, color: '#3cc4a8', fontWeight: 700, textAlign: 'right' }}>
              今すぐ占う →
            </div>
          </div>
        </Link>

        {/* 精密占い */}
        <Link href="/premium" style={{ textDecoration: 'none', display: 'block' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #120a28, #0d1428)',
              border: '1px solid #4a3f72',
              borderRadius: 14,
              padding: '22px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #c8952a, #a855f7, transparent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #c8952a, #e0a830)',
                    color: '#1a0c00',
                    fontWeight: 800,
                    fontSize: 9,
                    letterSpacing: 2,
                    padding: '3px 8px',
                    borderRadius: 3,
                    display: 'inline-block',
                    marginBottom: 8,
                  }}
                >
                  PREMIUM
                </span>
                <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-serif)', color: '#f0f4ff' }}>
                  精密転職占い
                </div>
              </div>
              <span style={{ fontSize: 22 }}>🔮</span>
            </div>
            <ul style={{ fontSize: 12, color: '#7888b8', lineHeight: 2.2, paddingLeft: 0, margin: '0 0 14px', listStyle: 'none' }}>
              {['太陽・月・本命星の3軸で深掘り鑑定', 'MBTI×星座の相性で職種を診断', '転職エージェント推薦 + 3ヶ月指針'].map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#c8952a', fontSize: 10 }}>✦</span>{t}
                </li>
              ))}
            </ul>
            <div style={{ fontSize: 12, color: '#a898f8', fontWeight: 700, textAlign: 'right' }}>
              精密占いを見る →
            </div>
          </div>
        </Link>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #2a3f72)' }} />
          <span style={{ fontSize: 10, letterSpacing: 4, color: '#5a6a9a', whiteSpace: 'nowrap' }}>HOW IT WORKS</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2a3f72, transparent)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            {
              num: '01',
              icon: <PenLine size={ICON_SIZE} color={ICON_COLOR} strokeWidth={1.5} />,
              title: '生年月日を伝える',
              desc: 'ニックネーム・誕生日・性別を教えてください。精密鑑定は出生時刻・MBTIも。',
            },
            {
              num: '02',
              icon: <HelpCircle size={ICON_SIZE} color={ICON_COLOR} strokeWidth={1.5} />,
              title: '心の声を打ち明ける',
              desc: '今の仕事や転職への気持ちをルナに打ち明けてください。',
            },
            {
              num: '03',
              icon: <Telescope size={ICON_SIZE} color={ICON_COLOR} strokeWidth={1.5} />,
              title: '星々が交差する',
              desc: 'あなたの太陽星座・月星座・本命星が、天球の上で静かに重なり合います。',
            },
            {
              num: '04',
              icon: <Moon size={ICON_SIZE} color={ICON_COLOR} strokeWidth={1.5} />,
              title: 'ルナが星を読み解く',
              desc: '星々の声をルナが紡ぎ、あなただけの転職運命をお伝えします。',
            },
          ].map(({ num, icon, title, desc }, i, arr) => (
            <div key={num} style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a0d3a, #0d1428)',
                    border: '1px solid #4a3f72',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 1, flex: 1, minHeight: 24, background: 'linear-gradient(#4a3f72, transparent)', margin: '4px 0' }} />
                )}
              </div>
              <div style={{ paddingBottom: 28 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: '#c8952a', marginBottom: 4 }}>STEP {num}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: '#7888b8', lineHeight: 1.8 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER CTA ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 56px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1a0d3a, #0d1428)',
            border: '1px solid #2a3f72',
            borderRadius: 16,
            padding: '28px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 12 }}>✦</div>
          <p
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 16,
              color: '#f0f4ff',
              lineHeight: 1.8,
              marginBottom: 20,
            }}
          >
            星はいつも、あなたの
            <br />
            転職タイミングを知っています。
          </p>
          <Link
            href="/shindan"
            style={{
              display: 'block',
              padding: '14px 0',
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
            ✨ 無料で今すぐ占う →
          </Link>
        </div>
      </div>
    </div>
  )
}
