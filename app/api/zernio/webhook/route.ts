import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

const ZERNIO_API_URL = "https://zernio.com/api/v1"

async function sendZernioMessage(
  conversationId: string,
  accountId: string,
  text: string
) {
  const response = await fetch(
    `${ZERNIO_API_URL}/inbox/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
      body: JSON.stringify({
        accountId,
        message: text,
      }),
    }
  )

  const data = await response.json()

  console.log("SEND STATUS:", response.status)
  console.log("SEND RESPONSE:", data)

  return data
}


export async function POST(request: NextRequest) {
  try {

    const body = await request.json()

    console.log("========== ZERNIO WEBHOOK ==========")
    console.log(JSON.stringify(body, null, 2))


    if (body?.event !== "message.received") {
      return NextResponse.json({
        success: true,
        ignored: true,
      })
    }


    const text =
      body?.message?.text?.trim()?.toLowerCase() || ""


    const conversationId =
      body?.conversation?.platformConversationId


    const accountId =
      body?.account?.id


    const username =
      body?.account?.username


    if (!text || !conversationId || !accountId) {
      return NextResponse.json({
        success: false,
        error: "Missing data",
      })
    }


    const supabase = await getSupabaseServerClient()


    // پیدا کردن صاحب اکانت
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single()


    if (!user) {

      await sendZernioMessage(
        conversationId,
        accountId,
        "اکانت پیدا نشد"
      )

      return NextResponse.json({
        success:false
      })
    }


    // پیدا کردن قانون فعال
    const { data: automation } = await supabase
      .from("automations")
      .select("*")
      .eq("user_id", user.id)
      .eq("trigger_source", "dm")
      .eq("is_active", true)
      .ilike("trigger_value", text)
      .maybeSingle()



    if (!automation) {

      console.log(
        "NO AUTOMATION FOR:",
        text
      )

      return NextResponse.json({
        success:true,
        matched:false
      })
    }



    let reply = ""


    if (typeof automation.response_content === "string") {
      reply = automation.response_content
    } 
    else if (automation.response_content?.message) {
      reply = automation.response_content.message
    }
    else {
      reply = JSON.stringify(
        automation.response_content
      )
    }



    await sendZernioMessage(
      conversationId,
      accountId,
      reply
    )


    return NextResponse.json({
      success:true,
      matched:true,
      trigger:text,
      reply
    })


  } catch(error:any){

    console.error(
      "ZERNIO WEBHOOK ERROR",
      error
    )

    return NextResponse.json(
      {
        success:false,
        error:error.message
      },
      {
        status:500
      }
    )
  }
}
