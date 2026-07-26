import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'データ削除リクエストの状況 | キャリア未来鑑定士 白石玲子',
  robots: { index: false, follow: false },
}

export default async function ThreadsDeletionStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const { code } = await searchParams

  return (
    <div style={{ background: '#060914', minHeight: '100dvh', color: '#dde4f8' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 20px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: 20,
            fontWeight: 900,
            color: '#f0f4ff',
            marginBottom: 16,
          }}
        >
          データ削除リクエストの処理状況
        </h1>
        <p style={{ fontSize: 13, color: '#dde4f8', lineHeight: 1.9, marginBottom: 10 }}>
          本サービス（career-uranai.site）はThreadsアカウント連携において、投稿用アカウント自体の情報以外にユーザー個別のデータを保存していません。リクエストは正常に受理され、対応するデータは保持されていません。
        </p>
        {code && (
          <p style={{ fontSize: 12, color: '#7888b8', marginTop: 24 }}>確認コード: {code}</p>
        )}
      </div>
    </div>
  )
}
