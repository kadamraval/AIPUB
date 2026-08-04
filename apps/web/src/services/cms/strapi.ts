export interface StrapiPublishPayload {
  title: string
  content: string
  description?: string
}

export interface StrapiPublishResult {
  success: boolean
  documentId?: string
  error?: string
}

export async function publishToStrapi(
  hostUrl: string,
  bearerToken: string,
  payload: StrapiPublishPayload
): Promise<StrapiPublishResult> {
  try {
    const mockDocumentId = `strapi_doc_${Date.now()}`

    return {
      success: true,
      documentId: mockDocumentId
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Strapi REST API Error"
    }
  }
}
