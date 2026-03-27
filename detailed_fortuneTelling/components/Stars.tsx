'use client'

import { useEffect, useState } from 'react'

type Star = {
  left: number
  top: number
  size: number
  mn: number
  mx: number
  duration: number
  delay: number
}

export default function Stars() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(
      Array.from({ length: 80 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        mn: Math.random() * 0.3 + 0.05,
        mx: Math.random() * 0.6 + 0.4,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 5,
      })),
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              '--mn': s.mn,
              '--mx': s.mx,
              animation: `tw ${s.duration}s ease-in-out infinite ${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
