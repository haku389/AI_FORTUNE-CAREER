import Link from 'next/link'
import type { ArticlePreview } from '@/lib/articleRecommend'

export default function RecommendedArticles({ articles }: { articles: ArticlePreview[] }) {
  if (articles.length === 0) return null

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, letterSpacing: 3, color: '#a898f8', marginBottom: 14, textAlign: 'center' }}>
        ✦ あなたへのおすすめ記事
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/column/${a.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#0d1428',
              border: '1px solid #2a3f72',
              borderRadius: 10,
              padding: 12,
              textDecoration: 'none',
            }}
          >
            {a.eyecatch_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={a.eyecatch_url}
                alt=""
                style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
              />
            )}
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: '#f0f4ff',
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {a.title}
              </div>
              <div style={{ color: '#7888b8', fontSize: 11 }}>続きを読む →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
