"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Button, Form, TextField, Label, Input, Select, ListBox, Tooltip, Accordion, Switch, Chip
} from "@heroui/react"
import {
  ArrowLeft, Bot, Cpu, FileCode, Database, Wrench, Sliders, Save, CheckCircle2, Info,
  ChevronDown, Plus, X, Upload, Sparkles, Code2, Terminal, Shield, RefreshCw, Key
} from "lucide-react"

// Model Category Types
type ModelCategory = "Text" | "Image" | "Video" | "Audio" | "Embedding" | "Custom"

// Providers & Models Map by Category
const PROVIDERS_BY_CATEGORY: Record<ModelCategory, { provider: string; label: string; models: string[] }[]> = {
  Text: [
    { provider: "OpenAI", label: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "o3-mini", "gpt-4-turbo"] },
    { provider: "Anthropic", label: "Anthropic", models: ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest", "claude-3-opus-latest"] },
    { provider: "Google Gemini", label: "Google Gemini", models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash-exp"] },
    { provider: "Groq Llama", label: "Groq Llama", models: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"] },
    { provider: "DeepSeek", label: "DeepSeek", models: ["deepseek-chat-v3", "deepseek-coder-r1"] }
  ],
  Image: [
    { provider: "fal.ai", label: "fal.ai FLUX", models: ["flux-1-dev", "flux-1-schnell", "flux-pro"] },
    { provider: "OpenAI DALL-E", label: "OpenAI DALL-E", models: ["dall-e-3", "dall-e-2"] },
    { provider: "Freepik MCP", label: "Freepik MCP", models: ["freepik-mystic", "freepik-pikaso"] }
  ],
  Video: [
    { provider: "Runway", label: "Runway", models: ["gen-2", "gen-3-alpha"] },
    { provider: "Luma", label: "Luma AI", models: ["dream-machine-v1"] }
  ],
  Audio: [
    { provider: "ElevenLabs", label: "ElevenLabs", models: ["eleven_multilingual_v2", "eleven_turbo_v2"] },
    { provider: "OpenAI Whisper", label: "OpenAI Whisper", models: ["whisper-1"] }
  ],
  Embedding: [
    { provider: "OpenAI Embedding", label: "OpenAI Embedding", models: ["text-embedding-3-large", "text-embedding-3-small"] },
    { provider: "Cohere", label: "Cohere", models: ["embed-english-v3.0", "embed-multilingual-v3.0"] }
  ],
  Custom: [
    { provider: "Custom Endpoint", label: "Custom LLM API", models: ["custom-model-v1"] }
  ]
}

const EMOJI_ICONS = ["🤖", "🚀", "💡", "⚡", "✍️", "🔍", "📈", "🛡️", "🧠", "🎨", "🛠️", "🌐"]
const COLOR_SWATCHES = [
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Slate", hex: "#64748b" }
]

const FOLDERS = ["Copywriters & Content Strategy", "SEO & Keyword Analysts", "Technical & DOM Scrapers", "Media & Artwork Generators", "Workflow Orchestrators", "+ Create New Folder"]
const STATUSES = ["Active", "Disabled"]
const OUTPUT_FORMATS = ["Structured Markdown with H2/H3", "Clean HTML Elements", "JSON Payload", "Plain Text"]
const RETRIEVAL_STRATEGIES = ["Hybrid Vector RAG", "Recent First", "Semantic Similarity", "Full Context Injection", "Top Ranked Only"]

const CONNECTED_SOURCES = [
  "TechCrunch AI Feed", "HackerNews Frontpage Stream", "Google News AI Keyword Monitor", "Verge Tech Feed", "Custom Web Scraper Stream"
]

const CONNECTED_TOOLS = [
  { id: "Web Scraper API", label: "Web Scraper API", desc: "Extract DOM text from target web pages" },
  { id: "SERP Keyword Extractor", label: "SERP Keyword Extractor", desc: "Fetch live search volume & intent" },
  { id: "fal.ai Image Generator", label: "fal.ai Image Generator", desc: "Synthesize high-res FLUX featured artwork" },
  { id: "WordPress REST Publisher", label: "WordPress REST Publisher", desc: "Push drafts & posts directly to WordPress" },
  { id: "Ghost Admin Publisher", label: "Ghost Admin Publisher", desc: "Publish directly to Ghost CMS" },
  { id: "LanguageTool Grammar Engine", label: "LanguageTool Grammar", desc: "Proofread readability & style compliance" }
]

const VARIABLE_CHIPS = ["{{keyword}}", "{{research}}", "{{website}}", "{{language}}", "{{brand_voice}}", "{{target_audience}}"]

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

export default function NewCustomAgentPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // 1. General
  const [agentName, setAgentName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("🤖")
  const [selectedColor, setSelectedColor] = useState("#8b5cf6")
  const [folder, setFolder] = useState("Copywriters & Content Strategy")
  const [status, setStatus] = useState("Active")

  // Tags System
  const [tags, setTags] = useState<string[]>(["SEO", "Copywriting", "Autonomous"])
  const [tagInput, setTagInput] = useState("")

  // 2. AI Model
  const [modelCategory, setModelCategory] = useState<ModelCategory>("Text")
  const [provider, setProvider] = useState("OpenAI")
  const [model, setModel] = useState("gpt-4o")

  // Model Configuration
  const [temperature, setTemperature] = useState("0.7")
  const [maxTokens, setMaxTokens] = useState("4096")
  const [topP, setTopP] = useState("0.9")
  const [frequencyPenalty, setFrequencyPenalty] = useState("0.0")

  // 3. Instructions
  const [role, setRole] = useState("Senior SEO Copywriter & Content Strategist")
  const [objective, setObjective] = useState("Generate longform, research-backed, highly engaging articles optimized for search intent.")
  const [instructionsText, setInstructionsText] = useState("1. Review gathered research sources.\n2. Construct an H2/H3 outline.\n3. Draft longform prose adhering to brand voice.")
  const [constraints, setConstraints] = useState("Never hallucinate statistics. Always maintain active voice. Include affiliate disclosures where necessary.")
  const [outputFormat, setOutputFormat] = useState("Structured Markdown with H2/H3")

  // 4. Sources
  const [selectedSources, setSelectedSources] = useState<string[]>(["TechCrunch AI Feed"])
  const [retrievalStrategy, setRetrievalStrategy] = useState("Hybrid Vector RAG")

  // 5. Tools
  const [selectedTools, setSelectedTools] = useState<string[]>(["Web Scraper API", "fal.ai Image Generator", "WordPress REST Publisher"])
  const [maxToolIterations, setMaxToolIterations] = useState("5")
  const [toolTimeout, setToolTimeout] = useState("30")
  const [autoRetryTools, setAutoRetryTools] = useState(true)

  // 6. Advanced
  const [notes, setNotes] = useState("")
  const [customSettings, setCustomSettings] = useState("")

  // Category switch handler
  const handleModelCategoryChange = (cat: ModelCategory) => {
    setModelCategory(cat)
    const providers = PROVIDERS_BY_CATEGORY[cat] || []
    if (providers.length > 0) {
      setProvider(providers[0].provider)
      setModel(providers[0].models[0] || "")
    }
  }

  // Provider switch handler
  const handleProviderChange = (provName: string) => {
    setProvider(provName)
    const providers = PROVIDERS_BY_CATEGORY[modelCategory] || []
    const match = providers.find((p) => p.provider === provName)
    if (match && match.models.length > 0) {
      setModel(match.models[0])
    }
  }

  // Tag Handlers
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t))
  }

  // Source & Tool Toggle
  const toggleSource = (src: string) => {
    setSelectedSources((prev) => (prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]))
  }

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]))
  }

  // Variable chip insertion helper
  const handleInsertVariable = (varName: string) => {
    setInstructionsText((prev) => `${prev} ${varName}`)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!agentName.trim()) return

    setSubmitting(true)

    setTimeout(() => {
      setMsg(`AI Agent "${agentName}" created & configured successfully!`)
      setSubmitting(false)
      setTimeout(() => router.push("/admin/custom-agents"), 1000)
    }, 600)
  }

  const availableProviders = PROVIDERS_BY_CATEGORY[modelCategory] || []
  const currentProviderObj = availableProviders.find((p) => p.provider === provider) || availableProviders[0]
  const availableModels = currentProviderObj ? currentProviderObj.models : []

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
              onPress={() => router.push("/admin/custom-agents")}
              aria-label="Go Back to Agents"
              className="rounded-xl border-divider"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                <Bot className="size-4 text-purple-500" /> Create Custom AI Agent
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onPress={() => router.push("/admin/custom-agents")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isDisabled={submitting}
              className="font-medium px-5"
            >
              <Save className="size-3.5" /> {submitting ? "Saving..." : "Save Agent"}
            </Button>
          </div>
        </div>

        {msg && (
          <div className="p-4 bg-success-50 border border-success-200 text-success-700 text-xs rounded-2xl flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="size-4 shrink-0 text-success" />
            <span className="font-semibold">{msg}</span>
          </div>
        )}

        {/* 6 HeroUI Accordion Sections with short titles & left monochrome icons */}
        <Accordion className="w-full space-y-3">
          
          {/* 1. General */}
          <Accordion.Item key="general" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Bot className="size-4 text-default-500" /> General
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="agentName">
                    <FormLabel info="Unique name used to identify the agent throughout the platform.">Agent Name *</FormLabel>
                    <Input
                      placeholder="e.g. Senior SEO Copywriter Agent"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <div>
                    <FormLabel info="Controls whether the agent is available for use.">Status</FormLabel>
                    <Select selectedKey={status} onSelectionChange={(key) => key && setStatus(key as string)} className="w-full" aria-label="Status">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{STATUSES.map(s => <ListBox.Item key={s} id={s}>{s}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <TextField name="description">
                  <FormLabel info="Short explanation describing the agent's purpose and responsibilities.">Description</FormLabel>
                  <Input
                    placeholder="Brief explanation of what this AI agent does..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>

                {/* Icon & Color Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Icon Selector */}
                  <div className="space-y-2">
                    <FormLabel info="Select an icon from the library or upload a custom icon.">Icon</FormLabel>
                    <div className="flex flex-wrap gap-2 items-center">
                      {EMOJI_ICONS.map((e) => (
                        <button
                          type="button"
                          key={e}
                          onClick={() => setSelectedIcon(e)}
                          className={`w-9 h-9 text-base rounded-xl border flex items-center justify-center transition-all ${
                            selectedIcon === e
                              ? "border-primary bg-primary/10 ring-2 ring-primary/20 scale-105"
                              : "border-divider bg-default-100/80 dark:bg-default-50/40 hover:bg-default-200"
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Swatch Picker */}
                  <div className="space-y-2">
                    <FormLabel info="Select a color to visually identify the agent across the platform.">Color Accent</FormLabel>
                    <div className="flex flex-wrap gap-2.5 items-center pt-1">
                      {COLOR_SWATCHES.map((swatch) => (
                        <button
                          type="button"
                          key={swatch.name}
                          onClick={() => setSelectedColor(swatch.hex)}
                          style={{ backgroundColor: swatch.hex }}
                          title={swatch.name}
                          className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center ${
                            selectedColor === swatch.hex ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105 opacity-90"
                          }`}
                        >
                          {selectedColor === swatch.hex && <CheckCircle2 className="size-4 text-white drop-shadow-xs" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tags Manager */}
                  <div className="space-y-2">
                    <FormLabel info="Used for searching, filtering and organizing agents.">Tags</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="e.g. Copywriting, SEO"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                        className="flex-1 h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                      />
                      <Button type="button" size="sm" onPress={handleAddTag} className="font-medium">
                        <Plus className="size-4" /> Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          variant="secondary"
                          size="sm"
                          className="bg-default-100 dark:bg-default-50/60 text-foreground font-medium border border-divider px-2.5 py-1 inline-flex items-center gap-1.5"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-danger text-default-400 transition-colors"
                            aria-label={`Remove ${tag}`}
                          >
                            <X className="size-3" />
                          </button>
                        </Chip>
                      ))}
                    </div>
                  </div>

                  {/* Folder Selector */}
                  <div>
                    <FormLabel info="Select an existing folder or create a new one.">Folder</FormLabel>
                    <Select selectedKey={folder} onSelectionChange={(key) => key && setFolder(key as string)} className="w-full" aria-label="Folder">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{FOLDERS.map((f) => <ListBox.Item key={f} id={f}>{f}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 2. AI Model */}
          <Accordion.Item key="aimodel" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Cpu className="size-4 text-default-500" /> AI Model
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                {/* Model Category Tabs */}
                <div>
                  <FormLabel info="Select the type of AI model. Available options change dynamically based on the selected Model Category.">Model Category *</FormLabel>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-1.5 bg-default-100/80 dark:bg-default-50/30 rounded-2xl border border-divider">
                    {(["Text", "Image", "Video", "Audio", "Embedding", "Custom"] as ModelCategory[]).map((cat) => {
                      const active = modelCategory === cat
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => handleModelCategoryChange(cat)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            active
                              ? "bg-white dark:bg-background text-primary shadow-xs border border-divider"
                              : "text-default-400 hover:text-foreground"
                          }`}
                        >
                          <span>{cat}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Provider Selector */}
                  <div>
                    <FormLabel info={`Select AI provider for the chosen category '${modelCategory}'.`}>Provider *</FormLabel>
                    <Select selectedKey={provider} onSelectionChange={(key) => key && handleProviderChange(key as string)} className="w-full" aria-label="Provider">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {availableProviders.map((p) => <ListBox.Item key={p.provider} id={p.provider}>{p.label}</ListBox.Item>)}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {/* Model Selector */}
                  <div>
                    <FormLabel info={`Select model version for provider '${provider}'.`}>Model *</FormLabel>
                    <Select selectedKey={model} onSelectionChange={(key) => key && setModel(key as string)} className="w-full" aria-label="Model">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {availableModels.map((m) => <ListBox.Item key={m} id={m}>{m}</ListBox.Item>)}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                {/* Model Configuration Parameters */}
                <div className="p-5 bg-default-50/80 dark:bg-default-50/10 rounded-2xl border border-divider space-y-5">
                  <div className="text-xs font-bold flex items-center gap-2 text-foreground">
                    <Sliders className="size-4 text-purple-500" /> Model Configuration ({provider} - {model})
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField name="temperature">
                      <FormLabel info="Creativity & randomness threshold (0.0 = Precise, 1.0 = Creative)">Temperature ({temperature})</FormLabel>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        className="w-full h-10 px-3.5 text-xs bg-white dark:bg-background text-foreground border border-divider rounded-xl focus:border-primary focus:outline-none transition-colors"
                      />
                    </TextField>

                    <TextField name="maxTokens">
                      <FormLabel info="Maximum token response length limit">Max Response Tokens</FormLabel>
                      <Input
                        type="number"
                        min="256"
                        max="16384"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(e.target.value)}
                        className="w-full h-10 px-3.5 text-xs bg-white dark:bg-background text-foreground border border-divider rounded-xl focus:border-primary focus:outline-none transition-colors"
                      />
                    </TextField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField name="topP">
                      <FormLabel info="Nucleus sampling probability">Top P ({topP})</FormLabel>
                      <Input
                        type="number"
                        step="0.05"
                        min="0"
                        max="1"
                        value={topP}
                        onChange={(e) => setTopP(e.target.value)}
                        className="w-full h-10 px-3.5 text-xs bg-white dark:bg-background text-foreground border border-divider rounded-xl focus:border-primary focus:outline-none transition-colors"
                      />
                    </TextField>

                    <TextField name="frequencyPenalty">
                      <FormLabel info="Penalty for repeating verbatim words">Frequency Penalty ({frequencyPenalty})</FormLabel>
                      <Input
                        type="number"
                        step="0.1"
                        min="-2"
                        max="2"
                        value={frequencyPenalty}
                        onChange={(e) => setFrequencyPenalty(e.target.value)}
                        className="w-full h-10 px-3.5 text-xs bg-white dark:bg-background text-foreground border border-divider rounded-xl focus:border-primary focus:outline-none transition-colors"
                      />
                    </TextField>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 3. Instructions */}
          <Accordion.Item key="instructions" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <FileCode className="size-4 text-default-500" /> Instructions
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <p className="text-xs text-default-400">All instructions below are automatically combined into the final system prompt during execution.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="role">
                    <FormLabel info="Defines the agent's primary role or expertise.">Role *</FormLabel>
                    <Input
                      placeholder="e.g. Senior SEO Copywriter & Technical Journalist"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="objective">
                    <FormLabel info="Defines the specific goal the agent should accomplish.">Objective *</FormLabel>
                    <Input
                      placeholder="e.g. Generate high-ranking, research-backed longform articles"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>

                <TextField name="instructionsText">
                  <FormLabel info="Step-by-step guidance the agent should follow while performing its task.">Step-by-Step Instructions</FormLabel>
                  <textarea
                    rows={4}
                    placeholder="1. Review input research data...\n2. Outline key sections...\n3. Draft article in active voice..."
                    value={instructionsText}
                    onChange={(e) => setInstructionsText(e.target.value)}
                    className="w-full p-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>

                <TextField name="constraints">
                  <FormLabel info="Defines limitations, restrictions and rules the agent must always follow.">Constraints & Rules</FormLabel>
                  <textarea
                    rows={2}
                    placeholder="e.g. Never invent statistics. Never use passive voice. Maintain brand tone."
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    className="w-full p-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel info="Defines the required structure and format of the generated response.">Output Format</FormLabel>
                    <Select selectedKey={outputFormat} onSelectionChange={(key) => key && setOutputFormat(key as string)} className="w-full" aria-label="Output Format">
                      <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                        <Select.Value /><Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>{OUTPUT_FORMATS.map((fmt) => <ListBox.Item key={fmt} id={fmt}>{fmt}</ListBox.Item>)}</ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {/* Variables helper chips */}
                  <div className="space-y-2">
                    <FormLabel info="Dynamic placeholders supplied during execution. Click chip to insert into instructions.">Variables Helper</FormLabel>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {VARIABLE_CHIPS.map((v) => (
                        <button
                          type="button"
                          key={v}
                          onClick={() => handleInsertVariable(v)}
                          className="px-2.5 py-1 text-[11px] font-mono bg-default-100 dark:bg-default-50/60 hover:bg-primary/20 text-primary border border-divider rounded-lg transition-colors"
                        >
                          + {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 4. Sources */}
          <Accordion.Item key="sources" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Database className="size-4 text-default-500" /> Sources
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div>
                  <FormLabel info="Select one or more Sources or Source Folders the agent can access.">Source Selection</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {CONNECTED_SOURCES.map((src) => {
                      const active = selectedSources.includes(src)
                      return (
                        <button
                          type="button"
                          key={src}
                          onClick={() => toggleSource(src)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                            active
                              ? "border-emerald-500 bg-emerald-500/10 text-foreground font-semibold"
                              : "border-divider bg-default-50/60 dark:bg-default-50/20 text-default-400 hover:text-foreground"
                          }`}
                        >
                          <span className="text-xs truncate">{src}</span>
                          {active && <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <FormLabel info="Defines how the agent retrieves and prioritizes information from the selected sources.">Retrieval Strategy</FormLabel>
                  <Select selectedKey={retrievalStrategy} onSelectionChange={(key) => key && setRetrievalStrategy(key as string)} className="w-full" aria-label="Retrieval Strategy">
                    <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                      <Select.Value /><Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>{RETRIEVAL_STRATEGIES.map((rs) => <ListBox.Item key={rs} id={rs}>{rs}</ListBox.Item>)}</ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 5. Tools */}
          <Accordion.Item key="tools" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Wrench className="size-4 text-default-500" /> Tools
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div>
                  <FormLabel info="Select one or more connected tools or integrations the agent can use.">Available Tools</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {CONNECTED_TOOLS.map((tool) => {
                      const active = selectedTools.includes(tool.id)
                      return (
                        <button
                          type="button"
                          key={tool.id}
                          onClick={() => toggleTool(tool.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between space-x-2 ${
                            active
                              ? "border-purple-500 bg-purple-500/10 dark:bg-purple-500/20 text-foreground ring-2 ring-purple-500/20 shadow-xs"
                              : "border-divider bg-default-50/80 dark:bg-default-50/20 hover:bg-default-100"
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-foreground">{tool.label}</div>
                            <div className="text-[10px] text-default-400 mt-0.5">{tool.desc}</div>
                          </div>
                          {active && <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="p-5 bg-default-50/80 dark:bg-default-50/10 rounded-2xl border border-divider space-y-5">
                  <div className="text-xs font-bold flex items-center gap-2 text-foreground">
                    <Sliders className="size-4 text-purple-500" /> Tool Configuration
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField name="maxToolIterations">
                      <FormLabel info="Maximum tool invocation loops before terminating">Max Tool Iterations</FormLabel>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={maxToolIterations}
                        onChange={(e) => setMaxToolIterations(e.target.value)}
                        className="w-full h-10 px-3.5 text-xs bg-white dark:bg-background text-foreground border border-divider rounded-xl focus:border-primary focus:outline-none transition-colors"
                      />
                    </TextField>

                    <TextField name="toolTimeout">
                      <FormLabel info="Timeout limit for individual tool execution in seconds">Tool Call Timeout (Seconds)</FormLabel>
                      <Input
                        type="number"
                        min="5"
                        max="120"
                        value={toolTimeout}
                        onChange={(e) => setToolTimeout(e.target.value)}
                        className="w-full h-10 px-3.5 text-xs bg-white dark:bg-background text-foreground border border-divider rounded-xl focus:border-primary focus:outline-none transition-colors"
                      />
                    </TextField>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white dark:bg-background rounded-xl border border-divider">
                    <div>
                      <div className="text-xs font-bold text-foreground">Auto-Retry Failed Tool Calls</div>
                      <div className="text-[11px] text-default-400">Automatically retry failed network tool calls up to 3 times</div>
                    </div>
                    <Switch isSelected={autoRetryTools} onChange={(v) => setAutoRetryTools(v)} aria-label="Auto-Retry Tools" />
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 6. Advanced */}
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
                <TextField name="notes">
                  <FormLabel info="Internal notes for administrators or developers.">Notes</FormLabel>
                  <textarea
                    rows={3}
                    placeholder="Internal developer notes regarding agent behavior, model tuning, or edge cases..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>

                <TextField name="customSettings">
                  <FormLabel info="Optional agent-specific configuration (JSON key-value).">Custom Settings</FormLabel>
                  <textarea
                    rows={3}
                    placeholder='{"temperature_decay": true, "max_retry_backoff_ms": 2000}'
                    value={customSettings}
                    onChange={(e) => setCustomSettings(e.target.value)}
                    className="w-full p-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
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
