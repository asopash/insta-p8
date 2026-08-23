import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

    const session = req.cookies.get("zernio_session")

    if (!session) {
        return NextResponse.json({})
    }

    return NextResponse.json(
        JSON.parse(session.value)
    )
}
