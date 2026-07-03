'use client'

import { useEffect, useRef } from 'react'

function track(articleId: string, eventType: string, ctaTarget?: string, value?: number) {
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ article_id: articleId, event_type: eventType, cta_target: ctaTarget, value }),
    keepalive: true,
  }).catch(() => {})
}

const SCROLL_THRESHOLDS: [number, string][] = [
  [0.25, 'scroll_25'],
  [0.5, 'scroll_50'],
  [0.75, 'scroll_75'],
  [0.99, 'scroll_100'],
]

export default function ArticleAnalytics({ articleId }: { articleId: string }) {
  const firedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    track(articleId, 'view')
    const mountedAt = Date.now()
    let dwellSent = false
    const sendDwell = () => {
      if (dwellSent) return
      dwellSent = true
      const seconds = Math.round((Date.now() - mountedAt) / 1000)
      if (seconds > 0) track(articleId, 'dwell_time', undefined, seconds)
    }

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 1
      for (const [threshold, eventType] of SCROLL_THRESHOLDS) {
        if (ratio >= threshold && !firedRef.current.has(eventType)) {
          firedRef.current.add(eventType)
          track(articleId, eventType)
        }
      }
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendDwell()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pagehide', sendDwell)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', sendDwell)
      sendDwell()
    }
  }, [articleId])

  return null
}
