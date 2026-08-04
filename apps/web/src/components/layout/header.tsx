"use client"

import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sun, Moon, Info, Plus, Calendar, Download, Globe, Filter, ArrowUpDown, LayoutGrid, Table as TableIcon, Check, FolderPlus } from "lucide-react"
import { Button, Tooltip, Popover, ListBox } from "@heroui/react"
import { fetchWebsites } from "@/lib/api"

const pageTitleMap: Record<string, { title: string; info: string }> = {
  "/admin/dashboard": { title: "Dashboard", info: "Overview of active properties, publication queue & AI metrics" },
  "/admin/websites": { title: "Websites", info: "Manage target CMS properties, domain credentials & schedules" },
  "/admin/sources": { title: "Sources", info: "Data intake engine: RSS feeds, Google News & API streams" },
  "/admin/custom-agents": { title: "Agent", info: "Configure AI agents, skill assignments & integration permissions" },
  "/admin/workflows": { title: "Workflow", info: "Visual node graph engine for multi-agent publishing pipelines" },
  "/admin/analytics": { title: "Analytics", info: "30-day traffic velocity, top ranking keywords & publication performance" },
  "/admin/articles": { title: "Articles", info: "Article library, live posts, and draft management" },
  "/admin/files": { title: "Files", info: "Manage website root folders, subdirectories & file assets" },
  "/admin/integrations": { title: "Integration", info: "API connections: WordPress, fal.ai, OpenAI, Google News" },
  "/admin/notifications": { title: "Notifications", info: "Event-driven system delivering alerts across Resend, Slack, Discord, Webhook, API & MCP" },
  "/admin/settings": { title: "Settings", info: "Platform settings, organization profiles & system preferences" }
}

const DEMO_WEBSITES = [
  { id: "all", name: "All Websites" },
  { id: "site-1", name: "AI News" },
  { id: "site-2", name: "Tech Blog" },
  { id: "site-3", name: "Finance Blog" },
  { id: "site-4", name: "Travel Blog" }
]

export function Header() {
  const pathname = usePathname() || "/admin/dashboard"
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [showTooltip, setShowTooltip] = useState(false)
  const [websites, setWebsites] = useState<any[]>(DEMO_WEBSITES)
  const [selectedSiteId, setSelectedSiteId] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("30d")

  useEffect(() => {
    async function loadWebsites() {
      const data = await fetchWebsites()
      if (data && data.length > 0) {
        setWebsites([
          { id: "all", name: "All Websites" },
          ...data.map((w: any) => ({ id: w.id, name: w.name }))
        ])
      }
    }
    loadWebsites()
  }, [])

  // Always dispatch event — pages listen and open their own modal
  const handleOpenModal = () => {
    window.dispatchEvent(new CustomEvent("open-admin-modal"))
  }

  const handleSiteChange = (val: string) => {
    setSelectedSiteId(val)
    window.dispatchEvent(new CustomEvent("analytics-site-change", { detail: { siteId: val } }))
  }

  const handleDateChange = (val: string) => {
    setDateRange(val)
    window.dispatchEvent(new CustomEvent("analytics-date-change", { detail: { dateRange: val } }))
  }

  // Find page title info
  const currentPageKey = Object.keys(pageTitleMap).find((key) =>
    pathname === key || pathname.startsWith(`${key}/`)
  )
  const currentInfo = currentPageKey ? pageTitleMap[currentPageKey] : { title: "AI OS", info: "Autonomous AI Publishing Platform" }

  return (
    <header className="h-14 border-b border-divider bg-content1 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Page title */}
      <div className="flex items-center gap-2 relative">
        <span className="text-sm font-semibold">{currentInfo.title}</span>
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info className="size-3.5 text-default-400 hover:text-foreground cursor-pointer transition-colors" />
          {showTooltip && (
            <div className="absolute left-6 top-0 w-64 p-2.5 bg-content1 text-foreground text-xs rounded-large border border-divider shadow-medium z-50 pointer-events-none leading-relaxed">
              {currentInfo.info}
            </div>
          )}
        </div>
      </div>

      {/* Right: Dynamic action controls */}
      <div className="flex items-center gap-2">
        {pathname.startsWith("/admin/analytics") && (
          <>
            <select
              value={selectedSiteId}
              onChange={(e) => handleSiteChange(e.target.value)}
              className="h-8 px-3 text-xs bg-background text-foreground border border-divider rounded-medium focus:outline-none"
              aria-label="Select website"
            >
              {websites.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>

            <select
              value={dateRange}
              onChange={(e) => handleDateChange(e.target.value)}
              className="h-8 px-3 text-xs bg-background text-foreground border border-divider rounded-medium focus:outline-none"
              aria-label="Select date range"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year to Date</option>
            </select>

            <Button variant="outline" size="sm"><Download className="size-3.5"  /> 
              Export
            </Button>
          </>
        )}

        {/* Contextual Filter & Sort controls in top header */}
        {(pathname.startsWith("/admin/articles") || pathname.startsWith("/admin/workflows") || pathname.startsWith("/admin/sources") || pathname.startsWith("/admin/websites") || pathname.startsWith("/admin/custom-agents") || pathname.startsWith("/admin/files")) && (
          <div className="flex items-center gap-1.5 mr-1">
            {/* Filter Popover */}
            <Popover>
              <Popover.Trigger>
                <button
                  type="button"
                  className="size-8 rounded-medium border border-divider flex items-center justify-center text-default-500 hover:text-foreground hover:bg-default-100 transition-colors"
                  aria-label="Filter records"
                >
                  <Filter className="size-4" />
                </button>
              </Popover.Trigger>
              <Popover.Content className="w-56 p-2 bg-content1 border border-divider rounded-2xl shadow-xl z-50">
                <div className="text-xs font-bold text-foreground px-2 py-1 border-b border-divider mb-1">
                  Filter Options
                </div>
                <ListBox selectionMode="single">
                  <ListBox.Item id="all" onPress={() => window.dispatchEvent(new CustomEvent("header-filter-change", { detail: "all" }))}>All Records</ListBox.Item>
                  <ListBox.Item id="active" onPress={() => window.dispatchEvent(new CustomEvent("header-filter-change", { detail: "active" }))}>Active Only</ListBox.Item>
                  <ListBox.Item id="published" onPress={() => window.dispatchEvent(new CustomEvent("header-filter-change", { detail: "published" }))}>Published Only</ListBox.Item>
                  <ListBox.Item id="draft" onPress={() => window.dispatchEvent(new CustomEvent("header-filter-change", { detail: "draft" }))}>Drafts Only</ListBox.Item>
                </ListBox>
              </Popover.Content>
            </Popover>

            {/* Sort Popover */}
            <Popover>
              <Popover.Trigger>
                <button
                  type="button"
                  className="size-8 rounded-medium border border-divider flex items-center justify-center text-default-500 hover:text-foreground hover:bg-default-100 transition-colors"
                  aria-label="Sort order"
                >
                  <ArrowUpDown className="size-4" />
                </button>
              </Popover.Trigger>
              <Popover.Content className="w-48 p-2 bg-content1 border border-divider rounded-2xl shadow-xl z-50">
                <div className="text-xs font-bold text-foreground px-2 py-1 border-b border-divider mb-1">
                  Sort Order
                </div>
                <ListBox selectionMode="single">
                  <ListBox.Item id="name-asc" onPress={() => window.dispatchEvent(new CustomEvent("header-sort-change", { detail: { field: "name", asc: true } }))}>Name (A-Z)</ListBox.Item>
                  <ListBox.Item id="name-desc" onPress={() => window.dispatchEvent(new CustomEvent("header-sort-change", { detail: { field: "name", asc: false } }))}>Name (Z-A)</ListBox.Item>
                  <ListBox.Item id="date-newest" onPress={() => window.dispatchEvent(new CustomEvent("header-sort-change", { detail: { field: "date", asc: false } }))}>Newest First</ListBox.Item>
                </ListBox>
              </Popover.Content>
            </Popover>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-content2 border border-divider rounded-xl">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("header-view-change", { detail: "table" }))}
                className="size-7 rounded-lg flex items-center justify-center text-default-500 hover:text-foreground transition-all"
                title="Table View"
              >
                <TableIcon className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("header-view-change", { detail: "grid" }))}
                className="size-7 rounded-lg flex items-center justify-center text-default-500 hover:text-foreground transition-all"
                title="Grid View"
              >
                <LayoutGrid className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {pathname.startsWith("/admin/websites") && (
          <Button size="sm" onPress={handleOpenModal}>
            <Plus className="size-3.5" /> Add Website
          </Button>
        )}

        {pathname.startsWith("/admin/custom-agents") && (
          <Button size="sm" onPress={handleOpenModal}>
            <Plus className="size-3.5" /> Create Agent
          </Button>
        )}

        {pathname.startsWith("/admin/workflows") && (
          <Button size="sm" onPress={handleOpenModal}>
            <Plus className="size-3.5" /> Create Workflow
          </Button>
        )}

        {pathname.startsWith("/admin/sources") && (
          <Button size="sm" onPress={handleOpenModal}>
            <Plus className="size-3.5" /> Add Source
          </Button>
        )}

        {pathname.startsWith("/admin/articles") && (
          <Button size="sm" onPress={() => router.push("/admin/articles/new")}>
            <Plus className="size-3.5" /> Create Article
          </Button>
        )}

        {pathname.startsWith("/admin/integrations") && (
          <Button size="sm" onPress={handleOpenModal}>
            <Plus className="size-3.5" /> Add Integration
          </Button>
        )}

        {pathname === "/admin/notifications" && (
          <Button size="sm" onPress={() => router.push("/admin/notifications/new")}>
            <Plus className="size-3.5" /> Create Subscription
          </Button>
        )}

        {pathname.startsWith("/admin/files") && (
          <>
            <Button size="sm" variant="outline" onPress={() => window.dispatchEvent(new CustomEvent("open-create-folder-modal"))}>
              <FolderPlus className="size-3.5" /> New Folder
            </Button>
            <Button size="sm" onPress={handleOpenModal}>
              <Plus className="size-3.5" /> Upload File
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
