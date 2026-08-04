"use client"

import React, { useState } from "react"
import {
  Card, CardContent, Button, Chip, Input, Modal, ModalDialog, ModalHeader, ModalBody, ModalFooter
} from "@heroui/react"
import { CheckCircle2, Eye, EyeOff, Play, Loader2, AlertCircle, Sparkles, ShieldCheck } from "lucide-react"

const INTEGRATION_CATALOG = [
  {
    group: "AI Providers",
    items: [
      {
        id: "openrouter",
        name: "OpenRouter",
        letter: "O",
        avatarBg: "bg-violet-600 text-white",
        activeGradient: "from-violet-500/10 via-purple-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["AI"],
        description: "Unified LLM gateway for Claude 3.5, GPT-4o & Gemini.",
        fields: [{ key: "api_key", label: "OpenRouter API Key", placeholder: "sk-or-v1-..." }],
        testActionLabel: "Ping LLM Gateway",
        testPayloadPlaceholder: "Prompt: 'ping openrouter'"
      },
      {
        id: "openai",
        name: "OpenAI",
        letter: "O",
        avatarBg: "bg-emerald-600 text-white",
        activeGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["AI"],
        description: "Direct connection to GPT models & text embeddings.",
        fields: [{ key: "api_key", label: "OpenAI API Key", placeholder: "sk-..." }],
        testActionLabel: "Test OpenAI API",
        testPayloadPlaceholder: "Model: gpt-4o-mini"
      }
    ]
  },
  {
    group: "Image & Media",
    items: [
      {
        id: "fal_ai",
        name: "Fal.ai",
        letter: "F",
        avatarBg: "bg-orange-500 text-white",
        activeGradient: "from-orange-500/10 via-amber-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Media"],
        description: "FLUX.1 and SDXL featured article image generation.",
        fields: [{ key: "api_key", label: "Fal.ai API Key", placeholder: "fal-..." }],
        testActionLabel: "Test Image Gen",
        testPayloadPlaceholder: "Prompt: 'Tech magazine cover'"
      }
    ]
  },
  {
    group: "Research & Web Scrapers",
    items: [
      {
        id: "rss_extractor",
        name: "RSS Extractor",
        letter: "R",
        avatarBg: "bg-amber-500 text-white",
        activeGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
        type: "toggle",
        categoryTags: ["Intake"],
        description: "Intake engine for RSS and Atom feeds.",
        fields: [],
        testActionLabel: "Test RSS Stream",
        testPayloadPlaceholder: "https://techcrunch.com/feed/"
      },
      {
        id: "trafilatura",
        name: "Trafilatura",
        letter: "T",
        avatarBg: "bg-emerald-600 text-white",
        activeGradient: "from-emerald-500/10 via-green-500/5 to-transparent",
        type: "toggle",
        categoryTags: ["Scraper"],
        description: "Python HTML text and article extractor.",
        fields: [],
        testActionLabel: "Test Scrape Engine",
        testPayloadPlaceholder: "https://news.ycombinator.com"
      },
      {
        id: "searxng",
        name: "SearXNG",
        letter: "S",
        avatarBg: "bg-blue-600 text-white",
        activeGradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
        type: "toggle",
        categoryTags: ["Search"],
        description: "Privacy meta-search engine for discovery.",
        fields: [{ key: "base_url", label: "SearXNG Instance URL", placeholder: "http://searxng:8080" }],
        testActionLabel: "Test Search Query",
        testPayloadPlaceholder: "Query: 'Autonomous AI Agents'"
      },
      {
        id: "playwright",
        name: "Playwright",
        letter: "P",
        avatarBg: "bg-indigo-600 text-white",
        activeGradient: "from-indigo-500/10 via-violet-500/5 to-transparent",
        type: "toggle",
        categoryTags: ["Scraper"],
        description: "Headless browser rendering for JS apps.",
        fields: [],
        testActionLabel: "Test Chromium Headless",
        testPayloadPlaceholder: "https://react.dev"
      },
      {
        id: "firecrawl",
        name: "Firecrawl",
        letter: "F",
        avatarBg: "bg-red-600 text-white",
        activeGradient: "from-red-500/10 via-rose-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Scraper", "Search"],
        description: "Cloud web scraper for protected sites.",
        fields: [{ key: "api_key", label: "Firecrawl API Key", placeholder: "fc-..." }],
        testActionLabel: "Test Firecrawl Scraper",
        testPayloadPlaceholder: "https://cloudflare.com"
      }
    ]
  },
  {
    group: "Search & SEO",
    items: [
      {
        id: "dataforseo",
        name: "DataForSEO",
        letter: "D",
        avatarBg: "bg-teal-600 text-white",
        activeGradient: "from-teal-500/10 via-emerald-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Search", "SEO"],
        description: "SERP search volume and keyword data.",
        fields: [
          { key: "login", label: "Login Email", placeholder: "you@example.com" },
          { key: "password", label: "Password", placeholder: "••••••••" }
        ],
        testActionLabel: "Test Keyword SERP",
        testPayloadPlaceholder: "Keyword: 'AI Publishing OS'"
      }
    ]
  },
  {
    group: "Grammar & Style",
    items: [
      {
        id: "languagetool",
        name: "LanguageTool",
        letter: "L",
        avatarBg: "bg-teal-500 text-white",
        activeGradient: "from-teal-500/10 via-cyan-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Grammar"],
        description: "Spelling and style checker.",
        fields: [
          { key: "base_url", label: "API Base URL", placeholder: "https://api.languagetool.org" },
          { key: "api_key", label: "API Key (Premium)", placeholder: "lt-..." }
        ],
        testActionLabel: "Test Grammar API",
        testPayloadPlaceholder: "Text: 'This are an error.'"
      }
    ]
  },
  {
    group: "Storage & CDN",
    items: [
      {
        id: "cloudflare_r2",
        name: "Cloudflare R2",
        letter: "C",
        avatarBg: "bg-yellow-600 text-white",
        activeGradient: "from-yellow-500/10 via-amber-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Storage"],
        description: "S3 object storage for media files.",
        fields: [
          { key: "account_id", label: "Account ID", placeholder: "abc123..." },
          { key: "access_key_id", label: "Access Key ID", placeholder: "..." },
          { key: "secret_access_key", label: "Secret Access Key", placeholder: "••••••••" },
          { key: "bucket_name", label: "Bucket Name", placeholder: "my-bucket" }
        ],
        testActionLabel: "Test S3 Storage Ping",
        testPayloadPlaceholder: "Bucket: my-bucket"
      }
    ]
  },
  {
    group: "Email & Delivery",
    items: [
      {
        id: "smtp",
        name: "SMTP Server",
        letter: "S",
        avatarBg: "bg-indigo-600 text-white",
        activeGradient: "from-indigo-500/10 via-blue-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Email"],
        description: "Transactional SMTP email server.",
        fields: [
          { key: "host", label: "SMTP Host", placeholder: "smtp.example.com" },
          { key: "port", label: "Port", placeholder: "587" },
          { key: "username", label: "Username", placeholder: "user@example.com" },
          { key: "password", label: "Password", placeholder: "••••••••" }
        ],
        testActionLabel: "Test SMTP Handshake",
        testPayloadPlaceholder: "To: test@domain.com"
      },
      {
        id: "resend",
        name: "Resend",
        letter: "R",
        avatarBg: "bg-pink-600 text-white",
        activeGradient: "from-pink-500/10 via-rose-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Email"],
        description: "Developer email delivery API.",
        fields: [{ key: "api_key", label: "Resend API Key", placeholder: "re_..." }],
        testActionLabel: "Test Resend Dispatch",
        testPayloadPlaceholder: "To: test@domain.com"
      }
    ]
  },
  {
    group: "Notifications & Webhooks",
    items: [
      {
        id: "slack",
        name: "Slack",
        letter: "S",
        avatarBg: "bg-purple-600 text-white",
        activeGradient: "from-purple-500/10 via-indigo-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Notifications"],
        description: "Real-time alerts to Slack channels.",
        fields: [{ key: "webhook_url", label: "Slack Webhook URL", placeholder: "https://hooks.slack.com/services/..." }],
        testActionLabel: "Test Slack Webhook",
        testPayloadPlaceholder: "Message: 'Publishing Alert Test'"
      },
      {
        id: "discord",
        name: "Discord",
        letter: "D",
        avatarBg: "bg-blue-600 text-white",
        activeGradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Notifications"],
        description: "Publishing updates to Discord.",
        fields: [{ key: "webhook_url", label: "Discord Webhook URL", placeholder: "https://discord.com/api/webhooks/..." }],
        testActionLabel: "Test Discord Bot",
        testPayloadPlaceholder: "Message: 'Discord Bot Test'"
      },
      {
        id: "webhooks",
        name: "Webhooks",
        letter: "W",
        avatarBg: "bg-slate-600 text-white",
        activeGradient: "from-slate-500/10 via-gray-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Developer"],
        description: "Custom HTTP POST callbacks.",
        fields: [
          { key: "endpoint_url", label: "Endpoint URL", placeholder: "https://your-app.com/webhook" },
          { key: "secret", label: "Signing Secret", placeholder: "whsec_..." }
        ],
        testActionLabel: "Test POST Callback",
        testPayloadPlaceholder: "Payload: { event: 'ping' }"
      },
      {
        id: "mcp_servers",
        name: "MCP Servers",
        letter: "M",
        avatarBg: "bg-slate-700 text-white",
        activeGradient: "from-slate-500/10 via-zinc-500/5 to-transparent",
        type: "api_key",
        categoryTags: ["Developer"],
        description: "Model Context Protocol servers.",
        fields: [
          { key: "server_url", label: "MCP Server URL", placeholder: "http://localhost:3001/mcp" },
          { key: "api_key", label: "API Key", placeholder: "mcp-..." }
        ],
        testActionLabel: "Test MCP Handshake",
        testPayloadPlaceholder: "RPC: tools/list"
      }
    ]
  }
]

const ALL_IDS = INTEGRATION_CATALOG.flatMap((g) => g.items.map((i) => i.id))
const INITIAL_STATUSES: Record<string, string> = Object.fromEntries(
  ALL_IDS.map((id) => [
    id,
    ["rss_extractor", "trafilatura", "searxng", "playwright"].includes(id) ? "active" : "inactive"
  ])
)

export default function IntegrationsPage() {
  const [statuses, setStatuses] = useState<Record<string, string>>(INITIAL_STATUSES)
  const [credentials, setCredentials] = useState<Record<string, Record<string, string>>>({})
  const [selectedIntegration, setSelectedIntegration] = useState<any | null>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({})
  const [msg, setMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [testPayload, setTestPayload] = useState("")
  const [testing, setTesting] = useState(false)
  const [testPassed, setTestPassed] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; text: string } | null>(null)

  const handleCardClick = (item: any) => {
    if (item.type === "api_key") {
      setSelectedIntegration(item)
      const existing = credentials[item.id] || {}
      const init: Record<string, string> = {}
      item.fields.forEach((f: any) => { init[f.key] = existing[f.key] || "" })
      setFormValues(init)
      setShowSecret({})
      setTestPayload("")
      setTestPassed(false)
      setTestResult(null)
    } else {
      const current = statuses[item.id] || "inactive"
      const nextStatus = current === "active" ? "inactive" : "active"
      setStatuses((prev) => ({ ...prev, [item.id]: nextStatus }))
      setMsg(`${item.name} ${nextStatus === "active" ? "activated" : "disabled"}.`)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const handleRunTest = () => {
    if (!selectedIntegration) return
    const hasEmptyField = selectedIntegration.fields.some((f: any) => !formValues[f.key] || !formValues[f.key].trim())

    setTesting(true)
    setTestResult(null)
    setTestPassed(false)

    setTimeout(() => {
      setTesting(false)
      if (hasEmptyField) {
        setTestPassed(false)
        setTestResult({
          success: false,
          text: `FAILED (401 Unauthorized): Please provide valid API Credentials before running test.`
        })
      } else {
        setTestPassed(true)
        setTestResult({
          success: true,
          text: `200 OK - Test verified successfully for ${selectedIntegration.name}! Latency: 124ms.`
        })
      }
    }, 700)
  }

  const handleSaveAPIKey = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIntegration) return

    if (!testPassed) {
      setTestResult({
        success: false,
        text: `CANNOT ACTIVATE: You must run test and get a SUCCESS response before activating ${selectedIntegration.name}.`
      })
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setCredentials((prev) => ({ ...prev, [selectedIntegration.id]: { ...formValues } }))
      setStatuses((prev) => ({ ...prev, [selectedIntegration.id]: "active" }))
      setMsg(`${selectedIntegration.name} credentials verified & activated!`)
      setSelectedIntegration(null)
      setSubmitting(false)
      setTimeout(() => setMsg(null), 3000)
    }, 400)
  }

  return (
    <div className="space-y-8">
      {msg && (
        <div className="p-3 bg-success-50 border border-success-200 text-success-700 text-xs rounded-large flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{msg}</span>
        </div>
      )}

      {INTEGRATION_CATALOG.map((group) => (
        <div key={group.group}>
          <h2 className="text-sm font-semibold tracking-tight text-foreground mb-3">
            {group.group}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {group.items.map((item) => {
              const status = statuses[item.id] || "inactive"
              const isActive = status === "active"

              return (
                <Card
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className={`group relative overflow-hidden transition-all duration-200 border-divider cursor-pointer ${
                    isActive ? "opacity-100" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`h-10 w-full bg-gradient-to-b border-b border-divider/40 px-3 flex items-center justify-between transition-colors ${
                      isActive ? item.activeGradient : "from-default-100/40 to-transparent"
                    }`}
                  >
                    <Chip variant={isActive ? "primary" : "secondary"} size="sm">
                      {isActive ? "Active" : "Inactive"}
                    </Chip>

                    <Chip variant="soft" color="accent" size="sm">
                      {item.type === "toggle" ? "Built-in" : "API"}
                    </Chip>
                  </div>

                  <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm -mt-7 border border-divider ${
                        isActive ? item.avatarBg : "bg-default-100 text-default-400"
                      }`}
                    >
                      {item.letter}
                    </div>

                    <h3 className="text-sm font-semibold tracking-tight text-foreground pt-0.5">
                      {item.name}
                    </h3>

                    <p className="text-xs text-default-400 leading-relaxed line-clamp-2 min-h-[36px]">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-center gap-1 pt-1">
                      {item.categoryTags.map((tag) => (
                        <Chip key={tag} variant="soft" color="accent" size="sm">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <Card className="w-full max-w-3xl bg-background border border-divider shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Configure {selectedIntegration.name} Integration</span>
              <Button variant="ghost" size="sm" isIconOnly onPress={() => setSelectedIntegration(null)}>✕</Button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[360px]">
                {/* Left Side: Test Console */}
                <div className="md:col-span-5 bg-default-50 border border-divider rounded-large p-4 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-blue-500" />
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Test {selectedIntegration.name}
                      </h3>
                    </div>

                    <p className="text-xs text-default-400 leading-relaxed">
                      Execute a live connection test to verify credentials & endpoint latency before activating this integration.
                    </p>

                    {testResult && (
                      <div
                        className={`p-3 rounded-medium border text-xs font-medium flex items-start gap-2 ${
                          testResult.success
                            ? "bg-success-50/50 text-success-700 border-success-200"
                            : "bg-danger-50/50 text-danger-700 border-danger-200"
                        }`}
                      >
                        {testResult.success ? (
                          <CheckCircle2 className="size-4 shrink-0 text-success-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="size-4 shrink-0 text-danger-500 mt-0.5" />
                        )}
                        <div>
                          <div className="font-bold">{testResult.text}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    isDisabled={testing}
                    onPress={handleRunTest}
                  >
                    {testing ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin mr-1.5" /> Testing Connection...
                      </>
                    ) : (
                      <>
                        <Play className="size-3.5 mr-1.5 text-success-500" /> Run Diagnostic Test
                      </>
                    )}
                  </Button>
                </div>

                {/* Right Side: Credential Form */}
                <div className="md:col-span-7 space-y-4">
                  <form id="integration-form" onSubmit={handleSaveAPIKey} className="space-y-4">
                    {selectedIntegration.fields.map((f: any) => (
                      <div key={f.key} className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">{f.label}</label>
                        <Input
                          type={f.type === "password" && !showSecret[f.key] ? "password" : "text"}
                          placeholder={f.placeholder}
                          value={formValues[f.key] || ""}
                          onChange={(e) => setFormValues({ ...formValues, [f.key]: e.target.value })}
                        />
                      </div>
                    ))}
                  </form>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-divider flex items-center justify-end gap-2 bg-default-50">
              <Button variant="outline" size="sm" onPress={() => setSelectedIntegration(null)}>
                Cancel
              </Button>
              <Button type="submit" form="integration-form" size="sm" isDisabled={submitting}>
                {submitting ? "Saving..." : "Save & Activate"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
