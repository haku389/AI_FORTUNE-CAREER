export const ADMIN_COOKIE_NAME = 'admin_session'
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7日

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function computeSessionToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? ''
  const secret = process.env.ADMIN_SESSION_SECRET ?? ''
  return sha256Hex(`${password}:${secret}`)
}

export async function verifyPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD ?? ''
  return expected.length > 0 && input === expected
}

export async function verifySessionCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false
  const expected = await computeSessionToken()
  return expected.length > 0 && value === expected
}
