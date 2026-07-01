import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { verifyN8nApiKey } from '@/lib/n8nAuth'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(req: NextRequest) {
  if (!verifyN8nApiKey(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const contentType = req.headers.get('content-type') || ''
  let buffer: ArrayBuffer
  let mimeType: string

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData().catch(() => null)
    const file = formData?.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file が指定されていません' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: '画像ファイル（jpeg/png/webp/gif）のみアップロードできます' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'ファイルサイズは5MB以下にしてください' }, { status: 400 })
    }
    buffer = await file.arrayBuffer()
    mimeType = file.type
  } else {
    const body = await req.json().catch(() => null)
    const imageUrl = body?.image_url
    if (typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'multipart/form-data の file、または JSON の image_url を指定してください' }, { status: 400 })
    }
    const fetched = await fetch(imageUrl).catch(() => null)
    if (!fetched || !fetched.ok) {
      return NextResponse.json({ error: '画像URLの取得に失敗しました' }, { status: 400 })
    }
    mimeType = fetched.headers.get('content-type') ?? 'image/jpeg'
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: '画像ファイル（jpeg/png/webp/gif）のみ対応しています' }, { status: 400 })
    }
    buffer = await fetched.arrayBuffer()
    if (buffer.byteLength > MAX_SIZE) {
      return NextResponse.json({ error: 'ファイルサイズは5MB以下にしてください' }, { status: 400 })
    }
  }

  const ext = mimeType.split('/')[1] ?? 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabaseAdmin.storage
    .from('article-images')
    .upload(path, buffer, { contentType: mimeType, upsert: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data } = supabaseAdmin.storage.from('article-images').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
