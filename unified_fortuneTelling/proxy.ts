import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, verifySessionCookie } from '@/lib/adminAuth'

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value
  const isValid = await verifySessionCookie(cookie)

  if (isValid) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const loginUrl = new URL('/admin/login', req.url)
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}
