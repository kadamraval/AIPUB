"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Modal } from "@heroui/react"
import {
  Search, LayoutDashboard, Globe, Rss, Bot, GitBranch, LineChart, FileText, Image as ImageIcon, Folder, Puzzle, Mail, Settings, Plus, Sparkles, Database, FileCode
} from "lucide-react"
import { fetchArticles, fetchWebsites, fetchSources, fetchCustomAgents, fetchWorkflows } from "@/lib/api"

export function SearchModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [tableData, setTableData] = useState<any[]>([])

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K" || e.code === "KeyK" || e.keyCode === 75)) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener("open-search-modal", handleOpen)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("open-search-modal", handleOpen)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Fetch live table records on modal open
  useEffect(() => {
    if (!isOpen) return
    async function loadAllRecords() {
      try {
        const [arts, sites, srcs, agts, wfs] = await Promise.all([
          fetchArticles(),
          fetchWebsites(),
          fetchSources(),
          fetchCustomAgents(),
          fetchWorkflows()
        ])

        const combined: any[] = []

        // Navigation
        combined.push(
          { id: "nav-dash", name: "Dashboard Overview", sub: "/admin/dashboard", href: "/admin/dashboard", category: "Navigation", icon: LayoutDashboard },
          { id: "nav-web", name: "Websites Properties", sub: "/admin/websites", href: "/admin/websites", category: "Navigation", icon: Globe },
          { id: "nav-src", name: "Data Sources & RSS Feeds", sub: "/admin/sources", href: "/admin/sources", category: "Navigation", icon: Rss },
          { id: "nav-agt", name: "AI Custom Agents", sub: "/admin/custom-agents", href: "/admin/custom-agents", category: "Navigation", icon: Bot },
          { id: "nav-wf", name: "Publishing Workflows", sub: "/admin/workflows", href: "/admin/workflows", category: "Navigation", icon: GitBranch },
          { id: "nav-ana", name: "Traffic Analytics", sub: "/admin/analytics", href: "/admin/analytics", category: "Navigation", icon: LineChart },
          { id: "nav-art", name: "Articles Directory", sub: "/admin/articles", href: "/admin/articles", category: "Navigation", icon: FileText },
          { id: "nav-files", name: "Files Directory", sub: "/admin/files", category: "Navigation", href: "/admin/files", icon: Folder },
          { id: "nav-int", name: "API Integrations", sub: "/admin/integrations", category: "Navigation", href: "/admin/integrations", icon: Puzzle },
          { id: "nav-nws", name: "Newsletters Automation", sub: "/admin/newsletters", category: "Navigation", href: "/admin/newsletters", icon: Mail },
          { id: "nav-set", name: "Platform Settings", sub: "/admin/settings", category: "Navigation", href: "/admin/settings", icon: Settings },
          { id: "act-new-art", name: "Create New Article", sub: "Open Rich Text Editor", href: "/admin/articles/new", category: "Action", icon: Plus }
        )

        // Articles
        if (arts && arts.length > 0) {
          arts.forEach((a: any) => {
            combined.push({
              id: `art-${a.id}`,
              name: a.title,
              sub: `Article • ${a.target_website || "Website"} • ${a.status}`,
              href: `/admin/articles/${a.id}`,
              category: "Articles",
              icon: FileText
            })
          })
        }

        // Websites
        if (sites && sites.length > 0) {
          sites.forEach((s: any) => {
            combined.push({
              id: `site-${s.id}`,
              name: s.name,
              sub: `Property • ${s.domain} • ${s.cms_type}`,
              href: "/admin/websites",
              category: "Websites",
              icon: Globe
            })
          })
        }

        // Sources
        if (srcs && srcs.length > 0) {
          srcs.forEach((sc: any) => {
            combined.push({
              id: `src-${sc.id}`,
              name: sc.name,
              sub: `Source Stream • ${sc.stream_type || "RSS"}`,
              href: "/admin/sources",
              category: "Sources",
              icon: Rss
            })
          })
        }

        // Custom Agents
        if (agts && agts.length > 0) {
          agts.forEach((ag: any) => {
            combined.push({
              id: `agt-${ag.id}`,
              name: ag.name,
              sub: `Agent • ${ag.role_description || "AI Specialist"}`,
              href: "/admin/custom-agents",
              category: "Agents",
              icon: Bot
            })
          })
        }

        // Workflows
        if (wfs && wfs.length > 0) {
          wfs.forEach((w: any) => {
            combined.push({
              id: `wf-${w.id}`,
              name: w.name,
              sub: `Workflow • ${w.status || "Blueprint"}`,
              href: "/admin/workflows",
              category: "Workflows",
              icon: GitBranch
            })
          })
        }

        setTableData(combined)
      } catch (err) {
        console.error("Failed to load records into search modal:", err)
      }
    }
    loadAllRecords()
  }, [isOpen])

  const filteredResults = tableData.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    (item.sub && item.sub.toLowerCase().includes(query.toLowerCase())) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (href: string) => {
    setIsOpen(false)
    setQuery("")
    router.push(href)
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Container placement="top">
          <Modal.Dialog className="max-w-xl w-full bg-content1 border border-divider rounded-3xl shadow-2xl p-0 overflow-hidden mt-16">
            <div className="p-4 border-b border-divider flex items-center gap-3 bg-content2/50">
              <Search className="size-5 text-default-400 shrink-0" />
              <input
                type="text"
                placeholder="Search pages, articles, sources, agents, or workflows..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-default-400"
                autoFocus
              />
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-default-100 text-default-400 border border-divider rounded shrink-0">
                ESC
              </kbd>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {filteredResults.length > 0 ? (
                <div className="space-y-1">
                  {filteredResults.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-default-100 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-8 rounded-lg bg-default-100 flex items-center justify-center text-default-500 group-hover:text-foreground group-hover:bg-default-200 transition-colors shrink-0">
                            <Icon className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground truncate">{item.name}</div>
                            <div className="text-[11px] text-default-400 truncate">{item.sub}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-default-100 text-default-500 rounded-md shrink-0 ml-2">
                          {item.category}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-default-400">
                  No matching records or pages found for "{query}"
                </div>
              )}
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
