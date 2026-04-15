import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('line_user_id')?.value
  const displayName = req.cookies.get('line_display_name')?.value
  const pictureUrl = req.cookies.get('line_picture_url')?.value

  if (!userId) {
    return NextResponse.json({ connected: false })
  }

  return NextResponse.json({
    connected: true,
    userId,
    displayName: displayName ?? '',
    pictureUrl: pictureUrl ?? '',
  })
}
