import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin, type SeoArticle } from '@/lib/supabaseAdmin'
import { ADMIN_COOKIE_NAME, verifySessionCookie } from '@/lib/adminAuth'
import { getStatsByArticleId } from '@/lib/articleAnalytics'
import AdminHeader from '../AdminHeader'
import ArticleListTable from './ArticleListTable'

export const dynamic = 'force-dynamic'

export default async function AdminArticlesPage() {
  const cookieStore = await cookies()
  const authed = await verifySessionCookie(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!authed) {
    redirect('/admin/login')
  }

  const [{ data, error }, statsByArticleId] = await Promise.all([
    supabaseAdmin.from('seo_articles').select('*').order('updated_at', { ascending: false }),
    getStatsByArticleId(),
  ])

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
        <ArticleListTable articles={articles} statsByArticleId={statsByArticleId} />
      )}
    </div>
  )
}
