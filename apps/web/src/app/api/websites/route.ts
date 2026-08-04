import { NextResponse } from "next/server"
import { mockStore } from "@/lib/prisma"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockStore.websites
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newWebsite = {
      id: `site-${Date.now()}`,
      websiteName: body.websiteName || "New Property",
      domain: body.domain || "example.com",
      description: body.description || "",
      status: body.status || "Active",
      selectedCms: body.selectedCms || "WordPress",
      timezone: body.timezone || "UTC",
      language: body.language || "English (US)",
      country: body.country || "United States",
      brandVoice: body.brandVoice || "Authoritative & Executive",
      targetAudiences: body.targetAudiences || [],
      tone: body.tone || "Professional & Authoritative",
      expertiseLevel: body.expertiseLevel || "Expert / Advanced",
      createdAt: new Date().toISOString()
    }

    mockStore.websites.unshift(newWebsite)

    return NextResponse.json({
      success: true,
      data: newWebsite
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create website"
    }, { status: 500 })
  }
}
