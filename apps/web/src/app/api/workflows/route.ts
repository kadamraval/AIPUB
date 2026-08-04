import { NextResponse } from "next/server"
import { mockStore } from "@/lib/prisma"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockStore.workflows
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newWorkflow = {
      id: `wf-${Date.now()}`,
      name: body.name || "New Workflow Blueprint",
      description: body.description || "",
      category: body.category || "SEO Newsroom",
      status: body.status || "Active",
      nodesJson: body.nodesJson || [],
      edgesJson: body.edgesJson || [],
      totalRuns: 0,
      successRate: 100.0,
      createdAt: new Date().toISOString()
    }

    mockStore.workflows.unshift(newWorkflow)

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
