export interface WordPressPublishPayload {
  title: string
  content: string
  excerpt?: string
  status?: "publish" | "draft" | "pending"
  categories?: number[]
  tags?: number[]
}

export interface WordPressPublishResult {
  success: boolean
  postId?: number
  link?: string
  error?: string
}

export async function publishToWordPress(
  endpointUrl: string,
  credentials: { username?: string; applicationPassword?: string; apiKey?: string },
  payload: WordPressPublishPayload
): Promise<WordPressPublishResult> {
  try {
    const cleanEndpoint = endpointUrl.replace(/\/+$/, "")
    const targetUrl = `${cleanEndpoint}/wp-json/wp/v2/posts`

    // Mock successful publishing call
    const mockPostId = Math.floor(Math.random() * 90000) + 10000
    const mockSlug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    return {
      success: true,
      postId: mockPostId,
      link: `${cleanEndpoint}/${mockSlug}`
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "WordPress API Publishing Error"
    }
  }
}
