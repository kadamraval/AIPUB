import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const workflows = await prisma.workflow.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({
      success: true,
      data: workflows
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch workflows"
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newWorkflow = await prisma.workflow.create({
      data: {
        name: body.name || "New Workflow Blueprint",
        description: body.description || "",
        category: body.category || "SEO Newsroom",
        status: body.status || "Active",
        nodesJson: body.nodesJson || [],
        edgesJson: body.edgesJson || [],
        totalRuns: 0,
        successRate: 100.0
      }
    })

    return NextResponse.json({
      success: true,
      data: newWorkflow
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create workflow"
    }, { status: 500 })
  }
}
