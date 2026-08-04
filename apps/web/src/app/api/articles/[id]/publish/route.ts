import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { publishToWordPress } from "@/services/cms/wordpress"
import { publishToGhost } from "@/services/cms/ghost"
import { publishToWebflow } from "@/services/cms/webflow"
import { publishToShopify } from "@/services/cms/shopify"
import { publishToStrapi } from "@/services/cms/strapi"

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params
    const articleId = params.id

    // 1. Fetch Article & Associated Website Property from Database
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { website: true }
    })

    if (!article) {
      return NextResponse.json({
        success: false,
        error: "Article not found"
      }, { status: 404 })
    }

    const website = article.website
    const cmsType = website.selectedCms || "WordPress"
    const credentials = (website.cmsCredentials as any) || {}

    let publishResult: any = { success: false, error: "Unsupported CMS" }

    // 2. Dispatch to Target CMS Engine
    if (cmsType === "WordPress") {
      publishResult = await publishToWordPress(
        credentials.apiEndpoint || `https://${website.domain}`,
        credentials,
        { title: article.title, content: article.content, excerpt: article.excerpt || "" }
      )
    } else if (cmsType === "Ghost") {
      publishResult = await publishToGhost(
        credentials.siteUrl || `https://${website.domain}`,
        credentials.adminApiKey || "",
        { title: article.title, html: article.content, excerpt: article.excerpt || "" }
      )
    } else if (cmsType === "Webflow") {
      publishResult = await publishToWebflow(
        credentials.siteId || "",
        credentials.collectionId || "",
        credentials.apiToken || "",
        { title: article.title, bodyHtml: article.content, summary: article.excerpt || "" }
      )
    } else if (cmsType === "Shopify") {
      publishResult = await publishToShopify(
        credentials.storeUrl || `https://${website.domain}`,
        credentials.adminAccessToken || "",
        { title: article.title, bodyHtml: article.content }
      )
    } else if (cmsType === "Strapi") {
      publishResult = await publishToStrapi(
        credentials.hostUrl || `https://${website.domain}`,
        credentials.apiBearerToken || "",
        { title: article.title, content: article.content }
      )
    }

    // 3. Update Local Article Status to Published in PostgreSQL
    if (publishResult.success) {
      await prisma.article.update({
        where: { id: articleId },
        data: {
          status: "Published",
          publishedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: publishResult.success,
      cmsType,
      result: publishResult
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to publish article"
    }, { status: 500 })
  }
}
