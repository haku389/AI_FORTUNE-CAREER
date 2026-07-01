import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// service_role キーを使うサーバー専用クライアント。
// /api/admin/* と /column 配下のページからのみ使用すること（クライアントに渡さない）。
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})

export type SeoArticle = {
  id: string
  title: string
  slug: string
  meta_description: string | null
  body_md: string
  eyecatch_url: string | null
  tags: string[]
  status: 'draft' | 'scheduled' | 'published'
  scheduled_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}
