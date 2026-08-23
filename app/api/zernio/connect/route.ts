import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      `https://zernio.com/api/v1/connect/instagram?profileId=${process.env.ZERNIO_PROFILE_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      })
    }

    return NextResponse.redirect(data.authUrl)

  } catch (error:any) {

    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    )
  }
}
