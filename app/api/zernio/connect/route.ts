import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      `https://zernio.com/api/v1/connect/instagram?profileId=${process.env.ZERNIO_PROFILE_ID}&redirect_url=${encodeURIComponent(
        "https://insta-p8.up.railway.app/api/zernio/callback"
      )}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
        },
      }
    )

    const data = await response.json()

    console.log("ZERNIO CONNECT:", data)

    if (!data.authUrl) {
      return NextResponse.json(data, { status: 400 })
    }

    return NextResponse.redirect(data.authUrl)

  } catch (error:any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
