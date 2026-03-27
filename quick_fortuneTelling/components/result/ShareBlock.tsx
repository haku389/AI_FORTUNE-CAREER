'use client'

import { useState } from 'react'

export default function ShareBlock({
  shareText,
  shareUrl,
}: {
  shareText: string
  shareUrl: string
}) {
  const [copied, setCopied] = useState(false)

  const openX = () => {
    window.open(
      'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText),
      '_blank',
    )
  }

  const openLINE = () => {
    window.open(
      'https://line.me/R/msg/text/?' + encodeURIComponent(shareText),
      '_blank',
    )
  }

  const copyURL = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const btnBase: React.CSSProperties = {
    padding: '9px 16px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all .2s',
    fontFamily: 'var(--font-sans)',
    background: 'transparent',
  }

  return (
    <div
      style={{
        background: '#0d1428',
        border: '1px solid #1e2d52',
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: '#f0f4ff' }}>
        結果をシェアする
      </div>
      <div style={{ fontSize: 12, color: '#7888b8', marginBottom: 16 }}>
        あなたの転職運を友達に教えよう
      </div>
      <div
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <button
          onClick={openX}
          style={{
            ...btnBase,
            borderColor: '#1da1f244',
            color: '#60c8f0',
            background: '#1da1f215',
          }}
        >
          𝕏 でシェア
        </button>
        <button
          onClick={openLINE}
          style={{
            ...btnBase,
            borderColor: '#00b90044',
            color: '#60d880',
            background: '#00b90015',
          }}
        >
          LINEで送る
        </button>
        <button
          onClick={copyURL}
          style={{
            ...btnBase,
            borderColor: '#c8952a44',
            color: '#f0c060',
            background: '#c8952a15',
          }}
        >
          {copied ? '✓ コピーしました' : 'URLをコピー'}
        </button>
      </div>
    </div>
  )
}
