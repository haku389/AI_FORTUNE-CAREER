import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin, type SeoArticle } from '@/lib/supabaseAdmin'
import { ADMIN_COOKIE_NAME, verifySessionCookie } from '@/lib/adminAuth'
import AdminHeader from '../AdminHeader'

export const dynamic = 'force-dynamic'

export default async function AdminArticlesPage() {
  const cookieStore = await cookies()
  const authed = await verifySessionCookie(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!authed) {
    redirect('/admin/login')
  }

  const { data, error } = await supabaseAdmin
    .from('seo_articles')
    .select('*')
    .order('updated_at', { ascending: false })

  const articles = (data ?? []) as SeoArticle[]

  return (
    <div style={{ minHeight: '100dvh', background: '#070c1a', padding: '32px 20px', maxWidth: 860, margin: '0 auto' }}>
      <AdminHeader title="" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Link
          href="/admin/articles/new"
          style={{
            background: 'linear-gradient(135deg, #c8952a, #e0a830)',
            color: '#1a0c00',
            fontSize: 13,
            fontWeight: 700,
            padding: '10px 18px',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          + 新規作成
        </Link>
      </div>

      {error && (
        <div style={{ color: '#ff8080', fontSize: 13, marginBottom: 16 }}>
          読み込みエラー: {error.message}
        </div>
      )}

      {articles.length === 0 ? (
        <div style={{ color: '#7888b8', fontSize: 13, textAlign: 'center', padding: '60px 0' }}>
          まだ記事がありません。
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/admin/articles/${a.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                background: '#0d1428',
                border: '1px solid #2a3f72',
                borderRadius: 10,
                padding: '14px 16px',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                {a.eyecatch_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.eyecatch_url}
                    alt=""
                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: '#f0f4ff', fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.title}
                  </div>
                  <div style={{ color: '#5a6a9a', fontSize: 11 }}>
                    /column/{a.slug} ・ 更新: {new Date(a.updated_at).toLocaleString('ja-JP')}
                    {a.status === 'scheduled' && a.scheduled_at && ` ・ 公開予定: ${new Date(a.scheduled_at).toLocaleString('ja-JP')}`}
                    {a.tags.length > 0 && ` ・ ${a.tags.join(', ')}`}
                  </div>
                </div>
              </div>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 4,
                  letterSpacing: 1,
                  background: a.status === 'published' ? '#3cc4a822' : a.status === 'scheduled' ? '#a898f822' : '#7888b822',
                  color: a.status === 'published' ? '#3cc4a8' : a.status === 'scheduled' ? '#a898f8' : '#7888b8',
                  border: `1px solid ${a.status === 'published' ? '#3cc4a855' : a.status === 'scheduled' ? '#a898f855' : '#7888b855'}`,
                }}
              >
                {a.status === 'published' ? '公開中' : a.status === 'scheduled' ? '予約中' : '下書き'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
