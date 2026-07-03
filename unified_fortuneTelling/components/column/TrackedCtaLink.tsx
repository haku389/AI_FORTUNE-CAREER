'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'

export default function TrackedCtaLink({
  articleId,
  ctaTarget,
  ...linkProps
}: {
  articleId: string
  ctaTarget: 'quick_diagnosis' | 'detailed_diagnosis'
} & ComponentProps<typeof Link>) {
  return (
    <Link
      {...linkProps}
      onClick={() => {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article_id: articleId, event_type: 'cta_click', cta_target: ctaTarget }),
          keepalive: true,
        }).catch(() => {})
      }}
    />
  )
}
