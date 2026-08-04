export interface ShopifyPublishPayload {
  title: string
  bodyHtml: string
  author?: string
  tags?: string
}

export interface ShopifyPublishResult {
  success: boolean
  articleId?: number
  url?: string
  error?: string
}

export async function publishToShopify(
  storeUrl: string,
  accessToken: string,
  payload: ShopifyPublishPayload
): Promise<ShopifyPublishResult> {
  try {
    const cleanUrl = storeUrl.replace(/\/+$/, "")
    const mockArticleId = Math.floor(Math.random() * 900000) + 100000
    const mockSlug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    return {
      success: true,
      articleId: mockArticleId,
      url: `${cleanUrl}/blogs/news/${mockSlug}`
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Shopify Admin API Error"
    }
  }
}
