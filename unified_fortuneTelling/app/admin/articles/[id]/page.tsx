import { notFound } from 'next/navigation'
import { supabaseAdmin, type SeoArticle } from '@/lib/supabaseAdmin'
import AdminHeader from '../../AdminHeader'
import ArticleForm from '../ArticleForm'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
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
