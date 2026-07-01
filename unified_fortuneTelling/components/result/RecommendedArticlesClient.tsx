'use client'

import { useEffect, useState } from 'react'
import type { ArticlePreview } from '@/lib/articleRecommend'
import RecommendedArticles from './RecommendedArticles'

export default function RecommendedArticlesClient({ tags }: { tags: string[] }) {
  const [articles, setArticles] = useState<ArticlePreview[]>([])

  useEffect(() => {
    let cancelled = false
    fetch(`/api/articles/recommended?tags=${encodeURIComponent(tags.join(','))}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setArticles(data.articles ?? [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags.join(',')])

  return <RecommendedArticles articles={articles} />
}
