import { NextRequest, NextResponse } from "next/server"

const ZERNIO_API_URL = "https://zernio.com/api/v1"

async function sendZernioMessage(
  conversationId: string,
  text: string
) {
  try {
    const response = await fetch(
      `${ZERNIO_API_URL}/inbox/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
        },
        body: JSON.stringify({
          message: text,
        }),
      }
    )

    const data = await response.json()

    console.log(
      "ZERNIO SEND STATUS:",
      response.status
    )

    console.log(
      "ZERNIO SEND RESPONSE:",
      JSON.stringify(data, null, 2)
    )

    return data

  } catch (error) {
    console.error(
      "ZERNIO SEND ERROR:",
      error
    )

    return null
  }
}


export async function POST(request: NextRequest) {
  try {

    const body = await request.json()

    console.log(
      "========== ZERNIO WEBHOOK =========="
    )

    console.log(
      JSON.stringify(body, null, 2)
    )


    if (body?.event !== "message.received") {
      return NextResponse.json({
        success: true,
        ignored: true,
      })
    }


    const text = body?.message?.text?.trim()

    const conversationId =
      body?.conversation?.id


    console.log("TEXT:", text)
    console.log(
      "CONVERSATION ID:",
      conversationId
    )


    if (!conversationId) {
      return NextResponse.json({
        success: false,
        error: "conversation id missing",
      })
    }


    if (text) {

      await sendZernioMessage(
        conversationId,
        `پیام شما دریافت شد: ${text}`
      )

    }


    return NextResponse.json({
      success: true,
      received: text,
    })


  } catch (error: any) {

    console.error(
      "WEBHOOK ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    )
  }
}
