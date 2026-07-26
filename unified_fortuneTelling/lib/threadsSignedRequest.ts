import { createHmac, timingSafeEqual } from 'crypto'

type ThreadsSignedRequestPayload = {
  algorithm: string
  issued_at: number
  expires?: number
  user_id: string
}

/**
 * Meta（Threads/Facebook共通）のdeauthorize/data-deletionコールバックが送る
 * `signed_request`（"<署名>.<ペイロード>" のbase64url）を検証してデコードする。
 * 署名が不正な場合はnullを返す。
 */
export function verifyThreadsSignedRequest(
  signedRequest: string,
  appSecret: string
): ThreadsSignedRequestPayload | null {
  const parts = signedRequest.split('.')
  if (parts.length !== 2) return null
  const [encodedSig, encodedPayload] = parts

  let expectedSig: Buffer
  let actualSig: Buffer
  try {
    actualSig = Buffer.from(encodedSig, 'base64url')
    expectedSig = createHmac('sha256', appSecret).update(encodedPayload).digest()
  } catch {
    return null
  }

  if (actualSig.length !== expectedSig.length || !timingSafeEqual(actualSig, expectedSig)) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'))
    if (typeof payload?.user_id !== 'string') return null
    return payload as ThreadsSignedRequestPayload
  } catch {
    return null
  }
}
