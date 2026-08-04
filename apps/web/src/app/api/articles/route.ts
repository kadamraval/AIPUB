import { NextResponse } from "next/server"
import { mockStore } from "@/lib/prisma"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockStore.articles
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newArticle = {
      id: `art-${Date.now()}`,
      title: body.title || "Untitled Article",
      slug: body.slug || "untitled-article",
      content: body.content || "",
      excerpt: body.excerpt || "",
      status: body.status || "Draft",
      websiteId: body.websiteId || "site-1",
      category: body.category || "General",
      tags: body.tags || [],
      wordCount: body.content ? body.content.split(/\s+/).length : 0,
      createdAt: new Date().toISOString()
    }

    mockStore.articles.unshift(newArticle)

    return NextResponse.json({
      success: true,
      data: newArticle
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create article"
    }, { status: 500 })
  }
}
