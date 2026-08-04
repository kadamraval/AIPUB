import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const subscriptions = await prisma.notificationSubscription.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({
      success: true,
      data: subscriptions
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch subscriptions"
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newSubscription = await prisma.notificationSubscription.create({
      data: {
        name: body.name || "Workflow Publishing Alert",
        description: body.description || "Delivers real-time notifications to team channels.",
        events: body.events || ["Workflow Completed"],
        providers: body.providers || ["Slack"],
        recipientsJson: body.recipientsJson || { Slack: "#publishing-alerts" },
        template: body.template || "Workflow Completion Alert",
        conditions: body.conditions || "true",
        status: body.status || "Active",
        totalDelivered: 0
      }
    })

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
