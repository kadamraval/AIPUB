"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Button, Form, TextField, Label, Input, Select, ListBox, Tooltip, Accordion, Switch, Chip
} from "@heroui/react"
import {
  ArrowLeft, Globe, Sparkles, Database, Send, FileText, GitBranch, Search, Image as ImageIcon,
  Plug, Shield, BarChart3, Sliders, Save, CheckCircle2, ShieldCheck, ChevronDown, Info,
  Upload, X, Plus, Bold, Italic, Underline, List, ListOrdered, Code, Quote, Link as LinkIcon
} from "lucide-react"

const CMS_OPTIONS = [
  { value: "WordPress", label: "WordPress (REST API)", fields: ["API Endpoint URL", "Username / API Key", "Application Password"] },
  { value: "Ghost", label: "Ghost Admin API", fields: ["Ghost Site URL", "Admin API Key"] },
  { value: "Webflow", label: "Webflow Collections", fields: ["Webflow API Token", "Site ID", "Collection ID"] },
  { value: "Shopify", label: "Shopify Store Blog", fields: ["Shopify Store URL", "Admin Access Token"] },
  { value: "Strapi", label: "Strapi Headless", fields: ["Strapi Host URL", "API Bearer Token"] },
]

const FULL_LANGUAGES = [
  "English (US)", "English (UK)", "Spanish (Spain)", "Spanish (Latin America)", "French", "German",
  "Italian", "Portuguese (Brazil)", "Portuguese (Portugal)", "Dutch", "Russian", "Chinese (Simplified)",
  "Chinese (Traditional)", "Japanese", "Korean", "Hindi", "Arabic", "Turkish", "Polish", "Swedish",
  "Danish", "Finnish", "Norwegian", "Greek", "Czech", "Romanian", "Hungarian", "Hebrew", "Thai", "Vietnamese", "Indonesian"
]

const FULL_TIMEZONES = [
  "UTC", "America/New_York (EST/EDT)", "America/Chicago (CST/CDT)", "America/Denver (MST/MDT)",
  "America/Los_Angeles (PST/PDT)", "America/Toronto", "America/Sao_Paulo", "Europe/London (GMT/BST)",
  "Europe/Paris (CET/CEST)", "Europe/Berlin", "Europe/Madrid", "Europe/Rome", "Europe/Moscow",
  "Africa/Cairo", "Africa/Johannesburg", "Asia/Dubai (GST)", "Asia/Kolkata (IST)", "Asia/Bangkok",
  "Asia/Singapore (SGT)", "Asia/Shanghai (CST)", "Asia/Tokyo (JST)", "Asia/Seoul (KST)",
  "Australia/Sydney (AEST)", "Australia/Melbourne", "Pacific/Auckland (NZST)"
]

const FULL_COUNTRIES = [
  "Global / Multi-Region", "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Spain", "Italy", "Japan", "India", "Brazil", "Mexico", "Netherlands", "Sweden",
  "Switzerland", "United Arab Emirates", "Singapore", "South Korea", "Argentina", "Belgium",
  "Poland", "Turkey", "Saudi Arabia", "South Africa", "Indonesia", "Vietnam", "Philippines"
]

const PREMADE_BRAND_VOICES = [
  "Authoritative & Executive",
  "Friendly & Conversational",
  "Tech-Savvy & Innovative",
  "Playful & Witty",
  "Academic & Research-Backed",
  "Bold & Disruptive",
  "Empathetic & Caring",
  "Professional & Corporate",
  "Minimalist & Direct",
  "Inspirational & Visionary",
  "Educational & Instructive",
  "Skeptical & Analytical"
]

const ALL_TONES = [
  "Professional & Authoritative",
  "Casual & Conversational",
  "Formal & Academic",
  "Enthusiastic & High Energy",
  "Urgent & Action-Oriented",
  "Reassuring & Empathetic",
  "Humorous & Witty",
  "Informative & Neutral",
  "Persuasive & Sales-Oriented",
  "Analytical & Data-Driven",
  "Storytelling & Narrative",
  "Educational & Instructional",
  "Skeptical & Critical",
  "Thought-Provoking & Philosophical"
]

const EXPERTISE_LEVELS = ["Beginner Friendly", "Intermediate Practitioner", "Expert / Advanced", "Industry Specialist"]

const URL_SLUG_FORMATS = ["/{{year}}/{{month}}/{{slug}}", "/{{category}}/{{slug}}", "/{{slug}}", "/posts/{{slug}}"]
const COMMENT_MODES = ["Enabled", "Disabled", "Approval Required"]

const CONTENT_TYPES = ["Articles & Guides", "News Briefs", "Reviews & Comparisons", "Tutorials & How-Tos"]
const CONTENT_LENGTHS = ["Short (800-1200 words)", "Medium (1200-2000 words)", "Longform (2000-3500 words)"]

const WORKFLOWS = [
  "Autonomous Newsroom Blueprint",
  "SEO Topic Cluster & Article Generator",
  "fal.ai Image & Content Workflow",
  "Multi-Lingual Translation & Publishing"
]
const APPROVAL_MODES = ["Direct Auto-Publish", "Save Draft for Review", "Schedule in Queue"]
const NOTIFICATION_WORKFLOWS = ["Slack Alert Channel", "Telegram Bot Dispatch", "Email Digest Alert", "Disabled"]

const SEO_PLUGINS = ["Native Schema Engine", "Yoast SEO Plugin", "Rank Math SEO", "All in One SEO", "Ghost Native SEO"]
const ROBOTS_OPTIONS = ["index, follow", "noindex, follow", "index, nofollow", "noindex, nofollow"]
const CANONICAL_OPTIONS = ["Self Referencing", "Custom Domain Base", "Disabled"]
const TWITTER_CARDS = ["summary_large_image", "summary"]
const SCHEMAS = ["Article", "NewsArticle", "BlogPosting", "TechArticle"]

const FEATURED_IMAGES = ["fal.ai (FLUX.1 Dev)", "OpenAI DALL-E 3", "Freepik MCP API", "Unsplash Free API"]
const ASPECT_RATIOS = ["16:9 Landscape", "1:1 Square", "4:3 Standard", "9:16 Vertical"]
const IMAGE_SIZES = ["Full HD (1920x1080)", "HD (1280x720)", "Web Optimized (800x450)"]
const COMPRESSIONS = ["WebP (85% Quality)", "WebP (Lossless)", "JPEG High Quality"]
const ALT_TEXT_MODES = ["Auto SEO Keyword Alt Text", "Article Title Based Alt Text", "AI Visual Description"]

const PERMISSION_ROLES = ["Admin Full Control", "Editor Publishing Only", "Read-Only API Access"]
const REPORTING_FREQUENCIES = ["Realtime Direct Feed", "Daily Summary Digest", "Weekly Performance Email", "Monthly Report"]
const DASHBOARD_KPIS = ["Enterprise Full Metrics", "Concise Executive Summary", "SEO & Keyword Focused"]
const ENVIRONMENTS = ["Production", "Staging", "Development"]
const RATE_LIMITS = ["60 requests / min", "120 requests / min", "Unlimited / Dedicated"]
const QUEUE_PRIORITIES = ["Normal Priority", "High Priority", "Urgent / Immediate"]

function FormLabel({ children, info }: { children: React.ReactNode; info?: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <Label className="text-xs font-bold text-foreground tracking-tight">{children}</Label>
      {info && (
        <Tooltip delay={0}>
          <span className="inline-flex items-center text-default-400 hover:text-primary transition-colors cursor-pointer">
            <Info className="size-3.5" />
          </span>
          <Tooltip.Content>
            <p className="text-xs p-1.5 max-w-xs">{info}</p>
          </Tooltip.Content>
        </Tooltip>
      )}
    </div>
  )
}

export default function NewWebsitePage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // 1. General
  const [websiteName, setWebsiteName] = useState("")
  const [domain, setDomain] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Active")

  // Logo uploads
  const [darkLogo, setDarkLogo] = useState<File | null>(null)
  const [darkLogoPreview, setDarkLogoPreview] = useState<string | null>(null)
  const [lightLogo, setLightLogo] = useState<File | null>(null)
  const [lightLogoPreview, setLightLogoPreview] = useState<string | null>(null)

  // Searchable Timezone, Language & Country
  const [timezoneSearch, setTimezoneSearch] = useState("")
  const [timezone, setTimezone] = useState("UTC")
  const [langSearch, setLangSearch] = useState("")
  const [language, setLanguage] = useState("English (US)")
  const [countrySearch, setCountrySearch] = useState("")
  const [country, setCountry] = useState("United States")

  // 2. Brand
  const [brandVoice, setBrandVoice] = useState("Authoritative & Executive")
  const [writingStyleRich, setWritingStyleRich] = useState("<p>Write in clear, authoritative journalistic prose using active voice. Avoid fluff, define technical terms on first reference, and use structured headings.</p>")
  
  // Target Audience Multiple Tag System
  const [targetAudiences, setTargetAudiences] = useState<string[]>(["Software Engineers", "Tech Founders", "AI Researchers"])
  const [newAudienceInput, setNewAudienceInput] = useState("")
  
  const [tone, setTone] = useState("Professional & Authoritative")
  const [expertiseLevel, setExpertiseLevel] = useState("Expert / Advanced")
  const [brandGuidelines, setBrandGuidelines] = useState("")
  const [customInstructions, setCustomInstructions] = useState("")

  // 3. CMS
  const [selectedCms, setSelectedCms] = useState("WordPress")
  const [cmsCredentials, setCmsCredentials] = useState<Record<string, string>>({})

  // 4. Publishing
  const [slugFormat, setSlugFormat] = useState("/{{slug}}")
  const [comments, setComments] = useState("Disabled")
  const [pingSearchEngines, setPingSearchEngines] = useState(true)

  // 5. Content (Removed Primary and Secondary languages)
  const [categories, setCategories] = useState("Artificial Intelligence, Cloud Computing, Cybersecurity")
  const [topics, setTopics] = useState("LLMs, Autonomous Agents, Developer Tools")
  const [contentType, setContentType] = useState("Articles & Guides")
  const [contentLength, setContentLength] = useState("Medium (1200-2000 words)")
  const [restrictedTopics, setRestrictedTopics] = useState("")
  const [includeKeywords, setIncludeKeywords] = useState("")
  const [excludeKeywords, setExcludeKeywords] = useState("")
  const [contentGuidelines, setContentGuidelines] = useState("")

  // 6. Workflow (Removed Default Agent Group)
  const [selectedWorkflow, setSelectedWorkflow] = useState("Autonomous Newsroom Blueprint")
  const [approvalMode, setApprovalMode] = useState("Direct Auto-Publish")
  const [notificationWorkflow, setNotificationWorkflow] = useState("Slack Alert Channel")

  // 7. SEO
  const [seoPlugin, setSeoPlugin] = useState("Native Schema Engine")
  const [metaTitleTemplate, setMetaTitleTemplate] = useState("{{article_title}} | TechPulse")
  const [metaDescTemplate, setMetaDescTemplate] = useState("{{excerpt}} - Read more on TechPulse")
  const [robots, setRobots] = useState("index, follow")
  const [canonicalUrl, setCanonicalUrl] = useState("Self Referencing")
  const [openGraph, setOpenGraph] = useState(true)
  const [twitterCard, setTwitterCard] = useState("summary_large_image")
  const [schemaType, setSchemaType] = useState("Article")
  const [breadcrumbs, setBreadcrumbs] = useState(true)
  const [sitemap, setSitemap] = useState(true)
  const [autoIndexing, setAutoIndexing] = useState(true)

  // 8. Media
  const [featuredImageProvider, setFeaturedImageProvider] = useState("fal.ai (FLUX.1 Dev)")
  const [aspectRatio, setAspectRatio] = useState("16:9 Landscape")
  const [imageSize, setImageSize] = useState("Full HD (1920x1080)")
  const [watermark, setWatermark] = useState(false)
  const [compression, setCompression] = useState("WebP (85% Quality)")
  const [altTextMode, setAltTextMode] = useState("Auto SEO Keyword Alt Text")

  // 9. Integrations
  const [gaId, setGaId] = useState("")
  const [gscUrl, setGscUrl] = useState("")
  const [gAdsId, setGAdsId] = useState("")
  const [clarityId, setClarityId] = useState("")
  const [bingKey, setBingKey] = useState("")
  const [customIntegrations, setCustomIntegrations] = useState("")

  // 10. Security
  const [apiAccess, setApiAccess] = useState(true)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [ipWhitelist, setIpWhitelist] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [auditLogs, setAuditLogs] = useState(true)
  const [permissionsRole, setPermissionsRole] = useState("Admin Full Control")

  // 11. Analytics
  const [perfTracking, setPerfTracking] = useState(true)
  const [reportFreq, setReportFreq] = useState("Daily Summary Digest")
  const [kpiDashboard, setKpiDashboard] = useState("Enterprise Full Metrics")

  // 12. Advanced
  const [customVariables, setCustomVariables] = useState("")
  const [environment, setEnvironment] = useState("Production")
  const [customHeaders, setCustomHeaders] = useState("")
  const [apiOverrides, setApiOverrides] = useState("")
  const [rateLimit, setRateLimit] = useState("60 requests / min")
  const [queuePriority, setQueuePriority] = useState("Normal Priority")
  const [enableCache, setEnableCache] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const [experimentalFeatures, setExperimentalFeatures] = useState(false)
  const [notes, setNotes] = useState("")

  const cmsConfig = CMS_OPTIONS.find((c) => c.value === selectedCms) || CMS_OPTIONS[0]

  // Handlers for Target Audience tags
  const handleAddAudience = () => {
    if (newAudienceInput.trim() && !targetAudiences.includes(newAudienceInput.trim())) {
      setTargetAudiences([...targetAudiences, newAudienceInput.trim()])
      setNewAudienceInput("")
    }
  }

  const handleRemoveAudience = (tag: string) => {
    setTargetAudiences(targetAudiences.filter((t) => t !== tag))
  }

  // Handlers for Logo Uploads
  const handleDarkLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setDarkLogo(file)
      setDarkLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleLightLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLightLogo(file)
      setLightLogoPreview(URL.createObjectURL(file))
    }
  }

  // Filtered Lists
  const filteredTimezones = FULL_TIMEZONES.filter((t) => t.toLowerCase().includes(timezoneSearch.toLowerCase()))
  const filteredLanguages = FULL_LANGUAGES.filter((l) => l.toLowerCase().includes(langSearch.toLowerCase()))
  const filteredCountries = FULL_COUNTRIES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase()))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!websiteName.trim() || !domain.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteName: websiteName.trim(),
          domain: domain.trim(),
          description: description.trim(),
          status,
          timezone,
          language,
          country,
          brandVoice,
          writingStyleRich,
          targetAudiences,
          tone,
          expertiseLevel,
          brandGuidelines,
          customInstructions,
          selectedCms,
          cmsCredentials,
          slugFormat,
          comments,
          pingSearchEngines,
          categories,
          topics,
          contentType,
          contentLength,
          restrictedTopics,
          includeKeywords,
          excludeKeywords,
          contentGuidelines,
          selectedWorkflow,
          approvalMode,
          notificationWorkflow,
          seoPlugin,
          metaTitleTemplate,
          metaDescTemplate,
          robots,
          canonicalUrl,
          openGraph,
          twitterCard
        })
      })

      if (res.ok) {
        setMsg(`Website property "${websiteName}" created & saved to PostgreSQL database!`)
        setTimeout(() => router.push("/admin/websites"), 1000)
      } else {
        setMsg(`Error saving website property to database.`)
      }
    } catch (err) {
      setMsg(`Failed to connect to database service.`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 px-4 sm:px-6">
      <Form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation Sticky Top Action Bar */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-background/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-divider flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              isIconOnly
              onPress={() => router.push("/admin/websites")}
              aria-label="Go Back to Websites"
              className="rounded-xl border-divider"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                <Globe className="size-4 text-primary" /> Connect Website Property
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onPress={() => router.push("/admin/websites")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isDisabled={submitting}
              className="font-medium px-5"
            >
              <Save className="size-3.5" /> {submitting ? "Saving..." : "Save Property"}
            </Button>
          </div>
        </div>

        {msg && (
          <div className="p-4 bg-success-50 border border-success-200 text-success-700 text-xs rounded-2xl flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="size-4 shrink-0 text-success" />
            <span className="font-semibold">{msg}</span>
          </div>
        )}

        {/* 12 Accordion Sections with short titles & subtle monochrome icons */}
        <Accordion className="w-full space-y-3">
          
          {/* 1. General */}
          <Accordion.Item key="general" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Globe className="size-4 text-default-500" /> General
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="websiteName">
                    <FormLabel info="Internal reference title for this website property">Website Name *</FormLabel>
                    <Input
                      placeholder="e.g. TechPulse Daily"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="domain">
                    <FormLabel info="Target domain hostname or public web address">Domain *</FormLabel>
                    <Input
                      placeholder="e.g. techpulsedaily.io"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                {/* Multiple Logo File Upload Section below domain across full grid width */}
                <div className="space-y-3">
                  <FormLabel info="Upload website branding logos for Light and Dark themes">Website Logos (Dark & Light Themes)</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dark Theme Logo Upload Card */}
                    <div className="p-4 bg-default-50/80 dark:bg-default-50/10 border border-divider rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="size-3.5 text-default-500" /> Dark Theme Logo
                        </span>
                        <span className="text-[10px] text-default-400 uppercase tracking-wider">PNG/SVG/WebP</span>
                      </div>
                      
                      {darkLogoPreview ? (
                        <div className="relative p-3 bg-content2 rounded-xl border border-divider flex items-center justify-between">
                          <img src={darkLogoPreview} alt="Dark Logo Preview" className="h-10 object-contain max-w-[140px]" />
                          <button
                            type="button"
                            onClick={() => { setDarkLogo(null); setDarkLogoPreview(null); }}
                            className="p-1.5 text-default-400 hover:text-danger rounded-lg transition-colors"
                            aria-label="Remove Dark Logo"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-divider hover:border-primary/50 bg-background rounded-xl cursor-pointer transition-colors group">
                          <Upload className="size-5 text-default-400 group-hover:text-primary transition-colors mb-1.5" />
                          <span className="text-xs font-medium text-foreground">Upload Dark Logo</span>
                          <span className="text-[10px] text-default-400 mt-0.5">Drag & drop or browse image</span>
                          <input type="file" accept="image/*" onChange={handleDarkLogoChange} className="hidden" />
                        </label>
                      )}
                    </div>

                    {/* Light Theme Logo Upload Card */}
                    <div className="p-4 bg-default-50/80 dark:bg-default-50/10 border border-divider rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="size-3.5 text-default-500" /> Light Theme Logo
                        </span>
                        <span className="text-[10px] text-default-400 uppercase tracking-wider">PNG/SVG/WebP</span>
                      </div>

                      {lightLogoPreview ? (
                        <div className="relative p-3 bg-white rounded-xl border border-divider flex items-center justify-between shadow-xs">
                          <img src={lightLogoPreview} alt="Light Logo Preview" className="h-10 object-contain max-w-[140px]" />
                          <button
                            type="button"
                            onClick={() => { setLightLogo(null); setLightLogoPreview(null); }}
                            className="p-1.5 text-default-400 hover:text-danger rounded-lg transition-colors"
                            aria-label="Remove Light Logo"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-divider hover:border-primary/50 bg-background rounded-xl cursor-pointer transition-colors group">
                          <Upload className="size-5 text-default-400 group-hover:text-primary transition-colors mb-1.5" />
                          <span className="text-xs font-medium text-foreground">Upload Light Logo</span>
                          <span className="text-[10px] text-default-400 mt-0.5">Drag & drop or browse image</span>
                          <input type="file" accept="image/*" onChange={handleLightLogoChange} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <TextField name="description">
                  <FormLabel info="Summary overview of site niche & mission">Description</FormLabel>
                  <Input
                    placeholder="e.g. Autonomous media publication covering AI & tech breakthroughs"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <FormLabel info="Website operational status">Status</FormLabel>
                    <Select selectedKey={status} onSelectionChange={(key) => key && setStatus(key as string)} className="w-full" aria-label="Status">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="Active">Active</ListBox.Item>
                          <ListBox.Item id="Paused">Paused</ListBox.Item>
                          <ListBox.Item id="Inactive">Inactive</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {/* Searchable Timezone with Filter */}
                  <div>
                    <FormLabel info="Search & select publishing timezone">Timezone</FormLabel>
                    <Select selectedKey={timezone} onSelectionChange={(key) => key && setTimezone(key as string)} className="w-full" aria-label="Timezone">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <div className="p-2 border-b border-divider sticky top-0 bg-content1 z-10">
                          <Input
                            placeholder="Search timezone..."
                            value={timezoneSearch}
                            onChange={(e) => setTimezoneSearch(e.target.value)}
                            className="w-full h-8 px-2.5 text-xs bg-default-100 text-foreground border border-divider rounded-lg"
                          />
                        </div>
                        <ListBox className="max-h-56 overflow-y-auto">
                          {filteredTimezones.map((tz) => <ListBox.Item key={tz} id={tz}>{tz}</ListBox.Item>)}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {/* Searchable Language with Filter */}
                  <div>
                    <FormLabel info="Search & select default language">Language</FormLabel>
                    <Select selectedKey={language} onSelectionChange={(key) => key && setLanguage(key as string)} className="w-full" aria-label="Language">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <div className="p-2 border-b border-divider sticky top-0 bg-content1 z-10">
                          <Input
                            placeholder="Search language..."
                            value={langSearch}
                            onChange={(e) => setLangSearch(e.target.value)}
                            className="w-full h-8 px-2.5 text-xs bg-default-100 text-foreground border border-divider rounded-lg"
                          />
                        </div>
                        <ListBox className="max-h-56 overflow-y-auto">
                          {filteredLanguages.map((lang) => <ListBox.Item key={lang} id={lang}>{lang}</ListBox.Item>)}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {/* Searchable Country with Filter */}
                  <div>
                    <FormLabel info="Search & select primary geography">Country</FormLabel>
                    <Select selectedKey={country} onSelectionChange={(key) => key && setCountry(key as string)} className="w-full" aria-label="Country">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <div className="p-2 border-b border-divider sticky top-0 bg-content1 z-10">
                          <Input
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full h-8 px-2.5 text-xs bg-default-100 text-foreground border border-divider rounded-lg"
                          />
                        </div>
                        <ListBox className="max-h-56 overflow-y-auto">
                          {filteredCountries.map((c) => <ListBox.Item key={c} id={c}>{c}</ListBox.Item>)}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 2. Brand */}
          <Accordion.Item key="brand" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Sparkles className="size-4 text-default-500" /> Brand
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Premade Brand Voice Selection */}
                  <div>
                    <FormLabel info="Select premade brand voice archetype">Brand Voice (Premade Selector)</FormLabel>
                    <Select selectedKey={brandVoice} onSelectionChange={(key) => key && setBrandVoice(key as string)} className="w-full" aria-label="Brand Voice">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{PREMADE_BRAND_VOICES.map((bv) => <ListBox.Item key={bv} id={bv}>{bv}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {/* Comprehensive Tone Selector */}
                  <div>
                    <FormLabel info="Emotional tone and resonance">Tone (All Tone Types)</FormLabel>
                    <Select selectedKey={tone} onSelectionChange={(key) => key && setTone(key as string)} className="w-full" aria-label="Tone">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{ALL_TONES.map((t) => <ListBox.Item key={t} id={t}>{t}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                {/* Target Audience Multiple Tag / Tab Add System */}
                <div className="space-y-3">
                  <FormLabel info="Add multiple target audience personas as removable tags">Target Audience Personas (Multiple Add)</FormLabel>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="e.g. DevOps Engineers"
                      value={newAudienceInput}
                      onChange={(e) => setNewAudienceInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddAudience(); } }}
                      className="flex-1 h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                    <Button type="button" size="sm" onPress={handleAddAudience} className="font-medium">
                      <Plus className="size-4" /> Add Persona
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {targetAudiences.map((tag) => (
                      <Chip
                        key={tag}
                        variant="secondary"
                        size="sm"
                        className="bg-default-100 dark:bg-default-50/60 text-foreground font-medium border border-divider px-2.5 py-1 inline-flex items-center gap-1.5"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAudience(tag)}
                          className="hover:text-danger text-default-400 transition-colors"
                          aria-label={`Remove ${tag}`}
                        >
                          <X className="size-3" />
                        </button>
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Writing Style Described with WYSIWYG Rich Text Editor */}
                <div className="space-y-2">
                  <FormLabel info="Describe editorial writing rules using rich formatting">Writing Style Description (Rich Text Editor)</FormLabel>
                  <div className="border border-divider rounded-2xl bg-default-50/60 dark:bg-default-50/10 overflow-hidden">
                    {/* Rich Text Formatting Toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-default-100/80 dark:bg-default-50/40 border-b border-divider flex-wrap text-default-500">
                      <button type="button" className="p-1.5 hover:bg-background rounded-lg transition-colors" title="Bold"><Bold className="size-3.5" /></button>
                      <button type="button" className="p-1.5 hover:bg-background rounded-lg transition-colors" title="Italic"><Italic className="size-3.5" /></button>
                      <button type="button" className="p-1.5 hover:bg-background rounded-lg transition-colors" title="Underline"><Underline className="size-3.5" /></button>
                      <div className="h-4 w-px bg-divider mx-1" />
                      <button type="button" className="p-1.5 hover:bg-background rounded-lg transition-colors" title="Bullet List"><List className="size-3.5" /></button>
                      <button type="button" className="p-1.5 hover:bg-background rounded-lg transition-colors" title="Numbered List"><ListOrdered className="size-3.5" /></button>
                      <div className="h-4 w-px bg-divider mx-1" />
                      <button type="button" className="p-1.5 hover:bg-background rounded-lg transition-colors" title="Code Block"><Code className="size-3.5" /></button>
                      <button type="button" className="p-1.5 hover:bg-background rounded-lg transition-colors" title="Blockquote"><Quote className="size-3.5" /></button>
                      <button type="button" className="p-1.5 hover:bg-background rounded-lg transition-colors" title="Insert Link"><LinkIcon className="size-3.5" /></button>
                    </div>
                    
                    {/* Rich Formatted Editor Area */}
                    <textarea
                      rows={4}
                      value={writingStyleRich}
                      onChange={(e) => setWritingStyleRich(e.target.value)}
                      className="w-full p-4 text-xs font-mono bg-white dark:bg-background text-foreground focus:outline-none transition-colors border-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="Depth of technical vocabulary">Expertise Level</FormLabel>
                    <Select selectedKey={expertiseLevel} onSelectionChange={(key) => key && setExpertiseLevel(key as string)} className="w-full" aria-label="Expertise Level">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{EXPERTISE_LEVELS.map((e) => <ListBox.Item key={e} id={e}>{e}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <TextField name="brandGuidelines">
                    <FormLabel info="Detailed style rules & editorial guidelines">Brand Guidelines</FormLabel>
                    <Input
                      placeholder="e.g. Always capitalize product names, use active voice..."
                      value={brandGuidelines}
                      onChange={(e) => setBrandGuidelines(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <TextField name="customInstructions">
                  <FormLabel info="System prompt directives for AI writers">Custom Instructions</FormLabel>
                  <textarea
                    rows={2}
                    placeholder="Direct LLM instructions e.g. Always include a 3-sentence executive summary..."
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    className="w-full p-3 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 3. CMS */}
          <Accordion.Item key="cms" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Database className="size-4 text-default-500" /> CMS
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div>
                  <FormLabel info="Select target publishing CMS destination">CMS Connection</FormLabel>
                  <Select selectedKey={selectedCms} onSelectionChange={(key) => key && setSelectedCms(key as string)} className="w-full" aria-label="CMS Connection">
                    <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                      <Select.Value /><Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>{CMS_OPTIONS.map((cms) => <ListBox.Item key={cms.value} id={cms.value}>{cms.label}</ListBox.Item>)}</ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="p-5 bg-default-50/80 dark:bg-default-50/10 rounded-2xl border border-divider space-y-5">
                  <div className="text-xs font-bold flex items-center gap-2 text-foreground">
                    <ShieldCheck className="size-4 text-emerald-500" /> {selectedCms} API Security Credentials
                  </div>
                  {cmsConfig.fields.map((fieldLabel) => (
                    <TextField key={fieldLabel} name={fieldLabel}>
                      <FormLabel info={`Authentication key required for ${selectedCms}`}>{fieldLabel}</FormLabel>
                      <Input
                        type={fieldLabel.toLowerCase().includes("key") || fieldLabel.toLowerCase().includes("password") || fieldLabel.toLowerCase().includes("secret") || fieldLabel.toLowerCase().includes("token") ? "password" : "text"}
                        placeholder={`Enter ${fieldLabel}`}
                        value={cmsCredentials[fieldLabel] || ""}
                        onChange={(e) => setCmsCredentials({ ...cmsCredentials, [fieldLabel]: e.target.value })}
                        className="w-full h-10 px-3.5 text-xs bg-white dark:bg-background text-foreground border border-divider rounded-xl focus:border-primary focus:outline-none transition-colors"
                      />
                    </TextField>
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 4. Publishing */}
          <Accordion.Item key="publishing" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Send className="size-4 text-default-500" /> Publishing
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="Structure of published post permalinks">URL Slug Format</FormLabel>
                    <Select selectedKey={slugFormat} onSelectionChange={(key) => key && setSlugFormat(key as string)} className="w-full" aria-label="URL Slug Format">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{URL_SLUG_FORMATS.map((fmt) => <ListBox.Item key={fmt} id={fmt}>{fmt}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Default comment policy on new posts">Comments</FormLabel>
                    <Select selectedKey={comments} onSelectionChange={(key) => key && setComments(key as string)} className="w-full" aria-label="Comments">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{COMMENT_MODES.map((cm) => <ListBox.Item key={cm} id={cm}>{cm}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                  <div>
                    <div className="text-xs font-bold text-foreground">Ping Search Engines</div>
                    <div className="text-[11px] text-default-400">Automatically submit index request to Google & Bing upon publishing</div>
                  </div>
                  <Switch isSelected={pingSearchEngines} onChange={(v) => setPingSearchEngines(v)} aria-label="Ping Search Engines" />
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 5. Content (Primary & Secondary languages removed) */}
          <Accordion.Item key="content" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <FileText className="size-4 text-default-500" /> Content
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="categories">
                    <FormLabel info="Comma-separated category list">Categories</FormLabel>
                    <Input
                      placeholder="e.g. Artificial Intelligence, Cloud, Cybersecurity"
                      value={categories}
                      onChange={(e) => setCategories(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="topics">
                    <FormLabel info="Primary topic focus clusters">Topics</FormLabel>
                    <Input
                      placeholder="e.g. LLMs, Autonomous Agents, Developer Tools"
                      value={topics}
                      onChange={(e) => setTopics(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="Primary content format">Content Types</FormLabel>
                    <Select selectedKey={contentType} onSelectionChange={(key) => key && setContentType(key as string)} className="w-full" aria-label="Content Types">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{CONTENT_TYPES.map((ct) => <ListBox.Item key={ct} id={ct}>{ct}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Target word count length">Content Length</FormLabel>
                    <Select selectedKey={contentLength} onSelectionChange={(key) => key && setContentLength(key as string)} className="w-full" aria-label="Content Length">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{CONTENT_LENGTHS.map((cl) => <ListBox.Item key={cl} id={cl}>{cl}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="includeKeywords">
                    <FormLabel info="Keywords mandatory for inclusion">Include Keywords</FormLabel>
                    <Input
                      placeholder="e.g. AI platform, autonomous agent, LLM"
                      value={includeKeywords}
                      onChange={(e) => setIncludeKeywords(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="excludeKeywords">
                    <FormLabel info="Negative keywords to avoid">Exclude Keywords</FormLabel>
                    <Input
                      placeholder="e.g. cheap, free, competitor brand"
                      value={excludeKeywords}
                      onChange={(e) => setExcludeKeywords(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <TextField name="restrictedTopics">
                  <FormLabel info="Sensitive or off-limit subjects">Restricted Topics</FormLabel>
                  <textarea
                    rows={2}
                    placeholder="List topics or subjects to strictly filter out..."
                    value={restrictedTopics}
                    onChange={(e) => setRestrictedTopics(e.target.value)}
                    className="w-full p-3 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>

                <TextField name="contentGuidelines">
                  <FormLabel info="Additional content formatting rules">Content Guidelines</FormLabel>
                  <textarea
                    rows={2}
                    placeholder="Specific guidelines for intro, formatting, tables, CTAs..."
                    value={contentGuidelines}
                    onChange={(e) => setContentGuidelines(e.target.value)}
                    className="w-full p-3 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 6. Workflow (Default agent group removed) */}
          <Accordion.Item key="workflow" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <GitBranch className="size-4 text-default-500" /> Workflow
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <FormLabel info="Primary visual node graph blueprint">Default Workflow</FormLabel>
                    <Select selectedKey={selectedWorkflow} onSelectionChange={(key) => key && setSelectedWorkflow(key as string)} className="w-full" aria-label="Default Workflow">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{WORKFLOWS.map((wf) => <ListBox.Item key={wf} id={wf}>{wf}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Approval requirement before CMS publish">Approval Mode</FormLabel>
                    <Select selectedKey={approvalMode} onSelectionChange={(key) => key && setApprovalMode(key as string)} className="w-full" aria-label="Approval Mode">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{APPROVAL_MODES.map((am) => <ListBox.Item key={am} id={am}>{am}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Alert channel for pipeline updates">Notification Workflow</FormLabel>
                    <Select selectedKey={notificationWorkflow} onSelectionChange={(key) => key && setNotificationWorkflow(key as string)} className="w-full" aria-label="Notification Workflow">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{NOTIFICATION_WORKFLOWS.map((nw) => <ListBox.Item key={nw} id={nw}>{nw}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 7. SEO */}
          <Accordion.Item key="seo" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Search className="size-4 text-default-500" /> SEO
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="Target CMS SEO plugin integration">SEO Plugin</FormLabel>
                    <Select selectedKey={seoPlugin} onSelectionChange={(key) => key && setSeoPlugin(key as string)} className="w-full" aria-label="SEO Plugin">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{SEO_PLUGINS.map((sp) => <ListBox.Item key={sp} id={sp}>{sp}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Robots indexing policy">Robots</FormLabel>
                    <Select selectedKey={robots} onSelectionChange={(key) => key && setRobots(key as string)} className="w-full" aria-label="Robots">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{ROBOTS_OPTIONS.map((r) => <ListBox.Item key={r} id={r}>{r}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="metaTitleTemplate">
                    <FormLabel info="Pattern with {{article_title}} placeholder">Meta Title Template</FormLabel>
                    <Input
                      value={metaTitleTemplate}
                      onChange={(e) => setMetaTitleTemplate(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="metaDescTemplate">
                    <FormLabel info="Pattern with {{excerpt}} placeholder">Meta Description Template</FormLabel>
                    <Input
                      value={metaDescTemplate}
                      onChange={(e) => setMetaDescTemplate(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <FormLabel info="Canonical tag generation mode">Canonical URL</FormLabel>
                    <Select selectedKey={canonicalUrl} onSelectionChange={(key) => key && setCanonicalUrl(key as string)} className="w-full" aria-label="Canonical URL">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{CANONICAL_OPTIONS.map((c) => <ListBox.Item key={c} id={c}>{c}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Twitter card format">Twitter Card</FormLabel>
                    <Select selectedKey={twitterCard} onSelectionChange={(key) => key && setTwitterCard(key as string)} className="w-full" aria-label="Twitter Card">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{TWITTER_CARDS.map((tc) => <ListBox.Item key={tc} id={tc}>{tc}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Structured data JSON-LD schema">Schema</FormLabel>
                    <Select selectedKey={schemaType} onSelectionChange={(key) => key && setSchemaType(key as string)} className="w-full" aria-label="Schema">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{SCHEMAS.map((sch) => <ListBox.Item key={sch} id={sch}>{sch}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center justify-between p-3.5 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                    <span className="text-xs font-bold text-foreground">Open Graph</span>
                    <Switch isSelected={openGraph} onChange={(v) => setOpenGraph(v)} aria-label="Open Graph" />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                    <span className="text-xs font-bold text-foreground">Breadcrumbs</span>
                    <Switch isSelected={breadcrumbs} onChange={(v) => setBreadcrumbs(v)} aria-label="Breadcrumbs" />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                    <span className="text-xs font-bold text-foreground">Sitemap</span>
                    <Switch isSelected={sitemap} onChange={(v) => setSitemap(v)} aria-label="Sitemap" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                  <div>
                    <div className="text-xs font-bold text-foreground">Indexing</div>
                    <div className="text-[11px] text-default-400">Auto-submit new posts to Google Indexing API & IndexNow network</div>
                  </div>
                  <Switch isSelected={autoIndexing} onChange={(v) => setAutoIndexing(v)} aria-label="Indexing" />
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 8. Media */}
          <Accordion.Item key="media" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <ImageIcon className="size-4 text-default-500" /> Media
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="AI image synthesis model engine">Featured Image</FormLabel>
                    <Select selectedKey={featuredImageProvider} onSelectionChange={(key) => key && setFeaturedImageProvider(key as string)} className="w-full" aria-label="Featured Image">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{FEATURED_IMAGES.map((fi) => <ListBox.Item key={fi} id={fi}>{fi}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Image dimensions ratio">Aspect Ratio</FormLabel>
                    <Select selectedKey={aspectRatio} onSelectionChange={(key) => key && setAspectRatio(key as string)} className="w-full" aria-label="Aspect Ratio">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{ASPECT_RATIOS.map((ar) => <ListBox.Item key={ar} id={ar}>{ar}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <FormLabel info="Resolution scale">Image Size</FormLabel>
                    <Select selectedKey={imageSize} onSelectionChange={(key) => key && setImageSize(key as string)} className="w-full" aria-label="Image Size">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{IMAGE_SIZES.map((is) => <ListBox.Item key={is} id={is}>{is}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Format compression type">Compression</FormLabel>
                    <Select selectedKey={compression} onSelectionChange={(key) => key && setCompression(key as string)} className="w-full" aria-label="Compression">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{COMPRESSIONS.map((comp) => <ListBox.Item key={comp} id={comp}>{comp}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Alt text generation logic">Alt Text</FormLabel>
                    <Select selectedKey={altTextMode} onSelectionChange={(key) => key && setAltTextMode(key as string)} className="w-full" aria-label="Alt Text">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{ALT_TEXT_MODES.map((alt) => <ListBox.Item key={alt} id={alt}>{alt}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                  <div>
                    <div className="text-xs font-bold text-foreground">Watermark</div>
                    <div className="text-[11px] text-default-400">Overlay subtle brand logo on generated featured images</div>
                  </div>
                  <Switch isSelected={watermark} onChange={(v) => setWatermark(v)} aria-label="Watermark" />
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 9. Integrations */}
          <Accordion.Item key="integrations" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Plug className="size-4 text-default-500" /> Integrations
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="gaId">
                    <FormLabel info="Google Analytics GA4 Measurement ID">Google Analytics</FormLabel>
                    <Input
                      placeholder="e.g. G-XXXXXXXXXX"
                      value={gaId}
                      onChange={(e) => setGaId(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="gscUrl">
                    <FormLabel info="Google Search Console property site URL">Google Search Console</FormLabel>
                    <Input
                      placeholder="e.g. sc-domain:techpulsedaily.io"
                      value={gscUrl}
                      onChange={(e) => setGscUrl(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TextField name="gAdsId">
                    <FormLabel info="Google Ads Tag ID">Google Ads</FormLabel>
                    <Input
                      placeholder="e.g. AW-123456789"
                      value={gAdsId}
                      onChange={(e) => setGAdsId(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="clarityId">
                    <FormLabel info="Microsoft Clarity Project ID">Microsoft Clarity</FormLabel>
                    <Input
                      placeholder="e.g. clarity_proj_xyz"
                      value={clarityId}
                      onChange={(e) => setClarityId(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="bingKey">
                    <FormLabel info="Bing Webmaster API Key">Bing Webmaster</FormLabel>
                    <Input
                      type="password"
                      placeholder="e.g. bing_api_key_xxx"
                      value={bingKey}
                      onChange={(e) => setBingKey(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <TextField name="customIntegrations">
                  <FormLabel info="Custom tracking codes or header script snippets">Custom Integrations</FormLabel>
                  <textarea
                    rows={3}
                    placeholder="Enter custom HTML/JS tracking tags..."
                    value={customIntegrations}
                    onChange={(e) => setCustomIntegrations(e.target.value)}
                    className="w-full p-3 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 10. Security */}
          <Accordion.Item key="security" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Shield className="size-4 text-default-500" /> Security
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="webhookUrl">
                    <FormLabel info="Endpoint for receiving publishing event webhooks">Webhooks URL</FormLabel>
                    <Input
                      placeholder="https://api.techpulsedaily.io/webhooks/publishing"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="ipWhitelist">
                    <FormLabel info="Comma separated list of allowed IP addresses">IP Whitelist</FormLabel>
                    <Input
                      placeholder="e.g. 192.168.1.1, 10.0.0.1"
                      value={ipWhitelist}
                      onChange={(e) => setIpWhitelist(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="secretKey">
                    <FormLabel info="Bearer token for site API authentication">Secret Keys</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter secret key or bearer token"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <div>
                    <FormLabel info="Scoped user access role">Permissions Role</FormLabel>
                    <Select selectedKey={permissionsRole} onSelectionChange={(key) => key && setPermissionsRole(key as string)} className="w-full" aria-label="Permissions Role">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{PERMISSION_ROLES.map((pr) => <ListBox.Item key={pr} id={pr}>{pr}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center justify-between p-3.5 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                    <span className="text-xs font-bold text-foreground">API Access</span>
                    <Switch isSelected={apiAccess} onChange={(v) => setApiAccess(v)} aria-label="API Access" />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                    <span className="text-xs font-bold text-foreground">Audit Logs</span>
                    <Switch isSelected={auditLogs} onChange={(v) => setAuditLogs(v)} aria-label="Audit Logs" />
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 11. Analytics */}
          <Accordion.Item key="analytics" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <BarChart3 className="size-4 text-default-500" /> Analytics
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="Frequency of automated performance report digests">Reporting Frequency</FormLabel>
                    <Select selectedKey={reportFreq} onSelectionChange={(key) => key && setReportFreq(key as string)} className="w-full" aria-label="Reporting Frequency">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{REPORTING_FREQUENCIES.map((rf) => <ListBox.Item key={rf} id={rf}>{rf}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Layout preset for website analytics">KPI Dashboard</FormLabel>
                    <Select selectedKey={kpiDashboard} onSelectionChange={(key) => key && setKpiDashboard(key as string)} className="w-full" aria-label="KPI Dashboard">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{DASHBOARD_KPIS.map((kd) => <ListBox.Item key={kd} id={kd}>{kd}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                  <div>
                    <div className="text-xs font-bold text-foreground">Performance Tracking</div>
                    <div className="text-[11px] text-default-400">Track article rankings, CTR, and search traffic velocity in background</div>
                  </div>
                  <Switch isSelected={perfTracking} onChange={(v) => setPerfTracking(v)} aria-label="Performance Tracking" />
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 12. Advanced */}
          <Accordion.Item key="advanced" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Sliders className="size-4 text-default-500" /> Advanced
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <FormLabel info="Deployment target environment">Environment</FormLabel>
                    <Select selectedKey={environment} onSelectionChange={(key) => key && setEnvironment(key as string)} className="w-full" aria-label="Environment">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{ENVIRONMENTS.map((env) => <ListBox.Item key={env} id={env}>{env}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Maximum outbound requests per minute">Rate Limits</FormLabel>
                    <Select selectedKey={rateLimit} onSelectionChange={(key) => key && setRateLimit(key as string)} className="w-full" aria-label="Rate Limits">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{RATE_LIMITS.map((rl) => <ListBox.Item key={rl} id={rl}>{rl}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Queue dispatch priority">Queue Priority</FormLabel>
                    <Select selectedKey={queuePriority} onSelectionChange={(key) => key && setQueuePriority(key as string)} className="w-full" aria-label="Queue Priority">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{QUEUE_PRIORITIES.map((qp) => <ListBox.Item key={qp} id={qp}>{qp}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="customVariables">
                    <FormLabel info="JSON key-value pairs for prompt templates">Custom Variables</FormLabel>
                    <textarea
                      rows={2}
                      placeholder='{"site_cta": "Subscribe for more", "affiliate_tag": "techpulse-20"}'
                      value={customVariables}
                      onChange={(e) => setCustomVariables(e.target.value)}
                      className="w-full p-3 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="customHeaders">
                    <FormLabel info="Custom HTTP Headers for API calls">Headers</FormLabel>
                    <textarea
                      rows={2}
                      placeholder='{"X-Custom-Header": "AIPub-OS-v1"}'
                      value={customHeaders}
                      onChange={(e) => setCustomHeaders(e.target.value)}
                      className="w-full p-3 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <TextField name="apiOverrides">
                  <FormLabel info="Custom API proxy host URL">API Overrides</FormLabel>
                  <Input
                    placeholder="https://proxy.techpulsedaily.io/api/v1"
                    value={apiOverrides}
                    onChange={(e) => setApiOverrides(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center justify-between p-3.5 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                    <span className="text-xs font-bold text-foreground">Cache</span>
                    <Switch isSelected={enableCache} onChange={(v) => setEnableCache(v)} aria-label="Cache" />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                    <span className="text-xs font-bold text-foreground">Debug Mode</span>
                    <Switch isSelected={debugMode} onChange={(v) => setDebugMode(v)} aria-label="Debug Mode" />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                    <span className="text-xs font-bold text-foreground">Experimental</span>
                    <Switch isSelected={experimentalFeatures} onChange={(v) => setExperimentalFeatures(v)} aria-label="Experimental Features" />
                  </div>
                </div>

                <TextField name="notes">
                  <FormLabel info="Internal administrative notes">Notes</FormLabel>
                  <textarea
                    rows={2}
                    placeholder="Internal team notes regarding this website property..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

        </Accordion>
      </Form>
    </div>
  )
}
