import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"
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

const supabase = await getSupabaseServerClient()

const { error } = await supabase
  .from("users")
  .upsert({
    id: accountId,
    username: username || "unknown",
    business_account_id: accountId,
    page_id: profileId,
    updated_at: new Date().toISOString(),
  })

console.log("SUPABASE SAVE RESULT", error)
  
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

const supabase = await getSupabaseServerClient()

const { data, error } = await supabase
  .from("users")
  .upsert(
    {
      id: accountId,
      username: username || `user_${accountId}`,
      business_account_id: accountId,
      page_id: profileId,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    }
  )

console.log("ZERNIO USER SAVE", {
  data,
  error
})
  
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
