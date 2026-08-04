import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateLLMContent } from "@/services/llm/orchestrator"

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params
    const agentId = params.id
    const body = await req.json()
    const promptInput = body.prompt || "Execute automated task."

    // 1. Fetch Agent from Database
    const agent = await prisma.agent.findUnique({
      where: { id: agentId }
    })

    const systemPrompt = agent?.systemPrompt || "You are an AI publishing specialist."
    const provider = (agent?.provider as "Google Gemini" | "OpenAI" | "Anthropic") || "Google Gemini"
    const model = agent?.model || "gemini-2.5-flash"

    // 2. Generate Content using LLM Orchestrator
    const result = await generateLLMContent({
      provider,
      model,
      systemPrompt,
      userPrompt: promptInput,
      temperature: agent?.temperature ?? 0.7,
      maxTokens: agent?.maxTokens ?? 2048
    })

    // 3. Log Agent Execution in Database
    const execution = await prisma.agentExecution.create({
      data: {
        agentId,
        promptInput,
        outputResponse: result.text,
        tokensUsed: result.tokensUsed,
        executionTimeMs: result.latencyMs,
        status: "Completed"
      }
    })

    return NextResponse.json({
      success: true,
      result: result.text,
      execution
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to execute agent"
    }, { status: 500 })
  }
}
