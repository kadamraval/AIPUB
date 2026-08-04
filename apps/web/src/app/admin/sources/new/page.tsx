"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Button, Form, TextField, Label, Input, Select, ListBox, Tooltip, Accordion, Switch, Chip
} from "@heroui/react"
import {
  ArrowLeft, Database, Layers, RefreshCw, Sliders, FileText, Save, CheckCircle2, Info,
  ChevronDown, Upload, Plus, X, Globe, Rss, Code2, HardDrive, FileSpreadsheet, Image as ImageIcon,
  Archive, FileCode, HelpCircle, Terminal, Key, Clock, Hash, Calendar, ShieldCheck
} from "lucide-react"

// Category Types
type CategoryType = "Create" | "Upload" | "Fetch"

// Source Types by Category
const SOURCE_TYPES_BY_CATEGORY: Record<CategoryType, { id: string; label: string; desc: string; icon: any }[]> = {
  Create: [
    { id: "Manual", label: "Manual", desc: "Create knowledge directly inside the platform", icon: FileText },
    { id: "Rich Text", label: "Rich Text", desc: "Create formatted documents", icon: FileCode },
    { id: "FAQ", label: "FAQ", desc: "Create structured question and answer knowledge", icon: HelpCircle },
    { id: "Prompt", label: "Prompt", desc: "Store reusable prompts and AI instructions", icon: Terminal },
    { id: "Custom Create", label: "Custom", desc: "Create custom structured content", icon: Sliders }
  ],
  Upload: [
    { id: "PDF", label: "PDF", desc: "Adobe PDF document (.pdf)", icon: FileText },
    { id: "Word", label: "Word", desc: "Microsoft Word (.doc, .docx)", icon: FileText },
    { id: "Text", label: "Text", desc: "Plain text or markdown (.txt, .md)", icon: FileCode },
    { id: "Spreadsheet", label: "Spreadsheet", desc: "Excel or CSV (.csv, .xlsx)", icon: FileSpreadsheet },
    { id: "JSON", label: "JSON", desc: "Structured data (.json)", icon: Code2 },
    { id: "Image", label: "Image", desc: "Raster or vector artwork (.png, .jpg, .svg)", icon: ImageIcon },
    { id: "Archive", label: "Archive", desc: "Compressed archive (.zip, .tar, .gz)", icon: Archive },
    { id: "Custom Upload", label: "Custom", desc: "Custom file format upload", icon: Upload }
  ],
  Fetch: [
    { id: "Website", label: "Website", desc: "Public web page or article scraper", icon: Globe },
    { id: "RSS Feed", label: "RSS Feed", desc: "RSS 2.0 or Atom XML feed stream", icon: Rss },
    { id: "Sitemap", label: "Sitemap", desc: "XML sitemap crawler", icon: FileCode },
    { id: "API", label: "API", desc: "REST JSON API endpoint", icon: Code2 },
    { id: "Database", label: "Database", desc: "PostgreSQL, MySQL or MongoDB URI", icon: Database },
    { id: "Google Drive", label: "Google Drive", desc: "Google Workspace cloud document", icon: HardDrive },
    { id: "Notion", label: "Notion", desc: "Notion workspace page or database", icon: FileText },
    { id: "GitHub", label: "GitHub", desc: "GitHub repository code or wiki", icon: Code2 },
    { id: "Dropbox", label: "Dropbox", desc: "Dropbox cloud storage folder", icon: HardDrive },
    { id: "OneDrive", label: "OneDrive", desc: "Microsoft OneDrive document", icon: HardDrive },
    { id: "SharePoint", label: "SharePoint", desc: "SharePoint team library", icon: HardDrive },
    { id: "FTP / SFTP", label: "FTP / SFTP", desc: "Remote file server protocol", icon: HardDrive },
    { id: "Cloud Storage", label: "Cloud Storage", desc: "AWS S3 or Cloudflare R2 bucket", icon: HardDrive },
    { id: "Webhook", label: "Webhook", desc: "Incoming event payload endpoint", icon: Key },
    { id: "Custom Fetch", label: "Custom", desc: "Custom external stream protocol", icon: Sliders }
  ]
}

const STATUSES = ["Active", "Disabled"]
const FOLDERS = ["General Knowledge", "AI & Research", "News Intakes", "Documentation", "Marketing & SEO", "+ Create New Folder"]
const SYNC_FREQUENCIES = ["Every 15 Minutes", "Every 30 Minutes", "Hourly", "Every 6 Hours", "Daily", "Weekly"]

const IDENTIFIER_FIELDS = ["guid", "id", "url", "slug", "hash", "item_id"]
const TITLE_FIELDS = ["title", "headline", "name", "h1", "subject"]
const CONTENT_FIELDS = ["content", "body", "text", "description", "summary", "article_text"]
const DATE_FIELDS = ["pubDate", "updated_at", "created_at", "date", "published_time"]

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

export default function NewSourcePage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // 1. General
  const [sourceName, setSourceName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<CategoryType>("Fetch")
  const [folder, setFolder] = useState("General Knowledge")
  const [status, setStatus] = useState("Active")

  // Tags System
  const [tags, setTags] = useState<string[]>(["Research", "AI Feed"])
  const [tagInput, setTagInput] = useState("")

  // 2. Source Type & Dynamic Config
  const [selectedSourceType, setSelectedSourceType] = useState("Website")
  
  // Dynamic Configuration State
  const [targetUrl, setTargetUrl] = useState("")
  const [connectionToken, setConnectionToken] = useState("")
  const [manualText, setManualText] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // 3. Metadata (Fetch Only)
  const [uniqueIdentifier, setUniqueIdentifier] = useState("guid")
  const [titleField, setTitleField] = useState("title")
  const [contentField, setContentField] = useState("content")
  const [dateField, setDateField] = useState("pubDate")

  // 4. Sync (Fetch Only)
  const [autoSync, setAutoSync] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState("Hourly")
  const [syncLimit, setSyncLimit] = useState("50")

  // 5. Advanced
  const [notes, setNotes] = useState("")
  const [customSettings, setCustomSettings] = useState("")

  // Tag Handlers
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  // Category switch handler
  const handleCategoryChange = (newCat: CategoryType) => {
    setCategory(newCat)
    const available = SOURCE_TYPES_BY_CATEGORY[newCat]
    if (available && available.length > 0) {
      setSelectedSourceType(available[0].id)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!sourceName.trim()) return

    setSubmitting(true)

    setTimeout(() => {
      setMsg(`Source stream "${sourceName}" created & configured successfully!`)
      setSubmitting(false)
      setTimeout(() => router.push("/admin/sources"), 1000)
    }, 600)
  }

  const currentSourceTypes = SOURCE_TYPES_BY_CATEGORY[category] || []

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
              onPress={() => router.push("/admin/sources")}
              aria-label="Go Back to Sources"
              className="rounded-xl border-divider"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                <Database className="size-4 text-emerald-500" /> Add Source Stream
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onPress={() => router.push("/admin/sources")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isDisabled={submitting}
              className="font-medium px-5"
            >
              <Save className="size-3.5" /> {submitting ? "Saving..." : "Save Source"}
            </Button>
          </div>
        </div>

        {msg && (
          <div className="p-4 bg-success-50 border border-success-200 text-success-700 text-xs rounded-2xl flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="size-4 shrink-0 text-success" />
            <span className="font-semibold">{msg}</span>
          </div>
        )}

        {/* 5 HeroUI Accordion Sections with short titles & left monochrome icons */}
        <Accordion className="w-full space-y-3">
          
          {/* 1. General */}
          <Accordion.Item key="general" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Database className="size-4 text-default-500" /> General
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="sourceName">
                    <FormLabel info="Unique name used to identify the source.">Source Name *</FormLabel>
                    <Input
                      placeholder="e.g. TechCrunch AI Feed"
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </TextField>

                  <div>
                    <FormLabel info="Controls whether the source is available.">Status</FormLabel>
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
                  <FormLabel info="Short explanation describing what this source provides.">Description</FormLabel>
                  <Input
                    placeholder="Short summary of knowledge or stream content"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>

                {/* Category Selection Tabs */}
                <div>
                  <FormLabel info="Defines how the source is added: Create (Manual), Upload (File), or Fetch (URL/Stream).">Category *</FormLabel>
                  <div className="grid grid-cols-3 gap-3 p-1.5 bg-default-100/80 dark:bg-default-50/30 rounded-2xl border border-divider">
                    {(["Create", "Upload", "Fetch"] as CategoryType[]).map((cat) => {
                      const active = category === cat
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => handleCategoryChange(cat)}
                          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            active
                              ? "bg-white dark:bg-background text-primary shadow-xs border border-divider"
                              : "text-default-400 hover:text-foreground"
                          }`}
                        >
                          {cat === "Create" && <FileText className="size-3.5" />}
                          {cat === "Upload" && <Upload className="size-3.5" />}
                          {cat === "Fetch" && <Globe className="size-3.5" />}
                          <span>{cat}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tags Manager */}
                  <div className="space-y-2">
                    <FormLabel info="Used for searching, filtering and organizing sources.">Tags</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="e.g. AI, Breaking News"
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

          {/* 2. Source Type & Configuration */}
          <Accordion.Item key="sourcetype" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Layers className="size-4 text-default-500" /> Source Type ({category})
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div>
                  <FormLabel info={`Available Source Types based on selected category '${category}'.`}>Available Source Types ({category})</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                    {currentSourceTypes.map((st) => {
                      const Icon = st.icon
                      const active = selectedSourceType === st.id
                      return (
                        <button
                          type="button"
                          key={st.id}
                          onClick={() => setSelectedSourceType(st.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                            active
                              ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 text-foreground ring-2 ring-emerald-500/20 shadow-xs"
                              : "border-divider bg-default-50/80 dark:bg-default-50/20 hover:bg-default-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Icon className={`size-4 ${active ? "text-emerald-500" : "text-default-400"}`} />
                            {active && <CheckCircle2 className="size-3.5 text-emerald-500" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">{st.label}</div>
                            <div className="text-[10px] text-default-400 truncate mt-0.5">{st.desc}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Dynamic Configuration Fields based on Source Type */}
                <div className="p-5 bg-default-50/80 dark:bg-default-50/10 rounded-2xl border border-divider space-y-5">
                  <div className="text-xs font-bold flex items-center gap-2 text-foreground">
                    <Sliders className="size-4 text-emerald-500" /> {selectedSourceType} Configuration
                  </div>

                  {category === "Fetch" && (
                    <div className="space-y-4">
                      <TextField name="targetUrl">
                        <FormLabel info={`Target URL / Host Endpoint required for ${selectedSourceType}`}>{selectedSourceType} Target URL / Host *</FormLabel>
                        <Input
                          type="url"
                          placeholder={`https://example.com/stream-for-${selectedSourceType.toLowerCase()}`}
                          value={targetUrl}
                          onChange={(e) => setTargetUrl(e.target.value)}
                          required
                          className="w-full h-10 px-3.5 text-xs bg-white dark:bg-background text-foreground border border-divider rounded-xl focus:border-primary focus:outline-none transition-colors"
                        />
                      </TextField>

                      <TextField name="connectionToken">
                        <FormLabel info="Authentication API Key / Bearer Secret Token">API Token / Connection Key</FormLabel>
                        <Input
                          type="password"
                          placeholder="Enter Bearer token or secret API key..."
                          value={connectionToken}
                          onChange={(e) => setConnectionToken(e.target.value)}
                          className="w-full h-10 px-3.5 text-xs bg-white dark:bg-background text-foreground border border-divider rounded-xl focus:border-primary focus:outline-none transition-colors"
                        />
                      </TextField>
                    </div>
                  )}

                  {category === "Upload" && (
                    <div className="p-6 border-2 border-dashed border-divider hover:border-primary/50 bg-white dark:bg-background rounded-2xl flex flex-col items-center justify-center space-y-2 text-center cursor-pointer transition-colors group">
                      <Upload className="size-6 text-default-400 group-hover:text-primary transition-colors" />
                      <div className="text-xs font-bold text-foreground">Upload {selectedSourceType} Document</div>
                      <div className="text-[10px] text-default-400">Drag & drop file here or click to browse</div>
                      <input
                        type="file"
                        onChange={(e) => e.target.files && setUploadedFile(e.target.files[0])}
                        className="hidden"
                      />
                      {uploadedFile && (
                        <Chip variant="soft" color="accent" size="sm" className="mt-2 font-mono text-[10px]">
                          {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        </Chip>
                      )}
                    </div>
                  )}

                  {category === "Create" && (
                    <TextField name="manualText">
                      <FormLabel info={`Structured ${selectedSourceType} knowledge content`}>{selectedSourceType} Content Body</FormLabel>
                      <textarea
                        rows={4}
                        placeholder={`Enter raw ${selectedSourceType.toLowerCase()} text or instructions here...`}
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        className="w-full p-3.5 text-xs bg-white dark:bg-background text-foreground border border-divider rounded-xl focus:border-primary focus:outline-none transition-colors"
                      />
                    </TextField>
                  )}
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 3. Metadata (Fetch Only) */}
          <Accordion.Item key="metadata" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <FileText className="size-4 text-default-500" /> Metadata {category !== "Fetch" && "(Fetch Only)"}
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                {category !== "Fetch" ? (
                  <p className="text-xs text-default-400 italic">Metadata field mapping is only available for 'Fetch' category sources.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormLabel info="Select the field that uniquely identifies each record to prevent duplicate imports.">Unique Identifier *</FormLabel>
                      <Select selectedKey={uniqueIdentifier} onSelectionChange={(key) => key && setUniqueIdentifier(key as string)} className="w-full" aria-label="Unique Identifier">
                        <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                          <Select.Value /><Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>{IDENTIFIER_FIELDS.map((id) => <ListBox.Item key={id} id={id}>{id}</ListBox.Item>)}</ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    <div>
                      <FormLabel info="Select the field that contains the content title.">Title Field *</FormLabel>
                      <Select selectedKey={titleField} onSelectionChange={(key) => key && setTitleField(key as string)} className="w-full" aria-label="Title Field">
                        <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                          <Select.Value /><Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>{TITLE_FIELDS.map((t) => <ListBox.Item key={t} id={t}>{t}</ListBox.Item>)}</ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    <div>
                      <FormLabel info="Select the field that contains the main content.">Content Field *</FormLabel>
                      <Select selectedKey={contentField} onSelectionChange={(key) => key && setContentField(key as string)} className="w-full" aria-label="Content Field">
                        <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                          <Select.Value /><Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>{CONTENT_FIELDS.map((c) => <ListBox.Item key={c} id={c}>{c}</ListBox.Item>)}</ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    <div>
                      <FormLabel info="Select the published or last updated date field.">Date Field *</FormLabel>
                      <Select selectedKey={dateField} onSelectionChange={(key) => key && setDateField(key as string)} className="w-full" aria-label="Date Field">
                        <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                          <Select.Value /><Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>{DATE_FIELDS.map((d) => <ListBox.Item key={d} id={d}>{d}</ListBox.Item>)}</ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 4. Sync (Fetch Only) */}
          <Accordion.Item key="sync" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <RefreshCw className="size-4 text-default-500" /> Sync {category !== "Fetch" && "(Fetch Only)"}
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                {category !== "Fetch" ? (
                  <p className="text-xs text-default-400 italic">Sync scheduling is only available for 'Fetch' category sources.</p>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-default-50/60 dark:bg-default-50/10 rounded-xl border border-divider">
                      <div>
                        <div className="text-xs font-bold text-foreground">Auto Sync</div>
                        <div className="text-[11px] text-default-400">Automatically refresh and pull new data from the source stream</div>
                      </div>
                      <Switch isSelected={autoSync} onChange={(v) => setAutoSync(v)} aria-label="Auto Sync" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormLabel info="Defines how often the source is synchronized.">Frequency</FormLabel>
                        <Select selectedKey={syncFrequency} onSelectionChange={(key) => key && setSyncFrequency(key as string)} className="w-full" aria-label="Frequency">
                          <Select.Trigger className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl flex items-center justify-between">
                            <Select.Value /><Select.Indicator />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox>{SYNC_FREQUENCIES.map((freq) => <ListBox.Item key={freq} id={freq}>{freq}</ListBox.Item>)}</ListBox>
                          </Select.Popover>
                        </Select>
                      </div>

                      <TextField name="syncLimit">
                        <FormLabel info="Maximum records fetched in a single synchronization.">Sync Limit</FormLabel>
                        <Input
                          type="number"
                          min="1"
                          max="1000"
                          value={syncLimit}
                          onChange={(e) => setSyncLimit(e.target.value)}
                          className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                        />
                      </TextField>
                    </div>

                    <div className="p-4 bg-default-50/80 dark:bg-default-50/10 rounded-xl border border-divider flex items-center justify-between text-xs">
                      <span className="text-default-400">Last Synchronization Status:</span>
                      <Chip variant="soft" color="accent" size="sm" className="font-mono text-[10px]">Never Synced (Pending Initial Run)</Chip>
                    </div>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 5. Advanced */}
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
                  <FormLabel info="Internal notes for administrators.">Notes</FormLabel>
                  <textarea
                    rows={3}
                    placeholder="Enter internal administrative notes or source context..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </TextField>

                <TextField name="customSettings">
                  <FormLabel info="Optional source-specific configuration (JSON key-value).">Custom Settings</FormLabel>
                  <textarea
                    rows={3}
                    placeholder='{"user_agent": "AIPubBot", "timeout_ms": 5000}'
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
