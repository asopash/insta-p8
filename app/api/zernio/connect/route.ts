import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {

  const zernioUrl = process.env.ZERNIO_CONNECT_URL

  if (!zernioUrl) {
    return NextResponse.json(
      { error: "Missing ZERNIO_CONNECT_URL" },
      { status: 500 }
    )
  }

  return NextResponse.redirect(zernioUrl)
}
