import { generateLLMContent } from "./orchestrator"

export interface ArticleGenerateOptions {
  topic: string
  websiteName?: string
  brandVoice?: string
  tone?: string
  category?: string
}

export interface GeneratedArticleResult {
  title: string
  slug: string
  contentHtml: string
  excerpt: string
  readingTimeMins: number
  wordCount: number
}

export async function generateArticleForWebsite(options: ArticleGenerateOptions): Promise<GeneratedArticleResult> {
  const systemPrompt = `You are a professional editorial AI writer for ${options.websiteName || "TechPulse Daily"}.
Brand Voice: ${options.brandVoice || "Authoritative & Executive"}
Tone: ${options.tone || "Professional & Authoritative"}
Category: ${options.category || "Artificial Intelligence"}

Write in journalistic prose with clean HTML markup. Output an h1 header, subheadings (h2), bullet points, and a concise summary.`

  const userPrompt = `Write an in-depth article about: "${options.topic}".`

  const llmResult = await generateLLMContent({
    systemPrompt,
    userPrompt,
    temperature: 0.7,
    maxTokens: 3000
  })

  const title = options.topic.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\b\w/g, l => l.toUpperCase())
  const slug = title.toLowerCase().replace(/\s+/g, "-")
  const contentHtml = `<p>${llmResult.text.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`
  const excerpt = `Discover key insights and deep analysis regarding ${options.topic}.`
  const wordCount = llmResult.text.split(/\s+/).length
  const readingTimeMins = Math.max(1, Math.ceil(wordCount / 200))

  return {
    title,
    slug,
    contentHtml,
    excerpt,
    readingTimeMins,
    wordCount
  }
}
