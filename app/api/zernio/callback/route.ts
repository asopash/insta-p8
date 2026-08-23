import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

  const params = req.nextUrl.searchParams

  console.log("ZERNIO CALLBACK")
  console.log({
    connected: params.get("connected"),
    profileId: params.get("profileId"),
    accountId: params.get("accountId"),
    username: params.get("username"),
  })


  return NextResponse.redirect(
    new URL("/dashboard", req.url)
  )
}
