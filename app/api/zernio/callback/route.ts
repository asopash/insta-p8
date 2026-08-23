import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

  const params = req.nextUrl.searchParams

  const connected = params.get("connected")
  const profileId = params.get("profileId")
  const accountId = params.get("accountId")
  const username = params.get("username")


  console.log("ZERNIO CALLBACK", {
    connected,
    profileId,
    accountId,
    username
  })


  if (!profileId || !accountId) {
    return NextResponse.json(
      {
        error: "Missing zernio data",
        profileId,
        accountId
      },
      {
        status:400
      }
    )
  }


  const response = NextResponse.redirect(
  "https://insta-p8.up.railway.app/dashboard"
)


  // ذخیره اتصال کاربر
  response.cookies.set(
    "zernio_session",
    JSON.stringify({
      profileId,
      accountId,
      username,
      platform: connected
    }),
    {
      httpOnly:true,
      secure:true,
      sameSite:"lax",
      path:"/",
      maxAge:60*60*24*30
    }
  )


  return response
}
