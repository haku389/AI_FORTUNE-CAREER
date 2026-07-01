import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE, computeSessionToken, verifyPassword } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const password = body?.password

  if (typeof password !== 'string' || !(await verifyPassword(password))) {
    return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 })
  }

  const token = await computeSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  })
  return res
}
