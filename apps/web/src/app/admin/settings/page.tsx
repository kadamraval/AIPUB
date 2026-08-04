"use client"

import React, { useState } from "react"
import {
  Button, Form, TextField, Label, Input, Select, ListBox, Tooltip, Accordion, Switch, Chip
} from "@heroui/react"
import {
  Save, Settings, Brain, Search, Database, Shield, Key, CheckCircle2, Info, ChevronDown,
  Puzzle, User, Bell, Lock, Globe, HardDrive, Cpu, Copy
} from "lucide-react"

const TIMEZONES = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Tokyo", "Europe/Paris"]
const LANGUAGES = ["English (US)", "English (UK)", "Spanish", "German", "French", "Japanese", "Chinese", "Portuguese"]
const DATE_FORMATS = ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "MMM D, YYYY"]
const TIME_FORMATS = ["24 Hour (14:30)", "12 Hour (2:30 PM)"]

const TEXT_GEN_PROVIDERS = ["OpenAI (GPT-4o)", "Anthropic (Claude 3.5 Sonnet)", "Google (Gemini 1.5 Pro)", "Groq (Llama 3.3 70B)", "Mistral (Mistral Large)"]
const IMAGE_GEN_PROVIDERS = ["fal.ai (FLUX.1 Dev)", "OpenAI (DALL-E 3)", "Stability AI (SD3.5)", "Midjourney API"]
const VIDEO_GEN_PROVIDERS = ["Runway (Gen-3 Alpha)", "Luma (Dream Machine)", "Pika 1.5", "HeyGen AI Avatar"]
const AUDIO_GEN_PROVIDERS = ["ElevenLabs Text-to-Speech", "OpenAI TTS-1-HD", "PlayHT v2"]
const VISION_PROVIDERS = ["OpenAI (GPT-4o Vision)", "Google (Gemini 1.5 Flash)", "Claude (3.5 Sonnet Vision)"]
const EMBEDDINGS_PROVIDERS = ["OpenAI text-embedding-3-large", "Cohere Embed v3", "Voyage AI 3"]

const WEB_SEARCH_PROVIDERS = ["Tavily AI Search API", "SerpAPI Google Search", "Perplexity Sonar API", "Exa AI Search"]
const WEB_CRAWLING_PROVIDERS = ["Firecrawl Scraper API", "Puppeteer Headless Cluster", "Jina Reader API", "Scrapeninja"]
const KEYWORD_RESEARCH_PROVIDERS = ["DataForSEO Live API", "SEMrush Keyword API", "Ahrefs Keyword API"]
const DUPLICATE_DETECTION_PROVIDERS = ["Copyleaks Plagiarism API", "Internal Vector Cosine Similarity", "LanguageTool Pro API"]

const FILE_STORAGE_PROVIDERS = ["AWS S3 Bucket", "Cloudflare R2", "Google Cloud Storage", "Vercel Blob"]
const EMAIL_PROVIDERS = ["Resend Email API", "SendGrid Transactional", "Postmark", "Mailgun"]

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

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // Profile Settings
  const [fullName, setFullName] = useState("Kadam Raval")
  const [email, setEmail] = useState("kadam@aipublishing.os")
  const [jobTitle, setJobTitle] = useState("Chief Publishing Officer")

  // General Platform Settings
  const [appName, setAppName] = useState("AI Publishing OS")
  const [timezone, setTimezone] = useState("UTC")
  const [language, setLanguage] = useState("English (US)")
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD")
  const [timeFormat, setTimeFormat] = useState("24 Hour (14:30)")

  // AI Providers & Models
  const [textGen, setTextGen] = useState("OpenAI (GPT-4o)")
  const [imgGen, setImgGen] = useState("fal.ai (FLUX.1 Dev)")
  const [vidGen, setVidGen] = useState("Runway (Gen-3 Alpha)")
  const [audioGen, setAudioGen] = useState("ElevenLabs Text-to-Speech")
  const [visionAnalysis, setVisionAnalysis] = useState("OpenAI (GPT-4o Vision)")
  const [embeddings, setEmbeddings] = useState("OpenAI text-embedding-3-large")

  // API Keys & Credentials
  const [openaiKey, setOpenaiKey] = useState("sk-proj-........................")
  const [anthropicKey, setAnthropicKey] = useState("sk-ant-........................")
  const [falAiKey, setFalAiKey] = useState("fal-key-........................")
  const [googleKey, setGoogleKey] = useState("AIzaSy........................")
  const [groqKey, setGroqKey] = useState("gsk_........................")

  // Web & Search Scrapers
  const [webSearch, setWebSearch] = useState("Tavily AI Search API")
  const [webCrawling, setWebCrawling] = useState("Firecrawl Scraper API")
  const [keywordResearch, setKeywordResearch] = useState("DataForSEO Live API")
  const [duplicateDetection, setDuplicateDetection] = useState("Copyleaks Plagiarism API")

  // Services & Infrastructure
  const [fileStorageService, setFileStorageService] = useState("AWS S3 Bucket")
  const [emailService, setEmailService] = useState("Resend Email API")
  const [postgresUri, setPostgresUri] = useState("postgresql://aipub:aipub_secret@localhost:5433/aipub_db")
  const [redisUri, setRedisUri] = useState("redis://localhost:6380")
  const [maxWorkers, setMaxWorkers] = useState("8")

  // Security & Notifications
  const [enable2FA, setEnable2FA] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("60")
  const [notifyOnFailure, setNotifyOnFailure] = useState(true)
  const [slackWebhook, setSlackWebhook] = useState("https://hooks.slack.com/services/T00/B00/XXXX")

  // Multiple Webhooks List State
  const [webhooksList, setWebhooksList] = useState([
    { id: "wh-1", name: "Zapier Social Auto-Post", url: "https://hooks.zapier.com/v1/aipub", type: "Outbound", events: "Article.Published", secret: "whsec_zapier123", status: "Active" },
    { id: "wh-2", name: "n8n Workflow Trigger", url: "https://n8n.internal/webhook/trigger", type: "Inbound", events: "Workflow.Started", secret: "whsec_n8n456", status: "Active" },
    { id: "wh-3", name: "Production Analytics", url: "https://api.aipub.io/v1/events", type: "Outbound", events: "All Events", secret: "whsec_analytics789", status: "Active" }
  ])

  // AIPUB REST API Keys Manager State
  const [apiKeysList, setApiKeysList] = useState([
    { id: "key-1", name: "Default Production API Key", key: "aipub_sk_live_987654321qwerty", scope: "Full Access", status: "Active", createdAt: "2026-08-01" },
    { id: "key-2", name: "Zapier Integration Key", key: "aipub_sk_live_123456789zapier", scope: "Publishing Only", status: "Active", createdAt: "2026-08-03" }
  ])

  // API Key Creation Form State
  const [showApiKeyForm, setShowApiKeyForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyScope, setNewKeyScope] = useState("Full Access")

  // Webhook Creation Form State
  const [showWebhookForm, setShowWebhookForm] = useState(false)
  const [newWhName, setNewWhName] = useState("")
  const [newWhType, setNewWhType] = useState("Outbound")
  const [newWhUrl, setNewWhUrl] = useState("")
  const [newWhEvents, setNewWhEvents] = useState("Article.Published")
  const [newWhSecret, setNewWhSecret] = useState("")

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)

    setTimeout(() => {
      setMsg("Global settings saved successfully across all tenant pipelines.")
      setSaving(false)
    }, 500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 px-4 sm:px-6">
      <Form onSubmit={handleSave} className="space-y-6">
        {/* Navigation Sticky Top Action Bar */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-background/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-divider flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
              <Settings className="size-4 text-primary" /> Global Platform Settings
            </h1>
            <p className="text-xs text-default-400 font-normal">Configure system identity, AI model engines, API keys, and database quotas.</p>
          </div>

          <Button
            type="submit"
            size="sm"
            isDisabled={saving}
            className="font-medium px-5"
          >
            <Save className="size-3.5" /> {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        {msg && (
          <div className="p-4 bg-success-50 border border-success-200 text-success-700 text-xs rounded-2xl flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="size-4 shrink-0 text-success" />
            <span className="font-semibold">{msg}</span>
          </div>
        )}

        {/* Short Accordion titles with subtle monochrome icon on left */}
        <Accordion className="w-full space-y-3">
          {/* Section 1: Profile */}
          <Accordion.Item key="profile" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <User className="size-4 text-default-500" /> Profile
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="fullName">
                    <FormLabel info="Full display name for author attribution">Full Name *</FormLabel>
                    <Input
                      placeholder="e.g. Kadam Raval"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="email">
                    <FormLabel info="Account email address for system alerts">Email Address *</FormLabel>
                    <Input
                      type="email"
                      placeholder="e.g. kadam@aipublishing.os"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <TextField name="jobTitle">
                  <FormLabel info="Role title inside organization">Job Title</FormLabel>
                  <Input
                    placeholder="Chief Publishing Officer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Section 2: General */}
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
                <TextField name="appName">
                  <FormLabel info="Application title displayed on navigation sidebar">Application Title *</FormLabel>
                  <Input
                    placeholder="AI Publishing OS"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    required
                    className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="Default timezone for article schedules">Timezone</FormLabel>
                    <Select
                      selectedKey={timezone}
                      onSelectionChange={(key) => key && setTimezone(key as string)}
                      className="w-full"
                      aria-label="Timezone"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {TIMEZONES.map((tz) => (
                            <ListBox.Item key={tz} id={tz}>{tz}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="System interface language">Language</FormLabel>
                    <Select
                      selectedKey={language}
                      onSelectionChange={(key) => key && setLanguage(key as string)}
                      className="w-full"
                      aria-label="Language"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {LANGUAGES.map((l) => (
                            <ListBox.Item key={l} id={l}>{l}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="Display date format string">Date Format</FormLabel>
                    <Select
                      selectedKey={dateFormat}
                      onSelectionChange={(key) => key && setDateFormat(key as string)}
                      className="w-full"
                      aria-label="Date Format"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {DATE_FORMATS.map((df) => (
                            <ListBox.Item key={df} id={df}>{df}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Display time format style">Time Format</FormLabel>
                    <Select
                      selectedKey={timeFormat}
                      onSelectionChange={(key) => key && setTimeFormat(key as string)}
                      className="w-full"
                      aria-label="Time Format"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {TIME_FORMATS.map((tf) => (
                            <ListBox.Item key={tf} id={tf}>{tf}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Section 3: AI Engine */}
          <Accordion.Item key="ai-engine" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Brain className="size-4 text-default-500" /> AI Engine
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
                    <FormLabel info="Primary LLM engine for article generation">Text Generation Engine</FormLabel>
                    <Select
                      selectedKey={textGen}
                      onSelectionChange={(key) => key && setTextGen(key as string)}
                      className="w-full"
                      aria-label="Text Generation Engine"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {TEXT_GEN_PROVIDERS.map((p) => (
                            <ListBox.Item key={p} id={p}>{p}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Primary image generation service">Image Generation Engine</FormLabel>
                    <Select
                      selectedKey={imgGen}
                      onSelectionChange={(key) => key && setImgGen(key as string)}
                      className="w-full"
                      aria-label="Image Generation Engine"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {IMAGE_GEN_PROVIDERS.map((p) => (
                            <ListBox.Item key={p} id={p}>{p}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="Primary video generation model">Video Generation Engine</FormLabel>
                    <Select
                      selectedKey={vidGen}
                      onSelectionChange={(key) => key && setVidGen(key as string)}
                      className="w-full"
                      aria-label="Video Generation Engine"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {VIDEO_GEN_PROVIDERS.map((p) => (
                            <ListBox.Item key={p} id={p}>{p}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Voice synthesis engine for podcasts">Audio Generation Engine</FormLabel>
                    <Select
                      selectedKey={audioGen}
                      onSelectionChange={(key) => key && setAudioGen(key as string)}
                      className="w-full"
                      aria-label="Audio Generation Engine"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {AUDIO_GEN_PROVIDERS.map((p) => (
                            <ListBox.Item key={p} id={p}>{p}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Section 4: API Keys */}
          <Accordion.Item key="api-keys" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Key className="size-4 text-default-500" /> API Keys
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="openaiKey">
                    <FormLabel info="OpenAI API Secret Key">OpenAI API Key</FormLabel>
                    <Input
                      type="password"
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="anthropicKey">
                    <FormLabel info="Anthropic Claude API Secret Key">Anthropic API Key</FormLabel>
                    <Input
                      type="password"
                      value={anthropicKey}
                      onChange={(e) => setAnthropicKey(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TextField name="falAiKey">
                    <FormLabel info="fal.ai FLUX image engine key">fal.ai API Key</FormLabel>
                    <Input
                      type="password"
                      value={falAiKey}
                      onChange={(e) => setFalAiKey(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="googleKey">
                    <FormLabel info="Google Gemini Vision key">Google Gemini Key</FormLabel>
                    <Input
                      type="password"
                      value={googleKey}
                      onChange={(e) => setGoogleKey(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="groqKey">
                    <FormLabel info="Groq ultra-fast Llama key">Groq API Key</FormLabel>
                    <Input
                      type="password"
                      value={groqKey}
                      onChange={(e) => setGroqKey(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Section 5: Web & Search Scrapers */}
          <Accordion.Item key="search-crawlers" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Search className="size-4 text-default-500" /> Web Scrapers
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
                    <FormLabel info="Live web search indexing service">Web Search Provider</FormLabel>
                    <Select
                      selectedKey={webSearch}
                      onSelectionChange={(key) => key && setWebSearch(key as string)}
                      className="w-full"
                      aria-label="Web Search Provider"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {WEB_SEARCH_PROVIDERS.map((p) => (
                            <ListBox.Item key={p} id={p}>{p}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Headless browser parsing scraper">Web Crawling Scraper</FormLabel>
                    <Select
                      selectedKey={webCrawling}
                      onSelectionChange={(key) => key && setWebCrawling(key as string)}
                      className="w-full"
                      aria-label="Web Crawling Scraper"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {WEB_CRAWLING_PROVIDERS.map((p) => (
                            <ListBox.Item key={p} id={p}>{p}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="Keyword volume and SERP data provider">Keyword Research API</FormLabel>
                    <Select
                      selectedKey={keywordResearch}
                      onSelectionChange={(key) => key && setKeywordResearch(key as string)}
                      className="w-full"
                      aria-label="Keyword Research API"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {KEYWORD_RESEARCH_PROVIDERS.map((p) => (
                            <ListBox.Item key={p} id={p}>{p}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div>
                    <FormLabel info="Plagiarism & originality detector">Duplicate Content Detector</FormLabel>
                    <Select
                      selectedKey={duplicateDetection}
                      onSelectionChange={(key) => key && setDuplicateDetection(key as string)}
                      className="w-full"
                      aria-label="Duplicate Content Detector"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {DUPLICATE_DETECTION_PROVIDERS.map((p) => (
                            <ListBox.Item key={p} id={p}>{p}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Section 6: Infrastructure & Database */}
          <Accordion.Item key="infrastructure" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Database className="size-4 text-default-500" /> Database & Infrastructure
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="postgresUri">
                    <FormLabel info="PostgreSQL database connection URL">PostgreSQL Connection String</FormLabel>
                    <Input
                      type="password"
                      value={postgresUri}
                      onChange={(e) => setPostgresUri(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors font-mono"
                    />
                  </TextField>

                  <TextField name="redisUri">
                    <FormLabel info="Redis queue caching host URI">Redis Cache URL</FormLabel>
                    <Input
                      value={redisUri}
                      onChange={(e) => setRedisUri(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors font-mono"
                    />
                  </TextField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="maxWorkers">
                    <FormLabel info="Max parallel background queue threads">Max Concurrent Background Workers</FormLabel>
                    <Input
                      type="number"
                      min="1"
                      max="32"
                      value={maxWorkers}
                      onChange={(e) => setMaxWorkers(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <div>
                    <FormLabel info="Target file asset storage bucket">Media Asset Storage</FormLabel>
                    <Select
                      selectedKey={fileStorageService}
                      onSelectionChange={(key) => key && setFileStorageService(key as string)}
                      className="w-full"
                      aria-label="Media Asset Storage"
                    >
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {FILE_STORAGE_PROVIDERS.map((p) => (
                            <ListBox.Item key={p} id={p}>{p}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Section 7: Security & Notifications */}
          <Accordion.Item key="security" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Shield className="size-4 text-default-500" /> Security & Notifications
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="flex items-center justify-between p-4 bg-default-50/80 dark:bg-default-50/20 rounded-2xl border border-divider">
                  <div>
                    <div className="text-xs font-bold text-foreground">Enforce Two-Factor Authentication (2FA)</div>
                    <div className="text-[11px] text-default-400">Require TOTP authenticator code for all admin logins</div>
                  </div>
                  <Switch isSelected={enable2FA} onChange={(checked: boolean) => setEnable2FA(checked)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="sessionTimeout">
                    <FormLabel info="Inactivity timeout before re-login (minutes)">Admin Session Inactivity Timeout (Minutes)</FormLabel>
                    <Input
                      type="number"
                      min="5"
                      max="1440"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="slackWebhook">
                    <FormLabel info="Incoming webhook URL for instant failure alerts">Slack Error Notification Webhook</FormLabel>
                    <Input
                      type="url"
                      placeholder="https://hooks.slack.com/services/..."
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Section 8: Developer Settings */}
          <Accordion.Item key="mcp-developer" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Cpu className="size-4 text-default-500" /> Developer
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                {/* MCP Server Config */}
                <div className="p-4 bg-default-50/80 dark:bg-default-50/20 rounded-2xl border border-divider space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">MCP Server</div>
                      <div className="text-[11px] text-default-400">Connect ChatGPT, Claude, Cursor & Codex</div>
                    </div>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-black text-white dark:bg-white dark:text-black uppercase">
                      MCP v1.0
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FormLabel info="Endpoint URL for LLM clients">MCP Server URL</FormLabel>
                      <Input
                        readOnly
                        value="http://localhost:3000/api/mcp"
                        className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <FormLabel info="Bearer token authentication key">MCP Access Key</FormLabel>
                      <Input
                        type="password"
                        value="mcp-secret-key-123456789"
                        className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  {/* MCP Permission Scope */}
                  <div className="p-3 bg-card border border-divider rounded-xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <FormLabel info="Permission role for MCP clients">Permission Scope</FormLabel>
                        <Select
                          selectedKey="write_publish"
                          className="w-full"
                          aria-label="MCP Scope"
                        >
                          <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                            <Select.Value />
                            <Select.Indicator />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              <ListBox.Item id="write_publish">Write & Publish</ListBox.Item>
                              <ListBox.Item id="read_only">Read Only</ListBox.Item>
                              <ListBox.Item id="full_admin">Full Admin</ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-default-100/50 dark:bg-default-50/30 rounded-xl border border-divider">
                        <div>
                          <div className="text-xs font-bold text-foreground">Require Confirmation</div>
                          <div className="text-[11px] text-default-400">Ask in client before publishing</div>
                        </div>
                        <Switch isSelected={true} size="sm" aria-label="Require Approval" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AIPUB REST API Keys Manager */}
                <div className="p-4 bg-default-50/80 dark:bg-default-50/20 rounded-2xl border border-divider space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">AIPUB REST API Keys</div>
                      <div className="text-[11px] text-default-400">Generate secret keys for external REST API requests</div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onPress={() => setShowApiKeyForm(true)}
                    >
                      + Generate API Key
                    </Button>
                  </div>

                  {/* Interactive API Key Creation Card */}
                  {showApiKeyForm && (
                    <div className="p-4 bg-default-100/80 dark:bg-default-50/40 border border-primary/40 rounded-xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">Create New REST API Key</span>
                        <Button type="button" variant="ghost" size="sm" isIconOnly onPress={() => setShowApiKeyForm(false)}>✕</Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <FormLabel info="Name or description for this key">Key Name</FormLabel>
                          <Input
                            placeholder="e.g. Mobile App Key, Analytics Server"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <FormLabel info="Permission role scope">Permission Scope</FormLabel>
                          <Select
                            selectedKey={newKeyScope}
                            onSelectionChange={(key) => key && setNewKeyScope(key as string)}
                            className="w-full"
                            aria-label="New Key Scope"
                          >
                            <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-white dark:bg-content1 text-foreground border border-divider rounded-xl flex items-center justify-between">
                              <Select.Value />
                              <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                              <ListBox>
                                <ListBox.Item id="Full Access">Full Access</ListBox.Item>
                                <ListBox.Item id="Publishing Only">Publishing Only</ListBox.Item>
                                <ListBox.Item id="Read Only">Read Only</ListBox.Item>
                                <ListBox.Item id="Workflow Execution">Workflow Execution</ListBox.Item>
                              </ListBox>
                            </Select.Popover>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <Button type="button" size="sm" variant="ghost" onPress={() => setShowApiKeyForm(false)}>Cancel</Button>
                        <Button
                          type="button"
                          size="sm"
                          onPress={() => {
                            if (!newKeyName.trim()) return
                            const generatedKey = {
                              id: `key-${Date.now()}`,
                              name: newKeyName.trim(),
                              key: `aipub_sk_live_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`,
                              scope: newKeyScope,
                              status: "Active",
                              createdAt: new Date().toISOString().split("T")[0]
                            }
                            setApiKeysList([...apiKeysList, generatedKey])
                            setNewKeyName("")
                            setShowApiKeyForm(false)
                            setMsg(`Created API Key "${generatedKey.name}" with scope "${newKeyScope}"!`)
                            setTimeout(() => setMsg(null), 3000)
                          }}
                        >
                          Generate Key
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* API Keys List */}
                  <div className="space-y-3">
                    {apiKeysList.map((k) => (
                      <div key={k.id} className="p-3.5 bg-card border border-divider rounded-xl space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-foreground">{k.name}</span>

                          <div className="flex items-center gap-2">
                            <Chip variant="soft" color="accent" size="sm">
                              {k.scope}
                            </Chip>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              isIconOnly
                              className="text-danger-500 hover:bg-danger-50 h-7 w-7"
                              onPress={() => setApiKeysList(apiKeysList.filter((item) => item.id !== k.id))}
                            >
                              ✕
                            </Button>
                          </div>
                        </div>

                        <div className="relative flex items-center w-full">
                          <Input
                            type="password"
                            readOnly
                            value={k.key}
                            className="w-full font-mono text-xs pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            isIconOnly
                            className="absolute right-1.5 h-7 w-7 text-default-400 hover:text-foreground"
                            onPress={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(k.key)
                                setMsg(`Copied ${k.name} secret key!`)
                                setTimeout(() => setMsg(null), 2500)
                              }
                            }}
                          >
                            <Copy className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Multiple Webhooks Manager */}
                <div className="p-4 bg-default-50/80 dark:bg-default-50/20 rounded-2xl border border-divider space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">Webhooks Manager</div>
                      <div className="text-[11px] text-default-400">Multiple inbound & outbound endpoints</div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onPress={() => setShowWebhookForm(true)}
                    >
                      + Add Webhook
                    </Button>
                  </div>

                  {/* Interactive Webhook Creation Card */}
                  {showWebhookForm && (
                    <div className="p-4 bg-default-100/80 dark:bg-default-50/40 border border-primary/40 rounded-xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">Create New Webhook Endpoint</span>
                        <Button type="button" variant="ghost" size="sm" isIconOnly onPress={() => setShowWebhookForm(false)}>✕</Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <FormLabel info="Name of the webhook endpoint">Webhook Name</FormLabel>
                          <Input
                            placeholder="e.g. Zapier Auto-Post"
                            value={newWhName}
                            onChange={(e) => setNewWhName(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <FormLabel info="Select webhook direction">Webhook Type</FormLabel>
                          <Select
                            selectedKey={newWhType.toLowerCase()}
                            onSelectionChange={(key) => key && setNewWhType(key === "inbound" ? "Inbound" : "Outbound")}
                            className="w-full"
                            aria-label="New Webhook Type"
                          >
                            <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-white dark:bg-content1 text-foreground border border-divider rounded-xl flex items-center justify-between">
                              <Select.Value />
                              <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                              <ListBox>
                                <ListBox.Item id="outbound">Outbound (Event Push)</ListBox.Item>
                                <ListBox.Item id="inbound">Inbound (Workflow Trigger)</ListBox.Item>
                              </ListBox>
                            </Select.Popover>
                          </Select>
                        </div>

                        <div>
                          <FormLabel info="Target event subscription tag">Subscribed Event Tag</FormLabel>
                          <Select
                            selectedKey={newWhEvents}
                            onSelectionChange={(key) => key && setNewWhEvents(key as string)}
                            className="w-full"
                            aria-label="Event Tag"
                          >
                            <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-white dark:bg-content1 text-foreground border border-divider rounded-xl flex items-center justify-between">
                              <Select.Value />
                              <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                              <ListBox>
                                <ListBox.Item id="Article.Published">Article.Published</ListBox.Item>
                                <ListBox.Item id="Workflow.Started">Workflow.Started</ListBox.Item>
                                <ListBox.Item id="Workflow.Failed">Workflow.Failed</ListBox.Item>
                                <ListBox.Item id="All Events">All Events</ListBox.Item>
                              </ListBox>
                            </Select.Popover>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <FormLabel info="Destination URL endpoint">Endpoint URL</FormLabel>
                          <Input
                            placeholder="https://your-server.com/api/webhook"
                            value={newWhUrl}
                            onChange={(e) => setNewWhUrl(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <FormLabel info="Signing secret key">HMAC Signing Secret</FormLabel>
                          <Input
                            placeholder="whsec_custom123"
                            value={newWhSecret}
                            onChange={(e) => setNewWhSecret(e.target.value)}
                            className="w-full font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <Button type="button" size="sm" variant="ghost" onPress={() => setShowWebhookForm(false)}>Cancel</Button>
                        <Button
                          type="button"
                          size="sm"
                          onPress={() => {
                            if (!newWhName.trim() || !newWhUrl.trim()) return
                            const generatedWh = {
                              id: `wh-${Date.now()}`,
                              name: newWhName.trim(),
                              url: newWhUrl.trim(),
                              type: newWhType,
                              events: newWhEvents,
                              secret: newWhSecret.trim() || `whsec_${Date.now()}`,
                              status: "Active"
                            }
                            setWebhooksList([...webhooksList, generatedWh])
                            setNewWhName("")
                            setNewWhUrl("")
                            setNewWhSecret("")
                            setShowWebhookForm(false)
                            setMsg(`Added Webhook "${generatedWh.name}" (${newWhType})!`)
                            setTimeout(() => setMsg(null), 3000)
                          }}
                        >
                          Add Webhook
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Webhooks Table / List */}
                  <div className="space-y-3">
                    {webhooksList.map((wh) => (
                      <div key={wh.id} className="p-3.5 bg-card border border-divider rounded-xl space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          {/* Static Webhook Name */}
                          <div className="flex items-center gap-2 flex-1 max-w-sm">
                            <span className="text-xs font-bold text-foreground">{wh.name}</span>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-black text-white dark:bg-white dark:text-black uppercase shrink-0">
                              {wh.type}
                            </span>
                            <Chip variant="soft" color="accent" size="sm">
                              {wh.events}
                            </Chip>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Switch
                              isSelected={wh.status === "Active"}
                              onChange={() => {
                                const next = webhooksList.map((w) =>
                                  w.id === wh.id ? { ...w, status: w.status === "Active" ? "Disabled" : "Active" } : w
                                )
                                setWebhooksList(next)
                              }}
                              size="sm"
                              aria-label={`Toggle ${wh.name}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              isIconOnly
                              className="text-danger-500 hover:bg-danger-50 h-7 w-7"
                              onPress={() => setWebhooksList(webhooksList.filter((w) => w.id !== wh.id))}
                            >
                              ✕
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <Input
                            placeholder="Webhook URL"
                            value={wh.url}
                            onChange={(e) => {
                              const val = e.target.value
                              setWebhooksList(webhooksList.map((w) => (w.id === wh.id ? { ...w, url: val } : w)))
                            }}
                            className="w-full"
                          />
                          <Select
                            selectedKey={wh.type.toLowerCase()}
                            onSelectionChange={(key) => {
                              const val = key === "inbound" ? "Inbound" : "Outbound"
                              setWebhooksList(webhooksList.map((w) => (w.id === wh.id ? { ...w, type: val } : w)))
                            }}
                            className="w-full"
                            aria-label="Webhook Type"
                          >
                            <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                              <Select.Value />
                              <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                              <ListBox>
                                <ListBox.Item id="outbound">Outbound (Event)</ListBox.Item>
                                <ListBox.Item id="inbound">Inbound (Trigger)</ListBox.Item>
                              </ListBox>
                            </Select.Popover>
                          </Select>
                          <Input
                            type="password"
                            placeholder="Signing Secret"
                            value={wh.secret}
                            onChange={(e) => {
                              const val = e.target.value
                              setWebhooksList(webhooksList.map((w) => (w.id === wh.id ? { ...w, secret: val } : w)))
                            }}
                            className="w-full font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Form>
    </div>
  )
}
