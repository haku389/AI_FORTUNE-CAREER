import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  // 1. 環境変数チェック
  if (!url || !key) {
    return NextResponse.json({
      step: 'env_check',
      ok: false,
      error: `Missing: ${!url ? 'NEXT_PUBLIC_SUPABASE_URL' : ''} ${!key ? 'SUPABASE_SERVICE_ROLE_KEY' : ''}`.trim(),
    })
  }

  const supabase = createClient(url, key)

  // 2. テーブル存在確認
  const { error: tableError } = await supabase
    .from('precise_diagnoses')
    .select('id')
    .limit(1)

  if (tableError) {
    return NextResponse.json({
      step: 'table_check',
      ok: false,
      error: tableError.message,
      code: tableError.code,
      url_prefix: url.slice(0, 30) + '...',
    })
  }

  // 3. テスト挿入
  const { data, error: insertError } = await supabase
    .from('precise_diagnoses')
    .insert({
      nickname: '__test__',
      birthday: '1990-01-01',
      zodiac_sun: '山羊座',
      answers: { test: true },
    })
    .select('id')
    .single()

  if (insertError) {
    return NextResponse.json({
      step: 'insert_check',
      ok: false,
      error: insertError.message,
      code: insertError.code,
    })
  }

  // テストデータを削除
  await supabase.from('precise_diagnoses').delete().eq('id', data.id)

  return NextResponse.json({
    step: 'all_ok',
    ok: true,
    message: 'Supabase接続・テーブル・挿入 すべて正常',
    url_prefix: url.slice(0, 30) + '...',
  })
}
