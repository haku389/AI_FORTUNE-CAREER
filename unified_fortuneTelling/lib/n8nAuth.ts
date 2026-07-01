import type { NextRequest } from 'next/server'

/** n8nからのリクエストを `Authorization: Bearer <N8N_API_KEY>` で検証する */
export function verifyN8nApiKey(req: NextRequest): boolean {
  const expected = process.env.N8N_API_KEY
  if (!expected) return false
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  return token.length > 0 && token === expected
}
