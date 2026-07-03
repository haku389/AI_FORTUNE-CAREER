'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminHeader({ title }: { title: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingBottom: 14,
        borderBottom: '1px solid #2a3f72',
      }}
    >
      <div>
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8952a', marginBottom: 4 }}>
          ✦ ADMIN
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href="/admin/articles"
            style={{
              color: pathname?.startsWith('/admin/articles') ? '#f0f4ff' : '#7888b8',
              fontSize: 18,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            記事管理
          </Link>
          <Link
            href="/admin/analytics"
            style={{
              color: pathname?.startsWith('/admin/analytics') ? '#f0f4ff' : '#7888b8',
              fontSize: 18,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            アナリティクス
          </Link>
          {title && <span style={{ color: '#5a6a9a', fontSize: 13 }}>/ {title}</span>}
        </div>
      </div>
      <button
        onClick={handleLogout}
        style={{
          background: 'transparent',
          border: '1px solid #2a3f72',
          color: '#a898f8',
          fontSize: 12,
          padding: '7px 14px',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        ログアウト
      </button>
    </div>
  )
}
