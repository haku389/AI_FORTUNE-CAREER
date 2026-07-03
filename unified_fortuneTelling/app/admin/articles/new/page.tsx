import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE_NAME, verifySessionCookie } from '@/lib/adminAuth'
import AdminHeader from '../../AdminHeader'
import ArticleForm from '../ArticleForm'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  const cookieStore = await cookies()
  const authed = await verifySessionCookie(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!authed) {
    redirect('/admin/login')
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#070c1a', padding: '32px 20px', maxWidth: 860, margin: '0 auto' }}>
      <AdminHeader title="新規作成" />
      <ArticleForm mode="new" />
    </div>
  )
}
