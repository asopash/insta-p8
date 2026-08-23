import { NextResponse } from "next/server"

export async function GET() {
  try {
    const profileId = process.env.ZERNIO_PROFILE_ID
    const apiKey = process.env.ZERNIO_API_KEY

    const redirectUrl =
      "https://insta-p8.up.railway.app/api/zernio/callback"

    const url =
  `https://zernio.com/api/v1/connect/instagram` +
  `?profileId=${profileId}` +
  `&redirect_uri=${encodeURIComponent(redirectUrl)}`

    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(data, {
        status: res.status,
      })
    }

    return NextResponse.redirect(data.authUrl)

  } catch (error:any) {
    return NextResponse.json(
      { error: error.message },
      { status:500 }
    )
  }
}
