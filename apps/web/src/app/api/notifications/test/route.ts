import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { AppriseAdapter } from "@/services/notifications/apprise"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const event = body.event || "Test Notification Event"
    const subscriptionName = body.subscriptionName || "Manual Test Dispatch"
    const provider = body.provider || "Slack"
    const recipient = body.recipient || "#publishing-alerts"

    // 1. Execute Notification Dispatch via Apprise Adapter
    const dispatchResult = await AppriseAdapter.send({
      title: `[TEST] ${subscriptionName}`,
      body: `Test Notification Event: ${event}\nProvider: ${provider}\nTarget: ${recipient}`,
      provider,
      recipient
    })

    // 2. Record Audit Entry in PostgreSQL Database Table notification_logs
    const logEntry = await prisma.notificationLog.create({
      data: {
        event,
        provider,
        recipient,
        status: dispatchResult.status,
        responsePayload: dispatchResult.responsePayload,
        deliveredAt: dispatchResult.deliveredAt
      }
    })

    return NextResponse.json({
      success: true,
      dispatch: dispatchResult,
      log: logEntry
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to dispatch test notification"
    }, { status: 500 })
  }
}
