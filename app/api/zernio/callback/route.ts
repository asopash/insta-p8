import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

  const connected = req.nextUrl.searchParams.get("connected")
  const profileId = req.nextUrl.searchParams.get("profileId")
  const accountId = req.nextUrl.searchParams.get("accountId")
  const username = req.nextUrl.searchParams.get("username")

  console.log({
    connected,
    profileId,
    accountId,
    username
  })

  return NextResponse.redirect(
    new URL("/dashboard", req.url)
  )
}
