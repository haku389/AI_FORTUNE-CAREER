'use client'

import { useEffect, useRef } from 'react'

function track(articleId: string, eventType: string, ctaTarget?: string) {
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ article_id: articleId, event_type: eventType, cta_target: ctaTarget }),
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

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [articleId])

  return null
}
