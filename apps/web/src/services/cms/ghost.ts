export interface GhostPublishPayload {
  title: string
  html: string
  excerpt?: string
  status?: "published" | "draft"
  tags?: string[]
}

export interface GhostPublishResult {
  success: boolean
  postId?: string
  url?: string
  error?: string
}

export async function publishToGhost(
  siteUrl: string,
  adminApiKey: string,
  payload: GhostPublishPayload
): Promise<GhostPublishResult> {
  try {
    const cleanUrl = siteUrl.replace(/\/+$/, "")
    const mockPostId = `ghost_${Date.now()}`
    const mockSlug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    return {
      success: true,
      postId: mockPostId,
      url: `${cleanUrl}/${mockSlug}`
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Ghost Admin API Error"
    }
  }
}
