'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'ログインに失敗しました')
        setLoading(false)
        return
      }
      const next = searchParams.get('next') || '/admin/articles'
      router.push(next)
      router.refresh()
    } catch {
      setError('通信エラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#070c1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#0d1428',
          border: '1px solid #2a3f72',
          borderRadius: 12,
          padding: 28,
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8952a', marginBottom: 6 }}>
          ✦ ADMIN
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f0f4ff', marginBottom: 20 }}>
          管理画面ログイン
        </h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          autoFocus
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 8,
            border: '1px solid #2a3f72',
            background: '#070c1a',
            color: '#f0f4ff',
            fontSize: 14,
            marginBottom: 14,
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <div style={{ color: '#ff8080', fontSize: 12, marginBottom: 14 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || password.length === 0}
          style={{
            width: '100%',
            padding: 13,
            borderRadius: 8,
            border: 'none',
            background: loading ? '#5a4a20' : 'linear-gradient(135deg, #c8952a, #e0a830)',
            color: '#1a0c00',
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'ログイン中…' : 'ログイン'}
        </button>
      </form>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
