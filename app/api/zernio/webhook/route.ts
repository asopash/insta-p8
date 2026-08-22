import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("ZER NIO EVENT:", JSON.stringify(body, null, 2))

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    )
  }
}
