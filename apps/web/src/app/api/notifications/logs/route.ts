import { NextResponse } from "next/server"
import { mockStore } from "@/lib/prisma"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockStore.logs
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newLog = {
      id: `log-${Date.now()}`,
      event: body.event || "Test Event",
      subscription: body.subscription || "Default Subscription",
      provider: body.provider || "Slack",
      recipient: body.recipient || "#general",
      status: body.status || "Delivered",
      responsePayload: body.responsePayload || "200 OK",
      deliveredAt: new Date().toISOString()
    }

    mockStore.logs.unshift(newLog)

    return NextResponse.json({
      success: true,
      data: newLog
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to log notification"
    }, { status: 500 })
  }
}
