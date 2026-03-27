'use client'

import { useEffect, useState } from 'react'

export default function ScoreRing({ score }: { score: number }) {
  const [current, setCurrent] = useState(0)
  const r = 38
  const circumference = 2 * Math.PI * r

  useEffect(() => {
    let cur = 0
    const step = () => {
      cur = Math.min(cur + 1, score)
      setCurrent(cur)
      if (cur < score) requestAnimationFrame(step)
    }
    const t = setTimeout(() => requestAnimationFrame(step), 300)
    return () => clearTimeout(t)
  }, [score])

  const offset = circumference - (circumference * current) / 100

  return (
    <div className="relative flex-shrink-0" style={{ width: 90, height: 90 }}>
      <svg
        width="90"
        height="90"
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
      >
        <circle cx="45" cy="45" r={r} fill="none" strokeWidth="6" stroke="#1e2d52" />
        <circle
          cx="45"
          cy="45"
          r={r}
          fill="none"
          strokeWidth="6"
          stroke="#f0c060"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'none' }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: 26,
            fontWeight: 900,
            color: '#f0c060',
            lineHeight: 1,
          }}
        >
          {current}
        </span>
        <span style={{ fontSize: 8, color: '#7888b8', letterSpacing: 1 }}>転職運</span>
      </div>
    </div>
  )
}
