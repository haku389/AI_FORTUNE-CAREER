import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { supabaseAdmin, type SeoArticle } from '@/lib/supabaseAdmin'
import { ADMIN_COOKIE_NAME, verifySessionCookie } from '@/lib/adminAuth'
import AdminHeader from '../../AdminHeader'
import ArticleForm from '../ArticleForm'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const authed = await verifySessionCookie(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!authed) {
    redirect('/admin/login')
  }

  const { id } = await params
  const { data, error } = await supabaseAdmin.from('seo_articles').select('*').eq('id', id).single()

  if (error || !data) {
    notFound()
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#070c1a', padding: '32px 20px', maxWidth: 860, margin: '0 auto' }}>
      <AdminHeader title="編集" />
      <ArticleForm mode="edit" initial={data as SeoArticle} />
    </div>
  )
}
