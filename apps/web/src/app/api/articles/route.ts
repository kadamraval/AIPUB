import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({
      success: true,
      data: articles
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch articles"
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newArticle = await prisma.article.create({
      data: {
        title: body.title || "Untitled Article",
        slug: body.slug || `article-${Date.now()}`,
        content: body.content || "",
        excerpt: body.excerpt || "",
        status: body.status || "Draft",
        websiteId: body.websiteId || "site-1",
        category: body.category || "General",
        tags: body.tags || [],
        wordCount: body.content ? body.content.split(/\s+/).length : 0
      }
    })

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
