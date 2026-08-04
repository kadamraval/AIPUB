import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const logs = await prisma.notificationLog.findMany({
      orderBy: { deliveredAt: "desc" }
    })
    return NextResponse.json({
      success: true,
      data: logs
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch notification logs"
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newLog = await prisma.notificationLog.create({
      data: {
        subscriptionId: body.subscriptionId || null,
        event: body.event || "Test Event",
        provider: body.provider || "Slack",
        recipient: body.recipient || "#general",
        status: body.status || "Delivered",
        responsePayload: body.responsePayload || "200 OK"
      }
    })

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
