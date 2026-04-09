import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY
  const diagnosesDbId = process.env.NOTION_DIAGNOSES_DB_ID
  const preciseDbId = process.env.NOTION_PRECISE_DB_ID

  // 1. 環境変数チェック
  if (!apiKey || !diagnosesDbId || !preciseDbId) {
    return NextResponse.json({
      step: 'env_check',
      ok: false,
      missing: {
        NOTION_API_KEY: !apiKey,
        NOTION_DIAGNOSES_DB_ID: !diagnosesDbId,
        NOTION_PRECISE_DB_ID: !preciseDbId,
      },
    })
  }

  // 2. 簡易占いDBへ書き込みテスト
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: diagnosesDbId },
      properties: {
        ニックネーム:   { title:  [{ text: { content: '__test__' } }] },
        性別:           { select: { name: 'その他' } },
        生年月日:       { date:   { start: '1990-01-01' } },
        年齢:           { number: 30 },
        星座:           { select: { name: '山羊座' } },
        転職タイプ:     { select: { name: 'キャリアアップ型' } },
        転職運スコア:   { number: 75 },
        タイミング判定: { select: { name: '今すぐ' } },
        診断日:         { date:   { start: new Date().toISOString().slice(0, 10) } },
      },
    }),
  })

  const body = await res.json()

  if (!res.ok) {
    return NextResponse.json({
      step: 'notion_write',
      ok: false,
      status: res.status,
      error: body,
      db_id_used: diagnosesDbId,
      api_key_prefix: apiKey.slice(0, 10) + '...',
    })
  }

  // テストページを削除
  await fetch(`https://api.notion.com/v1/pages/${body.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({ archived: true }),
  })

  return NextResponse.json({
    step: 'all_ok',
    ok: true,
    message: 'Notion接続・書き込み・削除 すべて正常',
    api_key_prefix: apiKey.slice(0, 10) + '...',
    db_id_used: diagnosesDbId,
  })
}
