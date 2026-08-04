import { NextResponse } from "next/server"
import { mockStore } from "@/lib/prisma"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockStore.subscriptions
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newSubscription = {
      id: `sub-${Date.now()}`,
      name: body.name || "Workflow Publishing Alert",
      description: body.description || "Delivers real-time notifications to team channels.",
      events: body.events || ["Workflow Completed"],
      providers: body.providers || ["Slack"],
      recipientsJson: body.recipientsJson || { Slack: "#publishing-alerts" },
      template: body.template || "Workflow Completion Alert",
      conditions: body.conditions || "true",
      status: body.status || "Active",
      totalDelivered: 0,
      createdAt: new Date().toISOString()
    }

    mockStore.subscriptions.unshift(newSubscription)

    return NextResponse.json({
      success: true,
      data: newSubscription
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create subscription"
    }, { status: 500 })
  }
}
