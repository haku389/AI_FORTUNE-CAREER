import AdminHeader from '../../AdminHeader'
import ArticleForm from '../ArticleForm'

export const dynamic = 'force-dynamic'

export default function NewArticlePage() {
  return (
    <div style={{ minHeight: '100dvh', background: '#070c1a', padding: '32px 20px', maxWidth: 860, margin: '0 auto' }}>
      <AdminHeader title="新規作成" />
      <ArticleForm mode="new" />
    </div>
  )
}
