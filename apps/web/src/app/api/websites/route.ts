import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { eventBus } from "@/lib/event-bus"

// INITIAL DEMO WEBSITES FOR DATABASE SEEDING
const DEMO_WEBSITES = [
  {
    websiteName: "TechPulse Daily",
    domain: "techpulsedaily.io",
    description: "Cutting-edge technology, AI developments, and developer ecosystem news.",
    status: "Active",
    selectedCms: "WordPress",
    cmsCredentials: { apiEndpoint: "https://techpulsedaily.io/wp-json", username: "admin" },
    timezone: "America/New_York (EST/EDT)",
    language: "English (US)",
    country: "United States",
    brandVoice: "Authoritative & Executive",
    writingStyleRich: "<p>Write in clear, authoritative journalistic prose using active voice.</p>",
    targetAudiences: ["Software Engineers", "Tech Founders", "AI Researchers"],
    tone: "Professional & Authoritative",
    expertiseLevel: "Expert / Advanced",
    categories: ["Artificial Intelligence", "Cloud Computing", "Cybersecurity"],
    topics: ["LLMs", "Autonomous Agents", "Developer Tools"],
    contentType: "Articles & Guides",
    contentLength: "Medium (1200-2000 words)",
    approvalMode: "Direct Auto-Publish",
    notificationWorkflow: "Slack Alert Channel",
    seoPlugin: "Native Schema Engine",
    metaTitleTemplate: "{{article_title}} | TechPulse",
    metaDescTemplate: "{{excerpt}} - Read more on TechPulse",
    robots: "index, follow",
    canonicalUrl: "Self Referencing",
    openGraph: true,
    twitterCard: "summary_large_image"
  },
  {
    websiteName: "BioHealth Insights",
    domain: "biohealthinsights.com",
    description: "Biomedical research, clinical breakthroughs, and healthcare innovation.",
    status: "Active",
    selectedCms: "Ghost",
    cmsCredentials: { siteUrl: "https://biohealthinsights.com", adminApiKey: "ghost_secret" },
    timezone: "UTC",
    language: "English (US)",
    country: "United States",
    brandVoice: "Academic & Research-Backed",
    writingStyleRich: "<p>Use rigorous scientific terminology backed by clinical studies.</p>",
    targetAudiences: ["Clinicians", "Medical Researchers", "Biotech Investors"],
    tone: "Formal & Academic",
    expertiseLevel: "Industry Specialist",
    categories: ["Genomics", "Pharmacology", "Digital Health"],
    topics: ["CRISPR", "Clinical Trials", "AI Diagnostics"],
    contentType: "Articles & Guides",
    contentLength: "Longform (2000-3500 words)",
    approvalMode: "Save Draft for Review",
    notificationWorkflow: "Email Digest Alert",
    seoPlugin: "Ghost Native SEO",
    metaTitleTemplate: "{{article_title}} - BioHealth Insights",
    metaDescTemplate: "{{excerpt}}",
    robots: "index, follow",
    canonicalUrl: "Self Referencing",
    openGraph: true,
    twitterCard: "summary_large_image"
  },
  {
    websiteName: "SaaS Growth Journal",
    domain: "saasgrowthjournal.org",
    description: "B2B SaaS scaling strategies, product-led growth, and metrics.",
    status: "Active",
    selectedCms: "Webflow",
    cmsCredentials: { siteId: "webflow_site_123", collectionId: "posts_coll" },
    timezone: "America/Los_Angeles (PST/PDT)",
    language: "English (US)",
    country: "United States",
    brandVoice: "Friendly & Conversational",
    writingStyleRich: "<p>Practical advice with actionable SaaS teardowns and metrics.</p>",
    targetAudiences: ["SaaS Founders", "Growth Marketers", "Product Managers"],
    tone: "Casual & Conversational",
    expertiseLevel: "Intermediate Practitioner",
    categories: ["Product-Led Growth", "Customer Acquisition", "Metrics & CAC"],
    topics: ["Pricing Models", "Churn Reduction", "PQLs"],
    contentType: "Tutorials & How-Tos",
    contentLength: "Medium (1200-2000 words)",
    approvalMode: "Direct Auto-Publish",
    notificationWorkflow: "Slack Alert Channel",
    seoPlugin: "Rank Math SEO",
    metaTitleTemplate: "{{article_title}} | SaaS Growth",
    metaDescTemplate: "{{excerpt}}",
    robots: "index, follow",
    canonicalUrl: "Self Referencing",
    openGraph: true,
    twitterCard: "summary_large_image"
  }
]

export async function GET() {
  try {
    let websites = await prisma.website.findMany({
      orderBy: { createdAt: "desc" }
    })

    // Seed database if empty
    if (websites.length === 0) {
      for (const demo of DEMO_WEBSITES) {
        await prisma.website.create({ data: demo })
      }
      websites = await prisma.website.findMany({
        orderBy: { createdAt: "desc" }
      })
    }

    return NextResponse.json({
      success: true,
      data: websites
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch websites"
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (!body.websiteName || !body.domain) {
      return NextResponse.json({
        success: false,
        error: "Website Name and Domain are required fields."
      }, { status: 400 })
    }

    const createdWebsite = await prisma.website.create({
      data: {
        websiteName: body.websiteName.trim(),
        domain: body.domain.trim(),
        description: body.description?.trim() || "",
        status: body.status || "Active",
        darkLogoUrl: body.darkLogoUrl || null,
        lightLogoUrl: body.lightLogoUrl || null,
        timezone: body.timezone || "UTC",
        language: body.language || "English (US)",
        country: body.country || "United States",
        brandVoice: body.brandVoice || "Authoritative & Executive",
        writingStyleRich: body.writingStyleRich || "",
        targetAudiences: body.targetAudiences || [],
        tone: body.tone || "Professional & Authoritative",
        expertiseLevel: body.expertiseLevel || "Expert / Advanced",
        brandGuidelines: body.brandGuidelines || "",
        customInstructions: body.customInstructions || "",
        selectedCms: body.selectedCms || "WordPress",
        cmsCredentials: body.cmsCredentials || {},
        slugFormat: body.slugFormat || "/{{slug}}",
        comments: body.comments || "Disabled",
        pingSearchEngines: body.pingSearchEngines ?? true,
        categories: body.categories ? (Array.isArray(body.categories) ? body.categories : body.categories.split(",").map((s: string) => s.trim())) : [],
        topics: body.topics ? (Array.isArray(body.topics) ? body.topics : body.topics.split(",").map((s: string) => s.trim())) : [],
        contentType: body.contentType || "Articles & Guides",
        contentLength: body.contentLength || "Medium (1200-2000 words)",
        restrictedTopics: body.restrictedTopics || "",
        includeKeywords: body.includeKeywords || "",
        excludeKeywords: body.excludeKeywords || "",
        contentGuidelines: body.contentGuidelines || "",
        selectedWorkflowId: body.selectedWorkflowId || null,
        approvalMode: body.approvalMode || "Direct Auto-Publish",
        notificationWorkflow: body.notificationWorkflow || "Slack Alert Channel",
        seoPlugin: body.seoPlugin || "Native Schema Engine",
        metaTitleTemplate: body.metaTitleTemplate || "{{article_title}} | {{site_name}}",
        metaDescTemplate: body.metaDescTemplate || "{{excerpt}}",
        robots: body.robots || "index, follow",
        canonicalUrl: body.canonicalUrl || "Self Referencing",
        openGraph: body.openGraph ?? true,
        twitterCard: body.twitterCard || "summary_large_image"
      }
    })

    // Automatically emit system event
    eventBus.emitSystemEvent({
      eventName: "Website Created",
      module: "Website",
      action: "Created",
      entityId: createdWebsite.id,
      entityName: createdWebsite.websiteName,
      status: "success"
    })

    return NextResponse.json({
      success: true,
      data: createdWebsite
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create website property"
    }, { status: 500 })
  }
}
