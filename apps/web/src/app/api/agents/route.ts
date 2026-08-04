import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({
      success: true,
      data: agents
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch agents"
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newAgent = await prisma.agent.create({
      data: {
        name: body.name || "Custom AI Specialist",
        role: body.role || "Content Generator",
        description: body.description || "",
        provider: body.provider || "Google Gemini",
        model: body.model || "gemini-2.5-flash",
        temperature: body.temperature ?? 0.7,
        maxTokens: body.maxTokens ?? 4096,
        systemPrompt: body.systemPrompt || "You are an AI publishing specialist.",
        enabledTools: body.enabledTools || ["web_search"],
        status: body.status || "Active"
      }
    })

    return NextResponse.json({
      success: true,
      data: newAgent
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create agent"
    }, { status: 500 })
  }
}
