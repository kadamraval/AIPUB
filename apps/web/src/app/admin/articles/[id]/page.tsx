"use client"

import React, { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Button, Chip, Select, ListBox, Input
} from "@heroui/react"
import {
  ArrowLeft, Eye, Save, Send, Sparkles, Image as ImageIcon, History,
  Globe, Search, ExternalLink, GitBranch,
  Copy, X, AlertCircle, PanelRightClose, PanelRightOpen, Sparkles as SparklesIcon
} from "lucide-react"
import { TiptapEditor } from "@/components/editor/TiptapEditor"

// Dynamic SSR rule for admin page
export const dynamic = "force-dynamic"

// Demo Existing Article Data
const DEMO_EXISTING_ARTICLE = {
  id: "art-1",
  title: "Building Micro-SaaS with Next.js & Supabase in 2026",
  status: "published",
  website_name: "TechPulse Daily",
  website_url: "https://techpulse.daily/posts/micro-saas-nextjs-supabase-2026",
  category: "Software Architecture",
  author: "Kadam Raval",
  created_at: "2026-08-01 14:32",
  updated_at: "2026-08-03 19:45",
  published_at: "2026-08-02 09:00",
  slug: "micro-saas-nextjs-supabase-2026",
  language: "English (US)",
  workflow_name: "Autonomous Newsroom Digest",
  workflow_id: "wf-101",
  trigger: "Schedule (Hourly)",
  execution_id: "exec-88392",
  seo_score: 98,
  focus_keyword: "Micro-SaaS Next.js 2026",
  meta_title: "Building Micro-SaaS with Next.js & Supabase in 2026 | TechPulse Daily",
  meta_desc: "Learn how to architect, build, and deploy production-grade Micro-SaaS applications using Next.js 15 App Router, Supabase RLS, and autonomous AI agents in 2026.",
  tags: ["Next.js 15", "Supabase", "SaaS", "TypeScript", "AI Agents"],
  contentHtml: `<h2>Executive Summary</h2>
<p>Building a successful software product in 2026 requires unprecedented development velocity, seamless AI integration, and robust serverless database pipelines. By combining <strong>Next.js 15 App Router</strong> with <strong>Supabase</strong>, modern developers can ship full-featured Micro-SaaS applications in days rather than months.</p>

<h3>Key Architectural Principles</h3>
<ul>
  <li><strong>Edge-first Rendering:</strong> Utilizing React Server Components and dynamic SSR for sub-100ms global latency.</li>
  <li><strong>Granular Data Security:</strong> Enforcing Postgres Row Level Security (RLS) policies directly at the database layer.</li>
  <li><strong>Autonomous Agent Workflows:</strong> Offloading content generation, SEO optimization, and customer engagement to background LLM orchestration pipelines.</li>
</ul>

<blockquote>"The speed at which solo founders can now launch production-grade SaaS products with automated workflows represents a paradigm shift in software leverage."</blockquote>

<h3>Database & Vector Schema Design</h3>
<p>Below is an optimized SQL snippet for setting up vector similarity embeddings inside Postgres using pgvector for RAG workflows:</p>

<pre><code>CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);</code></pre>

<h3>Conclusion & Next Steps</h3>
<p>By standardizing on type-safe TypeScript, atomic HeroUI design systems, and serverless Postgres infrastructure, software engineers can maximize product velocity while keeping cloud overhead at absolute minimums.</p>`
}

export default function ArticleEditorPage() {
  const router = useRouter()
  const params = useParams()
  const rawId = (params?.id as string) || "new"
  const isNewArticle = rawId === "new"

  // Tiptap editor HTML state (WordPress-compatible HTML output)
  const [editorHtml, setEditorHtml] = useState(
    isNewArticle ? "<p></p>" : DEMO_EXISTING_ARTICLE.contentHtml
  )

  // Word & character count from Tiptap CharacterCount extension
  const [wordCount, setWordCount] = useState(0)

  // State Management
  const [title, setTitle] = useState(isNewArticle ? "" : DEMO_EXISTING_ARTICLE.title)
  const [status, setStatus] = useState(isNewArticle ? "draft" : DEMO_EXISTING_ARTICLE.status)
  const [websiteName, setWebsiteName] = useState(isNewArticle ? "Select Website..." : DEMO_EXISTING_ARTICLE.website_name)
  const [category, setCategory] = useState(isNewArticle ? "General" : DEMO_EXISTING_ARTICLE.category)
  const [author, setAuthor] = useState(isNewArticle ? "Kadam Raval" : DEMO_EXISTING_ARTICLE.author)
  const [slug, setSlug] = useState(isNewArticle ? "" : DEMO_EXISTING_ARTICLE.slug)
  const [language, setLanguage] = useState(isNewArticle ? "English (US)" : DEMO_EXISTING_ARTICLE.language)
  const [tags, setTags] = useState<string[]>(isNewArticle ? [] : DEMO_EXISTING_ARTICLE.tags)
  const [newTag, setNewTag] = useState("")
  const [workflowAssignment, setWorkflowAssignment] = useState(isNewArticle ? "Not Assigned" : DEMO_EXISTING_ARTICLE.workflow_name)
  const [focusKeyword, setFocusKeyword] = useState(isNewArticle ? "" : DEMO_EXISTING_ARTICLE.focus_keyword)
  const [metaTitle, setMetaTitle] = useState(isNewArticle ? "" : DEMO_EXISTING_ARTICLE.meta_title)
  const [metaDesc, setMetaDesc] = useState(isNewArticle ? "" : DEMO_EXISTING_ARTICLE.meta_desc)

  // Layout & Navigation State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    "overview" | "article" | "ai" | "workflow" | "publishing" | "seo" | "activity"
  >("overview")

  // Modals & Save State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(true)

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiContext, setAiContext] = useState("full_doc")
  const [selectedAgent, setSelectedAgent] = useState("SEO Copywriter Agent")
  const [isGenerating, setIsGenerating] = useState(false)

  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  // Live SEO Score calculation
  const calculatedSeoScore = Math.min(
    100,
    (title ? 25 : 0) +
    (wordCount > 100 ? 30 : 10) +
    (focusKeyword ? 20 : 0) +
    (metaTitle ? 15 : 0) +
    (metaDesc ? 10 : 0)
  )

  const handleSave = () => {
    setIsSaved(true)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
      setIsSaved(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
    setIsSaved(false)
  }

  const handleGenerateAiArticle = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setTitle("The Future of Autonomous AI Publishing Systems in 2026")
      setEditorHtml(`<h2>1. Executive Summary</h2>
<p>Autonomous AI Publishing Systems represent the next evolution in content engineering, combining real-time SERP keyword extraction with dynamic workflow orchestration.</p>
<h2>2. Core Architectural Pillars</h2>
<ul>
  <li><strong>Multi-Agent Workflows:</strong> Specialized LLM copywriters, SEO auditors, and translators working in parallel.</li>
  <li><strong>RAG Data Intake:</strong> Vector-embedded knowledge ingestion from RSS feeds and Google News API streams.</li>
  <li><strong>Direct CMS Publishing:</strong> Direct REST API integration with WordPress, Webflow, and Ghost.</li>
</ul>
<blockquote>"Generative AI transforms solo writers into full-scale digital newsroom publishers."</blockquote>`)
      setFocusKeyword("Autonomous AI Publishing 2026")
      setMetaTitle("The Future of Autonomous AI Publishing Systems in 2026")
      setMetaDesc("Discover how autonomous AI publishing agents transform content velocity and search rankings.")
      setTags(["AI Publishing", "Next.js 15", "Automation"])
      setIsGenerating(false)
      setIsSaved(false)
    }, 1200)
  }

  return (
    // ══════════════════════════════════════════════════════════════════════
    // FULL-PAGE WORKSPACE OVERLAY
    // ══════════════════════════════════════════════════════════════════════
    <div className="fixed inset-0 z-50 flex flex-col bg-background h-screen w-screen overflow-hidden text-foreground">
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 1. HEADER BAR — PURE WHITE SURFACE CONTRAST (bg-surface)                */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <header className="h-16 border-b border-divider bg-surface px-6 flex items-center justify-between shrink-0 shadow-2xs gap-4">
        {/* Left: Back button & Mode Badge */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            size="sm"
            variant="ghost"
            className="font-semibold text-xs text-default-500 hover:text-foreground shrink-0 border border-divider bg-surface-secondary"
            onPress={() => router.push("/admin/articles")}
          >
            <ArrowLeft className="size-4" /> Exit Editor
          </Button>

          <div className="h-6 w-px bg-divider shrink-0" />

          <div className="flex items-center gap-2 text-xs text-default-500 truncate">
            <span className="font-bold text-foreground">
              {isNewArticle ? "New Article Creation" : `Editing: ${title || "Untitled"}`}
            </span>
            <span>•</span>
            <Chip size="sm" variant="soft" color={status === "published" ? "success" : "warning"} className="uppercase font-bold text-[10px]">
              {status}
            </Chip>
          </div>
        </div>

        {/* Right: Actions & Sidebar Toggle Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Status Selector */}
          <Select
            selectedKey={status}
            onSelectionChange={(key) => { if (key) { setStatus(key as string); setIsSaved(false); } }}
            className="w-36"
            aria-label="Article Status"
          >
            <Select.Trigger className="h-9 text-xs font-bold bg-surface-secondary border border-divider">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="draft">Draft</ListBox.Item>
                <ListBox.Item id="review">In Review</ListBox.Item>
                <ListBox.Item id="approved">Approved</ListBox.Item>
                <ListBox.Item id="scheduled">Scheduled</ListBox.Item>
                <ListBox.Item id="published">Published</ListBox.Item>
                <ListBox.Item id="archived">Archived</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Preview Button */}
          <Button
            size="sm"
            variant="ghost"
            className="font-bold text-xs gap-1.5 bg-surface-secondary border border-divider"
            onPress={() => setIsPreviewOpen(true)}
          >
            <Eye className="size-4 text-default-400" /> Preview
          </Button>

          {/* Save Button */}
          <Button
            size="sm"
            variant={isSaved ? "ghost" : "tertiary"}
            className="font-bold text-xs gap-1.5 bg-surface-secondary border border-divider"
            onPress={handleSave}
          >
            <Save className="size-4" /> {isSaved ? "Saved" : "Save Changes"}
          </Button>

          {/* Publish / Update Button */}
          <Button
            size="sm"
            variant="primary"
            className="font-bold text-xs gap-1.5 shadow-xs"
            onPress={() => {
              setStatus("published")
              setIsSaved(true)
            }}
          >
            <Send className="size-4" /> {status === "published" ? "Update Article" : "Publish Now"}
          </Button>

          <div className="h-6 w-px bg-divider shrink-0 mx-0.5" />

          {/* Expand / Collapse Right Sidebar Button */}
          <Button
            size="sm"
            variant="ghost"
            isIconOnly
            className="bg-surface-secondary border border-divider"
            onPress={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <PanelRightClose className="size-4 text-default-500" /> : <PanelRightOpen className="size-4 text-accent-500" />}
          </Button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 2. MAIN WORKSPACE WITH CONTRAST (GREY CANVAS vs WHITE PAPER CARD)       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden bg-surface-secondary">
        {/* LEFT & CENTER: TIPTAP DOCUMENT WRITER AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

          {/* ── TITLE INPUT + STATS BAR ─────────────────────────────── */}
          <div className="border-b border-divider bg-surface px-8 py-4 shrink-0">
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setIsSaved(false); }}
              placeholder="Enter Article Title Here..."
              className="w-full text-2xl md:text-3xl font-extrabold bg-transparent text-foreground placeholder:text-default-300 focus:outline-none tracking-tight"
            />
            <div className="flex items-center gap-3 text-xs text-default-400 font-medium mt-2 select-none">
              <span>By <strong className="text-foreground">{author}</strong></span>
              <span>•</span>
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{readingTime} min read</span>
              <span>•</span>
              <span className="font-mono">{isNewArticle ? "Fresh Blank Draft" : DEMO_EXISTING_ARTICLE.updated_at}</span>
            </div>
          </div>

          {/* ── TIPTAP ADVANCED WYSIWYG EDITOR ──────────────────────── */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <TiptapEditor
              content={editorHtml}
              onChange={(html) => { setEditorHtml(html); setIsSaved(false); }}
              onWordCountChange={(words) => setWordCount(words)}
              onAiAction={(action, selectedText) => {
                setIsGenerating(true)
                setTimeout(() => { setIsGenerating(false) }, 800)
              }}
            />
          </div>
        </div>


        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* 3. EXPANDABLE RIGHT CONTEXTUAL SIDEBAR — DISTINCT GREY SURFACE         */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        {isSidebarOpen && (
          <aside className="w-80 md:w-96 border-l border-divider bg-surface-secondary flex flex-col shrink-0 overflow-hidden text-foreground transition-all duration-300">
            {/* TAB HEADER NAVIGATION WITH SMOOTH SCROLL */}
            <div className="flex items-center overflow-x-auto scroll-smooth border-b border-divider bg-surface-secondary p-2 shrink-0 gap-1 scrollbar-none">
              <button
                onClick={() => setActiveSidebarTab("overview")}
                className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${activeSidebarTab === "overview" ? "bg-surface text-accent-500 shadow-2xs border border-divider" : "text-default-500 hover:text-foreground"}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSidebarTab("article")}
                className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${activeSidebarTab === "article" ? "bg-surface text-accent-500 shadow-2xs border border-divider" : "text-default-500 hover:text-foreground"}`}
              >
                Article
              </button>
              <button
                onClick={() => setActiveSidebarTab("ai")}
                className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${activeSidebarTab === "ai" ? "bg-surface text-accent-500 shadow-2xs border border-divider" : "text-default-500 hover:text-foreground"}`}
              >
                AI Assistant
              </button>
              <button
                onClick={() => setActiveSidebarTab("workflow")}
                className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${activeSidebarTab === "workflow" ? "bg-surface text-accent-500 shadow-2xs border border-divider" : "text-default-500 hover:text-foreground"}`}
              >
                Workflow
              </button>
              <button
                onClick={() => setActiveSidebarTab("publishing")}
                className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${activeSidebarTab === "publishing" ? "bg-surface text-accent-500 shadow-2xs border border-divider" : "text-default-500 hover:text-foreground"}`}
              >
                Publishing
              </button>
              <button
                onClick={() => setActiveSidebarTab("seo")}
                className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${activeSidebarTab === "seo" ? "bg-surface text-accent-500 shadow-2xs border border-divider" : "text-default-500 hover:text-foreground"}`}
              >
                SEO
              </button>
              <button
                onClick={() => setActiveSidebarTab("activity")}
                className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${activeSidebarTab === "activity" ? "bg-surface text-accent-500 shadow-2xs border border-divider" : "text-default-500 hover:text-foreground"}`}
              >
                Activity
              </button>
            </div>

            {/* TAB CONTENT PANEL CONTAINER WITH SMOOTH SCROLL */}
            <div className="flex-1 overflow-y-auto scroll-smooth p-5 space-y-5 bg-surface-secondary">
              {/* 1. OVERVIEW TAB */}
              {activeSidebarTab === "overview" && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider">General Metadata</h4>

                  <div className="space-y-3 text-xs bg-surface p-4 rounded-2xl border border-divider shadow-2xs">
                    <div className="space-y-1 py-1 border-b border-divider">
                      <label className="text-[11px] font-bold text-default-400">Target Website</label>
                      <Select
                        selectedKey={websiteName}
                        onSelectionChange={(key) => { if (key) { setWebsiteName(key as string); setIsSaved(false); } }}
                        className="w-full text-xs font-bold bg-surface-secondary border border-divider rounded-xl"
                        aria-label="Target Website"
                      >
                        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="TechPulse Daily">TechPulse Daily</ListBox.Item>
                            <ListBox.Item id="AI World News">AI World News</ListBox.Item>
                            <ListBox.Item id="Finance Insights">Finance Insights</ListBox.Item>
                            <ListBox.Item id="Select Website...">Select Website...</ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    <div className="space-y-1 py-1 border-b border-divider">
                      <label className="text-[11px] font-bold text-default-400">Category</label>
                      <Select
                        selectedKey={category}
                        onSelectionChange={(key) => { if (key) { setCategory(key as string); setIsSaved(false); } }}
                        className="w-full text-xs font-bold bg-surface-secondary border border-divider rounded-xl"
                        aria-label="Category"
                      >
                        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="Software Architecture">Software Architecture</ListBox.Item>
                            <ListBox.Item id="Technology">Technology</ListBox.Item>
                            <ListBox.Item id="Artificial Intelligence">Artificial Intelligence</ListBox.Item>
                            <ListBox.Item id="General">General</ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-divider">
                      <span className="text-default-400 font-medium">Author</span>
                      <span className="font-semibold text-foreground">{author}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-divider">
                      <span className="text-default-400 font-medium">Created Date</span>
                      <span className="font-mono text-default-400">{isNewArticle ? "Just Now" : DEMO_EXISTING_ARTICLE.created_at}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-divider">
                      <span className="text-default-400 font-medium">Status</span>
                      <Chip variant="soft" color={status === "published" ? "success" : "warning"} size="sm" className="uppercase font-bold">{status}</Chip>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-default-400 font-medium">Article ID</span>
                      <span className="font-mono text-[11px] text-default-400 flex items-center gap-1">
                        {isNewArticle ? "art-new" : DEMO_EXISTING_ARTICLE.id} <Copy className="size-3 cursor-pointer hover:text-foreground" />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ARTICLE CONFIG TAB */}
              {activeSidebarTab === "article" && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider">Article Properties</h4>

                  {/* Tags */}
                  <div className="space-y-1.5 bg-surface p-4 rounded-2xl border border-divider">
                    <label className="text-xs font-bold text-foreground">Tags</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {tags.length === 0 ? (
                        <span className="text-xs text-default-400 italic">No tags added yet.</span>
                      ) : (
                        tags.map((t) => (
                          <Chip key={t} size="sm" variant="soft" color="accent" className="text-xs font-medium">
                            {t} <X className="size-3 cursor-pointer ml-1" onClick={() => handleRemoveTag(t)} />
                          </Chip>
                        ))
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="text-xs bg-surface-secondary border border-divider"
                      />
                      <Button size="sm" variant="ghost" onPress={handleAddTag} className="font-bold text-xs bg-surface-secondary border border-divider">Add</Button>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div className="space-y-1.5 bg-surface p-4 rounded-2xl border border-divider">
                    <label className="text-xs font-bold text-foreground">Featured Image</label>
                    <div className="h-32 rounded-2xl bg-surface-secondary border border-dashed border-divider flex flex-col items-center justify-center p-4 text-center gap-2">
                      <ImageIcon className="size-6 text-default-400" />
                      <span className="text-xs text-default-400">Drag & drop image or generate artwork</span>
                      <Button size="sm" variant="ghost" className="text-xs font-bold bg-surface border border-divider" onPress={() => {/* Image upload coming soon */}}>Upload / Generate</Button>
                    </div>
                  </div>

                  {/* URL Slug */}
                  <div className="space-y-1.5 bg-surface p-4 rounded-2xl border border-divider">
                    <label className="text-xs font-bold text-foreground">URL Slug</label>
                    <Input
                      placeholder="e.g. my-first-article"
                      value={slug}
                      onChange={(e) => { setSlug(e.target.value); setIsSaved(false); }}
                      className="text-xs font-mono bg-surface-secondary border border-divider"
                    />
                  </div>

                  {/* Author & Language */}
                  <div className="space-y-3 bg-surface p-4 rounded-2xl border border-divider">
                    <div>
                      <label className="text-xs font-bold text-foreground">Author</label>
                      <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="text-xs bg-surface-secondary border border-divider" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground">Language</label>
                      <Input value={language} onChange={(e) => setLanguage(e.target.value)} className="text-xs bg-surface-secondary border border-divider" />
                    </div>
                  </div>

                  {/* Workflow Assignment */}
                  <div className="space-y-1.5 bg-surface p-4 rounded-2xl border border-divider">
                    <label className="text-xs font-bold text-foreground">Workflow Assignment</label>
                    <Select
                      selectedKey={workflowAssignment}
                      onSelectionChange={(key) => { if (key) { setWorkflowAssignment(key as string); setIsSaved(false); } }}
                      className="w-full text-xs font-bold bg-surface-secondary border border-divider rounded-xl"
                      aria-label="Workflow Assignment"
                    >
                      <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="Autonomous Newsroom Digest">Autonomous Newsroom Digest</ListBox.Item>
                          <ListBox.Item id="SEO Topic Cluster & Article Generator">SEO Topic Cluster</ListBox.Item>
                          <ListBox.Item id="Multi-Lingual Translation & Publishing">Multi-Lingual Translation</ListBox.Item>
                          <ListBox.Item id="Not Assigned">Not Assigned</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>
              )}

              {/* 3. AI ASSISTANT TAB */}
              {activeSidebarTab === "ai" && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="size-4 text-accent-500" /> AI Generation Engine
                  </h4>

                  <div className="space-y-4 bg-surface p-4 rounded-2xl border border-divider">
                    {/* Context Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Context Scope</label>
                      <Select
                        selectedKey={aiContext}
                        onSelectionChange={(key) => key && setAiContext(key as string)}
                        className="w-full text-xs bg-surface-secondary border border-divider rounded-xl"
                        aria-label="Context Scope"
                      >
                        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="full_doc">Full Document Context</ListBox.Item>
                            <ListBox.Item id="selection">Current Selection Only</ListBox.Item>
                            <ListBox.Item id="sources">Connected RAG Sources</ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Agent Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Assigned Copywriter Agent</label>
                      <Select
                        selectedKey={selectedAgent}
                        onSelectionChange={(key) => key && setSelectedAgent(key as string)}
                        className="w-full text-xs bg-surface-secondary border border-divider rounded-xl"
                        aria-label="Assigned Agent"
                      >
                        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="SEO Copywriter Agent">SEO Copywriter Agent</ListBox.Item>
                            <ListBox.Item id="Polyglot Translator">Polyglot Translator</ListBox.Item>
                            <ListBox.Item id="SERP Keyword Extractor">SERP Keyword Extractor</ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Prompt Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Custom AI Instruction</label>
                      <textarea
                        placeholder="e.g. Write an article about autonomous Next.js 15 micro-saas..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        rows={3}
                        className="w-full text-xs p-3 rounded-xl bg-surface-secondary border border-divider text-foreground focus:outline-none"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full font-bold text-xs gap-2"
                        onPress={handleGenerateAiArticle}
                        isDisabled={isGenerating}
                      >
                        <Sparkles className="size-4" /> {isGenerating ? "Generating..." : "Run AI Generation"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. WORKFLOW TAB */}
              {activeSidebarTab === "workflow" && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <GitBranch className="size-4 text-accent-500" /> Automation Pipeline
                  </h4>

                  {workflowAssignment === "Not Assigned" ? (
                    <div className="p-6 text-center text-default-400 space-y-2 bg-surface rounded-2xl border border-divider">
                      <AlertCircle className="size-8 mx-auto" />
                      <p className="text-xs font-medium">No automated workflow blueprint assigned to this article.</p>
                      <Button size="sm" variant="ghost" className="text-xs font-bold mt-2 bg-surface-secondary border border-divider" onPress={() => setWorkflowAssignment("Autonomous Newsroom Digest")}>
                        Assign Workflow Blueprint
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs bg-surface p-4 rounded-2xl border border-divider">
                      <div className="p-3 rounded-xl bg-surface-secondary border border-divider space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground text-xs">{workflowAssignment}</span>
                          <Chip variant="soft" color="success" size="sm">Completed</Chip>
                        </div>
                        <div className="text-[11px] text-default-400">Trigger: {isNewArticle ? "Manual" : DEMO_EXISTING_ARTICLE.trigger}</div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-bold text-xs text-foreground">Sources Used</h5>
                        <div className="p-3 rounded-xl bg-surface-secondary border border-divider font-mono text-[11px] space-y-1">
                          <div>• TechCrunch RSS Stream</div>
                          <div>• Official Supabase 2026 Docs</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-bold text-xs text-foreground">Agents Executed</h5>
                        <div className="flex flex-wrap gap-1.5">
                          <Chip size="sm" variant="soft" color="accent">SERP Extractor</Chip>
                          <Chip size="sm" variant="soft" color="accent">SEO Copywriter</Chip>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. PUBLISHING TAB */}
              {activeSidebarTab === "publishing" && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="size-4 text-accent-500" /> CMS Publishing Control
                  </h4>

                  <div className="space-y-3 text-xs bg-surface p-4 rounded-2xl border border-divider">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Target Website CMS</label>
                      <Input value={websiteName} disabled className="text-xs bg-surface-secondary border border-divider" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Destination Live URL</label>
                      {!isNewArticle ? (
                        <a
                          href={DEMO_EXISTING_ARTICLE.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-accent-500 hover:underline flex items-center gap-1 truncate"
                        >
                          {DEMO_EXISTING_ARTICLE.website_url} <ExternalLink className="size-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-xs text-default-400 italic">URL will be generated upon publishing</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Published Date</label>
                      <Input value={isNewArticle ? "Not Published Yet" : DEMO_EXISTING_ARTICLE.published_at} disabled className="text-xs font-mono bg-surface-secondary border border-divider" />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. SEO TAB */}
              {activeSidebarTab === "seo" && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="size-4 text-accent-500" /> SEO Optimization
                  </h4>

                  <div className="space-y-4 bg-surface p-4 rounded-2xl border border-divider">
                    {/* Dynamic Score Gauge */}
                    <div className="p-4 rounded-2xl bg-surface-secondary border border-divider flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="text-xs font-bold text-foreground">Overall SEO Score</div>
                        <div className="text-[11px] text-default-400">Live optimization score</div>
                      </div>
                      <div className="text-2xl font-black text-success-500 font-mono">
                        {calculatedSeoScore}<span className="text-xs text-default-400 font-normal">/100</span>
                      </div>
                    </div>

                    {/* Focus Keyword */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Focus Keyword</label>
                      <Input
                        placeholder="e.g. Next.js 15 Micro SaaS"
                        value={focusKeyword}
                        onChange={(e) => { setFocusKeyword(e.target.value); setIsSaved(false); }}
                        className="text-xs bg-surface-secondary border border-divider"
                      />
                    </div>

                    {/* Meta Title */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground">Meta Title</label>
                        <span className="text-[11px] text-default-400 font-mono">{metaTitle.length}/60</span>
                      </div>
                      <Input
                        placeholder="e.g. Building Micro-SaaS with Next.js"
                        value={metaTitle}
                        onChange={(e) => { setMetaTitle(e.target.value); setIsSaved(false); }}
                        className="text-xs bg-surface-secondary border border-divider"
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground">Meta Description</label>
                        <span className="text-[11px] text-default-400 font-mono">{metaDesc.length}/160</span>
                      </div>
                      <textarea
                        placeholder="Meta description for search engine results..."
                        value={metaDesc}
                        onChange={(e) => { setMetaDesc(e.target.value); setIsSaved(false); }}
                        rows={3}
                        className="w-full text-xs p-3 rounded-xl bg-surface-secondary border border-divider text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 7. ACTIVITY TAB */}
              {activeSidebarTab === "activity" && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <History className="size-4 text-accent-500" /> Article Lifecycle Timeline
                  </h4>

                  <div className="bg-surface p-5 rounded-2xl border border-divider">
                    <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-divider">
                      {isNewArticle ? (
                        <div className="relative">
                          <div className="absolute -left-6 top-1 size-3 rounded-full bg-accent-500 ring-4 ring-surface" />
                          <div className="text-xs font-bold text-foreground">New Draft Created</div>
                          <div className="text-[11px] text-default-400 font-mono">Just Now by You</div>
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            <div className="absolute -left-6 top-1 size-3 rounded-full bg-accent-500 ring-4 ring-surface" />
                            <div className="text-xs font-bold text-foreground">Article Published</div>
                            <div className="text-[11px] text-default-400 font-mono">2026-08-02 09:00 by System</div>
                          </div>

                          <div className="relative">
                            <div className="absolute -left-6 top-1 size-3 rounded-full bg-success-500 ring-4 ring-surface" />
                            <div className="text-xs font-bold text-foreground">Approved for Publishing</div>
                            <div className="text-[11px] text-default-400 font-mono">2026-08-01 16:40 by Kadam Raval</div>
                          </div>

                          <div className="relative">
                            <div className="absolute -left-6 top-1 size-3 rounded-full bg-warning-500 ring-4 ring-surface" />
                            <div className="text-xs font-bold text-foreground">Workflow Executed</div>
                            <div className="text-[11px] text-default-400 font-mono">2026-08-01 14:32 (Autonomous Digest)</div>
                          </div>

                          <div className="relative">
                            <div className="absolute -left-6 top-1 size-3 rounded-full bg-default-400 ring-4 ring-surface" />
                            <div className="text-xs font-bold text-foreground">Article Created</div>
                            <div className="text-[11px] text-default-400 font-mono">2026-08-01 14:30</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 4. PREVIEW MODAL                                                      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-divider rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-divider flex items-center justify-between bg-surface-secondary/60">
              <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                <Eye className="size-4 text-accent-500" /> Article Live Preview Mode
              </h3>
              <Button size="sm" variant="ghost" isIconOnly onPress={() => setIsPreviewOpen(false)}>
                <X className="size-4 text-default-400" />
              </Button>
            </div>
            <div className="p-8 overflow-y-auto space-y-4">
              <h1 className="text-2xl font-bold text-foreground">{title || "Untitled Article"}</h1>
              <div className="text-xs text-default-400 font-medium">Target Website: {websiteName}</div>
              <div
                className="prose dark:prose-invert text-sm max-w-none space-y-3"
                dangerouslySetInnerHTML={{ __html: editorHtml || "No content written yet." }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 5. VERSION HISTORY DRAWER                                             */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {isVersionHistoryOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-surface border-l border-divider w-full max-w-md h-full flex flex-col p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-divider">
              <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                <History className="size-4 text-accent-500" /> Version Revisions
              </h3>
              <Button size="sm" variant="ghost" isIconOnly onPress={() => setIsVersionHistoryOpen(false)}>
                <X className="size-4 text-default-400" />
              </Button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1">
              <div className="p-3.5 rounded-2xl bg-surface-secondary border border-accent-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground">
                    {isNewArticle ? "v1.0 (Fresh Draft)" : "v2.0 (Current Draft)"}
                  </span>
                  <Chip variant="soft" color="success" size="sm">Active</Chip>
                </div>
                <div className="text-[11px] text-default-400 font-mono">Just Now by Kadam Raval</div>
              </div>

              {!isNewArticle && (
                <div className="p-3.5 rounded-2xl bg-surface-secondary border border-divider space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">v1.0 (Initial Revision)</span>
                    <Button size="sm" variant="ghost" className="text-[11px] font-bold h-6 bg-surface border border-divider" onPress={() => setIsVersionHistoryOpen(false)}>
                      Restore
                    </Button>
                  </div>
                  <div className="text-[11px] text-default-400 font-mono">2026-08-01 14:30 Initial Draft</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
