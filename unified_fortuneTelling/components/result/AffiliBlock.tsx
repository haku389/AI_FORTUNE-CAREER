'use client'

import { trackEvent } from '@/lib/gtag'
import { TypeData } from '@/lib/scoring'

export default function AffiliBlock({
  zodiacName,
  typeData,
}: {
  zodiacName: string
  typeData: TypeData
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0d1428, #111c36)',
        border: '1px solid #2a3f72',
        borderRadius: 14,
        padding: '20px 18px',
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 9, letterSpacing: 3, color: '#3cc4a8', marginBottom: 6 }}>
        あなたの星座×タイプに合うサービス
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', marginBottom: 6 }}>
        {zodiacName}×{typeData.name}のあなたへ
      </div>
      <div style={{ fontSize: 12, color: '#7888b8', lineHeight: 1.7, marginBottom: 14 }}>
        {typeData.reason}
      </div>

      <a
        href={typeData.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('affiliate_click', { name: typeData.affili, source: 'shindan' })}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#0a0f1e',
          border: '1px solid #3cc4a844',
          borderRadius: 10,
          padding: '12px 14px',
          textDecoration: 'none',
          transition: 'border-color .2s, transform .2s',
          marginBottom: 8,
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLElement).style.borderColor = '#3cc4a8'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateX(2px)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLElement).style.borderColor = '#3cc4a844'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateX(0)'
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff' }}>
            {typeData.affili}
          </div>
          <div style={{ fontSize: 11, color: '#7888b8' }}>{typeData.desc}</div>
        </div>
        <div style={{ color: '#3cc4a8', fontSize: 14 }}>→</div>
      </a>

      <div style={{ fontSize: 9, color: '#3a4870', marginBottom: 8, textAlign: 'right' }}>
        ※ 広告を含みます
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
          background: '#c8952a08',
          border: '1px solid #c8952a22',
          borderRadius: 8,
          padding: '10px 12px',
        }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>🌙</span>
        <div
          style={{ fontSize: 11, color: '#7888b8', fontStyle: 'italic', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{
            __html: `<span style="color:#f5e0a0">ルナより：</span>${typeData.luna}`,
          }}
        />
      </div>
    </div>
  )
}
