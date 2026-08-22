import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("ZER NIO EVENT:", JSON.stringify(body, null, 2))

    if (body?.event === "message.received") {
      const text = body?.message?.text
      const conversationId = body?.conversation?.id

      console.log("TEXT:", text)
      console.log("CONVERSATION:", conversationId)

      if (text === "999") {

        const response = await fetch(
          `https://zernio.com/api/v1/inbox/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
            },
            body: JSON.stringify({
              text: " ✅🔴محصول تستی شماره 999 آماده است",
            }),
          }
        )

        const result = await response.json()

        console.log("ZERNIO SEND RESULT:", result)
      }
    }

    return NextResponse.json({
      success: true,
    })

  } catch (error: any) {

    console.error("WEBHOOK ERROR:", error)

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    )
  }
}
