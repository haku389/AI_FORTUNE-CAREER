import { NextRequest, NextResponse } from 'next/server'
import { verifyN8nApiKey } from '@/lib/n8nAuth'
import { TAG_GROUPS } from '@/lib/articleTags'

export async function GET(req: NextRequest) {
  if (!verifyN8nApiKey(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ tagGroups: TAG_GROUPS })
}
