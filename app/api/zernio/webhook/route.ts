import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log(
      "================ ZERNIO EVENT ================"
    )

    console.log(JSON.stringify(body, null, 2))

    const event = body?.event

    if (!event) {
      return NextResponse.json({
        success: false,
        message: "No event found",
      })
    }

    // فقط پیام دایرکت اینستاگرام
    if (event === "message.received") {
      const message = body.message

      const text = message?.text || ""

      const sender = message?.sender || {}

      const account = body?.account || {}

      console.log("EVENT:", event)
      console.log("ACCOUNT:", account.username)
      console.log("SENDER:", sender.username)
      console.log("TEXT:", text)

      /*
        اینجا مرحله بعد اضافه می‌کنیم:

        1- اگر text = 22 بود
        2- از Supabase محصول شماره 22 را پیدا کنیم
        3- جواب را از طریق Zernio ارسال کنیم
      */

      return NextResponse.json({
        success: true,
        type: "message.received",
        text,
        sender: sender.username,
        account: account.username,
      })
    }


    // فعلاً کامنت برای مرحله بعد
    if (event === "comment.received") {
      console.log("COMMENT EVENT RECEIVED")

      return NextResponse.json({
        success: true,
        type: "comment.received",
      })
    }


    return NextResponse.json({
      success: true,
      message: "Event ignored",
      event,
    })


  } catch (error: any) {

    console.error(
      "ZERNIO WEBHOOK ERROR:",
      error?.message
    )

    return NextResponse.json(
      {
        success: false,
        error: error?.message,
      },
      {
        status: 500,
      }
    )
  }
}
