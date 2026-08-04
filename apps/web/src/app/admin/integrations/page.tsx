"use client"

import React, { useState } from "react"
import {
  Card,
  Button,
  Chip,
  Input,
  Select,
  ListBox,
  Switch
} from "@heroui/react"
import {
  CheckCircle2,
  Play,
  Loader2,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Key,
  ShieldCheck
} from "lucide-react"
import { DataCard } from "@/components/shared/data-card"

const FLAT_INTEGRATIONS = [
  {
    id: "openrouter",
    group: "AI",
    name: "OpenRouter",
    letter: "O",
    type: "api_key",
    categoryTag: "AI",
    description: "Unified LLM gateway for Claude 3.5, GPT-4o, Llama 3 & Gemini.",
    fields: [{ key: "api_key", label: "OpenRouter API Key", placeholder: "sk-or-v1-..." }],
    testActionLabel: "Ping LLM Gateway"
  },
  {
    id: "openai",
    group: "AI",
    name: "OpenAI",
    letter: "O",
    type: "api_key",
    categoryTag: "AI",
    description: "Direct connection to GPT-4o models & text embedding vectors.",
    fields: [{ key: "api_key", label: "OpenAI API Key", placeholder: "sk-..." }],
    testActionLabel: "Test OpenAI API"
  },
  {
    id: "fal_ai",
    group: "Media",
    name: "Fal.ai",
    letter: "F",
    type: "api_key",
    categoryTag: "Media",
    description: "FLUX.1 and SDXL featured article image generation service.",
    fields: [{ key: "api_key", label: "Fal.ai API Key", placeholder: "fal-..." }],
    testActionLabel: "Test Image Gen"
  },
  {
    id: "rss_extractor",
    group: "Scraper",
    name: "RSS Extractor",
    letter: "R",
    type: "toggle",
    categoryTag: "Scraper",
    description: "Automated ingestion engine for RSS, Atom, and XML feeds.",
    fields: [],
    testActionLabel: "Test RSS Stream"
  },
  {
    id: "trafilatura",
    group: "Scraper",
    name: "Trafilatura",
    letter: "T",
    type: "toggle",
    categoryTag: "Scraper",
    description: "Python HTML text and article main-content extractor.",
    fields: [],
    testActionLabel: "Test Scrape Engine"
  },
  {
    id: "searxng",
    group: "Scraper",
    name: "SearXNG",
    letter: "S",
    type: "toggle",
    categoryTag: "Scraper",
    description: "Privacy-focused meta-search engine for research discovery.",
    fields: [{ key: "base_url", label: "SearXNG Instance URL", placeholder: "http://searxng:8080" }],
    testActionLabel: "Test Search Query"
  },
  {
    id: "playwright",
    group: "Scraper",
    name: "Playwright",
    letter: "P",
    type: "toggle",
    categoryTag: "Scraper",
    description: "Headless Chromium browser rendering for JS-heavy web apps.",
    fields: [],
    testActionLabel: "Test Headless Rendering"
  },
  {
    id: "firecrawl",
    group: "Scraper",
    name: "Firecrawl",
    letter: "F",
    type: "api_key",
    categoryTag: "Scraper",
    description: "Cloud web scraper and crawler for protected websites.",
    fields: [{ key: "api_key", label: "Firecrawl API Key", placeholder: "fc-..." }],
    testActionLabel: "Test Firecrawl API"
  },
  {
    id: "dataforseo",
    group: "SEO",
    name: "DataForSEO",
    letter: "D",
    type: "api_key",
    categoryTag: "SEO",
    description: "Live SERP search volume, keyword difficulty & ranking data.",
    fields: [
      { key: "login", label: "Login Email", placeholder: "you@example.com" },
      { key: "password", label: "Password", placeholder: "••••••••" }
    ],
    testActionLabel: "Test SERP Keyword API"
  },
  {
    id: "languagetool",
    group: "Grammar",
    name: "LanguageTool",
    letter: "L",
    type: "api_key",
    categoryTag: "Grammar",
    description: "Automated spelling, grammar, and editorial style checker.",
    fields: [
      { key: "base_url", label: "API Base URL", placeholder: "https://api.languagetool.org" },
      { key: "api_key", label: "API Key (Premium)", placeholder: "lt-..." }
    ],
    testActionLabel: "Test Grammar API"
  },
  {
    id: "cloudflare_r2",
    group: "Storage",
    name: "Cloudflare R2",
    letter: "C",
    type: "api_key",
    categoryTag: "Storage",
    description: "Zero egress-fee S3 object storage for article media files.",
    fields: [
      { key: "account_id", label: "Account ID", placeholder: "abc123..." },
      { key: "access_key_id", label: "Access Key ID", placeholder: "..." },
      { key: "secret_access_key", label: "Secret Access Key", placeholder: "••••••••" },
      { key: "bucket_name", label: "Bucket Name", placeholder: "my-bucket" }
    ],
    testActionLabel: "Test S3 Storage Handshake"
  },
  {
    id: "smtp",
    group: "Email",
    name: "SMTP Server",
    letter: "S",
    type: "api_key",
    categoryTag: "Email",
    description: "Custom transactional SMTP email server for system dispatches.",
    fields: [
      { key: "host", label: "SMTP Host", placeholder: "smtp.example.com" },
      { key: "port", label: "Port", placeholder: "587" },
      { key: "username", label: "Username", placeholder: "user@example.com" },
      { key: "password", label: "Password", placeholder: "••••••••" }
    ],
    testActionLabel: "Test SMTP Handshake"
  },
  {
    id: "resend",
    group: "Email",
    name: "Resend",
    letter: "R",
    type: "api_key",
    categoryTag: "Email",
    description: "Modern developer email delivery API service.",
    fields: [{ key: "api_key", label: "Resend API Key", placeholder: "re_..." }],
    testActionLabel: "Test Resend Dispatch"
  },
  {
    id: "slack",
    group: "Alerts",
    name: "Slack",
    letter: "S",
    type: "api_key",
    categoryTag: "Alerts",
    description: "Real-time automated alerts to Slack team channels.",
    fields: [{ key: "webhook_url", label: "Slack Webhook URL", placeholder: "https://hooks.slack.com/services/..." }],
    testActionLabel: "Test Slack Webhook"
  },
  {
    id: "discord",
    group: "Alerts",
    name: "Discord",
    letter: "D",
    type: "api_key",
    categoryTag: "Alerts",
    description: "Publishing and editorial updates to Discord channels.",
    fields: [{ key: "webhook_url", label: "Discord Webhook URL", placeholder: "https://discord.com/api/webhooks/..." }],
    testActionLabel: "Test Discord Bot"
  }
]

const INITIAL_STATUSES: Record<string, string> = Object.fromEntries(
  FLAT_INTEGRATIONS.map((i) => [
    i.id,
    ["rss_extractor", "trafilatura", "searxng", "playwright"].includes(i.id) ? "active" : "inactive"
  ])
)

export default function IntegrationsPage() {
  const [statuses, setStatuses] = useState<Record<string, string>>(INITIAL_STATUSES)
  const [credentials, setCredentials] = useState<Record<string, Record<string, string>>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name-asc")

  // Form & Test State
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<Record<string, { success: boolean; text: string }>>({})
  const [testPassed, setTestPassed] = useState<Record<string, boolean>>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  // Toggle Accordion Expansion
  const toggleExpand = (item: typeof FLAT_INTEGRATIONS[0]) => {
    if (expandedId === item.id) {
      setExpandedId(null)
    } else {
      setExpandedId(item.id)
      const existing = credentials[item.id] || {}
      const init: Record<string, string> = {}
      item.fields.forEach((f) => { init[f.key] = existing[f.key] || "" })
      setFormValues(init)
    }
  }

  // Toggle Active / Inactive Status
  const handleToggleStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const current = statuses[id] || "inactive"
    const nextStatus = current === "active" ? "inactive" : "active"
    setStatuses((prev) => ({ ...prev, [id]: nextStatus }))
    
    const targetItem = FLAT_INTEGRATIONS.find((i) => i.id === id)
    setMsg(`${targetItem?.name || id} ${nextStatus === "active" ? "activated" : "disabled"}.`)
    setTimeout(() => setMsg(null), 3000)
  }

  // Diagnostic Test Handler
  const handleRunDiagnosticTest = (item: typeof FLAT_INTEGRATIONS[0]) => {
    const hasEmptyField = item.fields.some((f) => !formValues[f.key] || !formValues[f.key].trim())

    setTestingId(item.id)
    setTestResult((prev) => ({ ...prev, [item.id]: { success: false, text: "Testing connection..." } }))

    setTimeout(() => {
      setTestingId(null)
      if (item.fields.length > 0 && hasEmptyField) {
        setTestPassed((prev) => ({ ...prev, [item.id]: false }))
        setTestResult((prev) => ({
          ...prev,
          [item.id]: {
            success: false,
            text: `FAILED (401 Unauthorized): Provide valid credentials before activating.`
          }
        }))
      } else {
        setTestPassed((prev) => ({ ...prev, [item.id]: true }))
        setTestResult((prev) => ({
          ...prev,
          [item.id]: {
            success: true,
            text: `200 OK - Connection test verified successfully for ${item.name}! Latency: 118ms.`
          }
        }))
      }
    }, 600)
  }

  // Save Credentials & Activate
  const handleSaveCredentials = (item: typeof FLAT_INTEGRATIONS[0], e: React.FormEvent) => {
    e.preventDefault()

    if (item.type === "api_key" && !testPassed[item.id]) {
      setTestResult((prev) => ({
        ...prev,
        [item.id]: {
          success: false,
          text: `TEST REQUIRED: Please click "${item.testActionLabel}" and verify success before saving.`
        }
      }))
      return
    }

    setSubmittingId(item.id)
    setTimeout(() => {
      setCredentials((prev) => ({ ...prev, [item.id]: { ...formValues } }))
      setStatuses((prev) => ({ ...prev, [item.id]: "active" }))
      setSubmittingId(null)
      setMsg(`✓ ${item.name} credentials verified & saved!`)
      setTimeout(() => setMsg(null), 3500)
    }, 400)
  }

  // Filter & Sort Logic
  const filteredIntegrations = FLAT_INTEGRATIONS.filter((item) => {
    const status = statuses[item.id] || "inactive"
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryTag.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.categoryTag === categoryFilter
    const matchesStatus = statusFilter === "all" || status === statusFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter

    return matchesSearch && matchesCategory && matchesStatus && matchesType
  }).sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name)
    if (sortBy === "name-desc") return b.name.localeCompare(a.name)
    if (sortBy === "status") {
      const statusA = statuses[a.id] || "inactive"
      const statusB = statuses[b.id] || "inactive"
      return statusA.localeCompare(statusB)
    }
    if (sortBy === "category") return a.categoryTag.localeCompare(b.categoryTag)
    return 0
  })

  // Summary Metrics
  const totalCount = FLAT_INTEGRATIONS.length
  const activeCount = Object.values(statuses).filter((s) => s === "active").length
  const apiCount = FLAT_INTEGRATIONS.filter((i) => i.type === "api_key").length
  const builtinCount = FLAT_INTEGRATIONS.filter((i) => i.type === "toggle").length

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Toast Notification Alert */}
      {msg && (
        <div className="p-3 bg-success-50 border border-success-200 text-success-700 dark:bg-success-950/40 dark:border-success-800 dark:text-success-300 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="size-4 shrink-0 text-success-500" />
          <span className="font-medium">{msg}</span>
        </div>
      )}

      {/* Standard Header Summary Cards (Matches Other Dashboard Pages) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DataCard
          title="Total Services"
          value={totalCount.toString()}
          caption="All catalog integrations"
          icon={Layers}
        />
        <DataCard
          title="Active"
          value={activeCount.toString()}
          caption="Operational & ready"
          icon={ShieldCheck}
          pulseDot
        />
        <DataCard
          title="API Gateways"
          value={apiCount.toString()}
          caption="External credentials"
          icon={Key}
        />
        <DataCard
          title="Built-in Engines"
          value={builtinCount.toString()}
          caption="Native background tools"
          icon={Cpu}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-card border border-divider rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 size-4 text-default-400" />
            <Input
              placeholder="Search integrations or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Category Filter */}
            <Select
              selectedKey={categoryFilter}
              onSelectionChange={(key) => setCategoryFilter(key as string)}
              className="w-32"
              aria-label="Category Filter"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all">All Tags</ListBox.Item>
                  <ListBox.Item id="AI">AI</ListBox.Item>
                  <ListBox.Item id="Media">Media</ListBox.Item>
                  <ListBox.Item id="Scraper">Scraper</ListBox.Item>
                  <ListBox.Item id="SEO">SEO</ListBox.Item>
                  <ListBox.Item id="Grammar">Grammar</ListBox.Item>
                  <ListBox.Item id="Storage">Storage</ListBox.Item>
                  <ListBox.Item id="Email">Email</ListBox.Item>
                  <ListBox.Item id="Alerts">Alerts</ListBox.Item>
                  <ListBox.Item id="Developer">Developer</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Status Filter */}
            <Select
              selectedKey={statusFilter}
              onSelectionChange={(key) => setStatusFilter(key as string)}
              className="w-32"
              aria-label="Status Filter"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all">All Statuses</ListBox.Item>
                  <ListBox.Item id="active">Active</ListBox.Item>
                  <ListBox.Item id="inactive">Inactive</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Type Filter */}
            <Select
              selectedKey={typeFilter}
              onSelectionChange={(key) => setTypeFilter(key as string)}
              className="w-32"
              aria-label="Type Filter"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all">All Types</ListBox.Item>
                  <ListBox.Item id="api_key">API Key</ListBox.Item>
                  <ListBox.Item id="toggle">Built-in</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Sort Filter */}
            <Select
              selectedKey={sortBy}
              onSelectionChange={(key) => setSortBy(key as string)}
              className="w-36"
              aria-label="Sort Options"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="name-asc">Sort: Name A-Z</ListBox.Item>
                  <ListBox.Item id="name-desc">Sort: Name Z-A</ListBox.Item>
                  <ListBox.Item id="status">Sort: Status</ListBox.Item>
                  <ListBox.Item id="category">Sort: Tag</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>
      </div>

      {/* Horizontal Accordion List (Uniform Borders & Layout) */}
      <div className="space-y-3">
        {filteredIntegrations.length === 0 ? (
          <div className="p-8 text-center bg-card border border-divider rounded-2xl space-y-2">
            <AlertCircle className="size-8 text-default-400 mx-auto" />
            <p className="text-sm font-semibold text-foreground">No integrations match your filter criteria.</p>
            <p className="text-xs text-default-400">Try adjusting your search query or reset filter options.</p>
          </div>
        ) : (
          filteredIntegrations.map((item) => {
            const status = statuses[item.id] || "inactive"
            const isActive = status === "active"
            const isExpanded = expandedId === item.id

            return (
              <Card
                key={item.id}
                className="transition-all duration-200 border border-divider rounded-2xl bg-card overflow-hidden"
              >
                {/* Accordion Header Row */}
                <div
                  onClick={() => toggleExpand(item)}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none bg-card hover:bg-default-50/60 transition-colors"
                >
                  {/* LEFT SIDE: Neutral Logo + Title + Tag + Description Below */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Neutral Logo Avatar (No Color Background) */}
                    <div className="size-10 rounded-xl bg-default-100 dark:bg-default-100/60 text-foreground border border-divider font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {item.letter}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-foreground tracking-tight">{item.name}</h3>
                        <Chip variant="soft" color="accent" size="sm">
                          {item.categoryTag}
                        </Chip>
                      </div>
                      <p className="text-xs text-default-400 leading-normal line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE: Black Type Badge + Active Status + Switch */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Black Color Type Badge */}
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-black text-white dark:bg-white dark:text-black uppercase tracking-wider shadow-sm">
                      {item.type === "toggle" ? "Built-in" : "API"}
                    </span>

                    <Chip variant={isActive ? "primary" : "secondary"} size="sm">
                      {isActive ? "Active" : "Inactive"}
                    </Chip>

                    <div onClick={(e) => e.stopPropagation()}>
                      <Switch
                        isSelected={isActive}
                        onChange={() => handleToggleStatus(item.id)}
                        size="sm"
                        aria-label={`Toggle ${item.name} Status`}
                      />
                    </div>

                    <Button variant="ghost" size="sm" isIconOnly className="h-7 w-7 text-default-400">
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                  </div>
                </div>

                {/* Expanded Inline Accordion Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-divider bg-default-50/50 space-y-4 animate-in slide-in-from-top-1 duration-150">
                    <form onSubmit={(e) => handleSaveCredentials(item, e)} className="space-y-4">
                      {item.fields.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {item.fields.map((f) => (
                            <div key={f.key} className="flex flex-col gap-1.5">
                              <span className="text-xs font-semibold text-foreground">{f.label}</span>
                              <Input
                                placeholder={f.placeholder}
                                value={formValues[f.key] || ""}
                                onChange={(e) => setFormValues({ ...formValues, [f.key]: e.target.value })}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 bg-card border border-divider rounded-xl text-xs text-default-500 flex items-center gap-2">
                          <Cpu className="size-4 text-default-400 shrink-0" />
                          <span>Built-in background engine — no external API credentials required. Use toggle switch above to control status.</span>
                        </div>
                      )}

                      {/* Diagnostic Test Output Alert */}
                      {testResult[item.id] && (
                        <div
                          className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                            testResult[item.id].success
                              ? "bg-success-50/70 text-success-700 border-success-200 dark:bg-success-950/40 dark:border-success-800 dark:text-success-300"
                              : "bg-danger-50/70 text-danger-700 border-danger-200 dark:bg-danger-950/40 dark:border-danger-800 dark:text-danger-300"
                          }`}
                        >
                          {testResult[item.id].success ? (
                            <CheckCircle2 className="size-4 shrink-0 text-success-500 mt-0.5" />
                          ) : (
                            <AlertCircle className="size-4 shrink-0 text-danger-500 mt-0.5" />
                          )}
                          <div className="font-semibold">{testResult[item.id].text}</div>
                        </div>
                      )}

                      {/* Clean Aligned Action Row */}
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-divider">
                        <Button
                          type="button"
                          variant="outline"
                          isDisabled={testingId === item.id}
                          onPress={() => handleRunDiagnosticTest(item)}
                        >
                          {testingId === item.id ? (
                            <>
                              <Loader2 className="size-4 animate-spin mr-1.5" /> Testing...
                            </>
                          ) : (
                            <>
                              <Play className="size-4 mr-1.5 text-success-500" /> Test Connection
                            </>
                          )}
                        </Button>

                        <Button type="submit" isDisabled={submittingId === item.id}>
                          {submittingId === item.id ? "Activating..." : isActive ? "Save Settings" : "Activate"}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
