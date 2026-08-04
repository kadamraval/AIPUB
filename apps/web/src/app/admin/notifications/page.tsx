"use client"

export const dynamic = "force-dynamic"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Check,
  X,
  Radio,
  FileCode2,
  History,
  Settings as SettingsIcon,
  Play,
  CheckCircle2,
  Mail,
  Send,
  Zap,
  Clock,
  ShieldCheck,
  Server,
  Layers,
  Puzzle
} from "lucide-react"
import {
  Button,
  Chip,
  Popover,
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip
} from "@heroui/react"

// PROVIDERS REGISTRY
const NOTIFICATION_PROVIDERS = [
  { id: "slack", name: "Slack", icon: Send, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", defaultRecipient: "#publishing-alerts" },
  { id: "discord", name: "Discord", icon: Radio, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30", defaultRecipient: "https://discord.com/api/webhooks/98234" },
  { id: "resend", name: "Email (Resend)", icon: Mail, color: "text-blue-500 bg-blue-500/10 border-blue-500/30", defaultRecipient: "subscribers@aipub.io" },
  { id: "webhook", name: "Webhook", icon: Zap, color: "text-amber-500 bg-amber-500/10 border-amber-500/30", defaultRecipient: "https://api.aipub.io/hooks/v1" },
  { id: "api", name: "API", icon: Server, color: "text-purple-500 bg-purple-500/10 border-purple-500/30", defaultRecipient: "POST /v1/notifications/dispatch" },
  { id: "mcp", name: "MCP", icon: Layers, color: "text-rose-500 bg-rose-500/10 border-rose-500/30", defaultRecipient: "mcp://server.aipub.internal/notify" },
  { id: "custom", name: "Custom Integration", icon: Puzzle, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30", defaultRecipient: "Custom Event Listener" }
]

// INITIAL DEMO SUBSCRIPTIONS DATA
const INITIAL_SUBSCRIPTIONS = [
  {
    id: "sub-1",
    name: "Workflow Publishing Alert",
    description: "Delivers real-time notifications to team channels whenever a workflow completes or fails.",
    events: ["Workflow Completed", "Workflow Failed"],
    providers: ["Slack", "Discord"],
    recipients: "#publishing-alerts, https://discord.com/api/webhooks/98234",
    template: "Workflow Completion Alert",
    conditions: "status === 'success' || errorCount > 0",
    status: "Active",
    lastTriggered: "12 mins ago",
    totalDelivered: 1420
  },
  {
    id: "sub-2",
    name: "Article Publication Subscriber Digest",
    description: "Sends an email digest via Resend to subscribers upon new article publication.",
    events: ["Article Published"],
    providers: ["Email (Resend)"],
    recipients: "subscribers-digest@aipub.io",
    template: "Article Publication Digest",
    conditions: "isPublished === true",
    status: "Active",
    lastTriggered: "1 hour ago",
    totalDelivered: 8930
  },
  {
    id: "sub-3",
    name: "Website Build Incident Monitor",
    description: "Alerts infrastructure team via Discord and email when a website deployment fails.",
    events: ["Website Failed"],
    providers: ["Discord", "Email (Resend)"],
    recipients: "https://discord.com/api/webhooks/98234, admin@aipub.io",
    template: "Website Build Incident Alert",
    conditions: "errorCount > 0",
    status: "Active",
    lastTriggered: "3 hours ago",
    totalDelivered: 42
  },
  {
    id: "sub-4",
    name: "External API Integration Disconnect Alert",
    description: "Dispatches HTTP webhook to external APM system on integration failures.",
    events: ["Integration Failed", "Integration Disconnected"],
    providers: ["Webhook", "API"],
    recipients: "https://api.external-monitoring.com/v1/webhook",
    template: "Integration Connection Failure",
    conditions: "retryAttempts >= 3",
    status: "Active",
    lastTriggered: "Yesterday",
    totalDelivered: 19
  },
  {
    id: "sub-5",
    name: "System Backup Incident Dispatcher",
    description: "Sends incident notifications to MCP server and API endpoints on backup failures.",
    events: ["Backup Failed"],
    providers: ["API", "MCP"],
    recipients: "POST /v1/infra/backup-incident",
    template: "Custom System Event Dispatch",
    conditions: "storageUsed > 90%",
    status: "Disabled",
    lastTriggered: "3 days ago",
    totalDelivered: 5
  }
]

// DEMO DELIVERY LOGS DATA
const INITIAL_DELIVERY_LOGS = [
  {
    id: "log-1",
    event: "Workflow Completed",
    subscription: "Workflow Publishing Alert",
    provider: "Slack",
    recipient: "#publishing-alerts",
    status: "Delivered",
    deliveredAt: "2026-08-04 14:12:05",
    response: "200 OK (slack_ts: 178582910.12)"
  },
  {
    id: "log-2",
    event: "Article Published",
    subscription: "Article Publication Subscriber Digest",
    provider: "Email (Resend)",
    recipient: "subscribers-digest@aipub.io",
    status: "Delivered",
    deliveredAt: "2026-08-04 13:45:10",
    response: "200 OK (resend_id: msg_8923481)"
  },
  {
    id: "log-3",
    event: "Website Failed",
    subscription: "Website Build Incident Monitor",
    provider: "Discord",
    recipient: "https://discord.com/api/webhooks/98234",
    status: "Delivered",
    deliveredAt: "2026-08-04 11:30:22",
    response: "204 No Content"
  },
  {
    id: "log-4",
    event: "Integration Failed",
    subscription: "External API Integration Disconnect Alert",
    provider: "Webhook",
    recipient: "https://api.external-monitoring.com/v1/webhook",
    status: "Failed",
    deliveredAt: "2026-08-04 10:15:00",
    response: "504 Gateway Timeout (Retry 3/3)"
  },
  {
    id: "log-5",
    event: "File Uploaded",
    subscription: "Global Media Sync Rule",
    provider: "MCP",
    recipient: "mcp://server.aipub.internal/notify",
    status: "Delivered",
    deliveredAt: "2026-08-04 09:05:44",
    response: "200 OK (mcp_session_active)"
  }
]

export default function NotificationsPage() {
  const router = useRouter()

  // Navigation & View State
  const [activeSection, setActiveSection] = useState<"subscriptions" | "providers" | "templates" | "logs" | "settings">("subscriptions")
  const [searchQuery, setSearchQuery] = useState("")
  const [displayMode, setDisplayMode] = useState<"grid" | "table">("grid")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Data State
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS)
  const [deliveryLogs, setDeliveryLogs] = useState(INITIAL_DELIVERY_LOGS)
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Header Event Listener
  useEffect(() => {
    const handleOpenModal = () => router.push("/admin/notifications/new")
    window.addEventListener("open-admin-modal", handleOpenModal)
    return () => window.removeEventListener("open-admin-modal", handleOpenModal)
  }, [router])

  // Show Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Handle Send Test Notification
  const handleSendTestNotification = (subName: string, providerName: string) => {
    const newLog = {
      id: `log-${Date.now()}`,
      event: "Test Notification Event",
      subscription: subName,
      provider: providerName,
      recipient: "test-environment@aipub.io",
      status: "Delivered",
      deliveredAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      response: "200 OK (Test Dispatch Verified)"
    }
    setDeliveryLogs((prev) => [newLog, ...prev])
    showToast(`🚀 Test notification dispatched via ${providerName}! Log recorded.`)
  }

  // Filtered Subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.events.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sub.providers.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || sub.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <div className="-m-6 h-[calc(100vh-3.5rem)] flex overflow-hidden border-t border-divider bg-background">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-foreground text-background px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 1. 2ND SIDEBAR (NOTIFICATION NAVIGATION)                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <aside className="w-64 bg-content1 border-r border-divider flex flex-col shrink-0 overflow-hidden">
        <div className="p-3 space-y-4 text-xs overflow-y-auto flex-1 scrollbar-thin">
          
          {/* Header Label & Create Icon */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-accent" />
              <span className="font-bold text-foreground tracking-wide uppercase text-[11px]">Notifications OS</span>
            </div>
            <Tooltip>
              <Tooltip.Trigger>
                <button
                  type="button"
                  onClick={() => router.push("/admin/notifications/new")}
                  className="p-1 rounded-lg text-default-400 hover:text-foreground hover:bg-default-100 transition-colors"
                >
                  <Plus className="size-3.5" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content placement="top">Create Subscription</Tooltip.Content>
            </Tooltip>
          </div>

          <div className="border-t border-divider/60 my-1" />

          {/* 2nd Sidebar Navigation Menu */}
          <div className="space-y-1">
            <div
              onClick={() => setActiveSection("subscriptions")}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                activeSection === "subscriptions" ? "bg-foreground text-background font-semibold shadow-sm" : "text-default-600 hover:bg-default-100 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Radio className="size-4" />
                <span>Subscriptions</span>
              </div>
              <Chip size="sm" variant="soft" className="text-[10px] h-5 px-1.5 min-w-0">
                {subscriptions.length}
              </Chip>
            </div>

            <div
              onClick={() => setActiveSection("providers")}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                activeSection === "providers" ? "bg-foreground text-background font-semibold shadow-sm" : "text-default-600 hover:bg-default-100 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap className="size-4" />
                <span>Providers</span>
              </div>
              <Chip size="sm" variant="soft" className="text-[10px] h-5 px-1.5 min-w-0">
                {NOTIFICATION_PROVIDERS.length}
              </Chip>
            </div>

            <div
              onClick={() => setActiveSection("templates")}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                activeSection === "templates" ? "bg-foreground text-background font-semibold shadow-sm" : "text-default-600 hover:bg-default-100 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCode2 className="size-4" />
                <span>Templates</span>
              </div>
              <Chip size="sm" variant="soft" className="text-[10px] h-5 px-1.5 min-w-0">
                8
              </Chip>
            </div>

            <div
              onClick={() => setActiveSection("logs")}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                activeSection === "logs" ? "bg-foreground text-background font-semibold shadow-sm" : "text-default-600 hover:bg-default-100 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="size-4" />
                <span>Delivery Logs</span>
              </div>
              <Chip size="sm" variant="soft" className="text-[10px] h-5 px-1.5 min-w-0">
                {deliveryLogs.length}
              </Chip>
            </div>

            <div
              onClick={() => setActiveSection("settings")}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                activeSection === "settings" ? "bg-foreground text-background font-semibold shadow-sm" : "text-default-600 hover:bg-default-100 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <SettingsIcon className="size-4" />
                <span>Settings</span>
              </div>
            </div>
          </div>

          <div className="border-t border-divider/60 my-2" />

          {/* System Event Notice Box */}
          <div className="p-3 bg-default-50 border border-divider rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              <span>Event-Driven Dispatch</span>
            </div>
            <p className="text-[11px] text-default-500 leading-relaxed">
              Notifications only listen to system events. They never execute workflows, agents, or publish content.
            </p>
          </div>

        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 2. NOTIFICATION WORKSPACE MAIN CONTENT AREA                            */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        
        {/* 2ND HEADER BAR */}
        <div className="h-14 border-b border-divider px-6 flex items-center justify-between gap-4 bg-content1 shrink-0">
          
          {/* Left Title & Status Pills */}
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-foreground capitalize flex items-center gap-2">
              {activeSection === "subscriptions" && <Radio className="size-4 text-amber-500" />}
              {activeSection === "providers" && <Zap className="size-4 text-blue-500" />}
              {activeSection === "templates" && <FileCode2 className="size-4 text-purple-500" />}
              {activeSection === "logs" && <History className="size-4 text-emerald-500" />}
              {activeSection === "settings" && <SettingsIcon className="size-4 text-rose-500" />}
              <span>{activeSection === "logs" ? "Delivery Logs" : activeSection}</span>
            </h2>
            <Chip size="sm" variant="soft" color="default" className="text-[11px]">
              {activeSection === "subscriptions" && `${filteredSubscriptions.length} Subscriptions Active`}
              {activeSection === "providers" && `${NOTIFICATION_PROVIDERS.length} Providers Ready`}
              {activeSection === "templates" && `8 Custom Templates`}
              {activeSection === "logs" && `${deliveryLogs.length} Recent Dispatches`}
              {activeSection === "settings" && `Global Config`}
            </Chip>
          </div>

          {/* Right Action Controls (Search, Filter, View, Create Subscription) */}
          <div className="flex items-center gap-2">
            
            {/* Search Input */}
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-default-400" />
              <input
                type="text"
                placeholder={`Search ${activeSection}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-background text-foreground border border-divider rounded-xl focus:outline-none focus:border-foreground transition-all"
              />
            </div>

            {/* Status Filter Dropdown */}
            {activeSection === "subscriptions" && (
              <Popover>
                <Popover.Trigger>
                  <Button size="sm" variant="outline" className="text-xs gap-1.5">
                    <Filter className="size-3.5 text-default-500" />
                    <span className="capitalize">{statusFilter === "all" ? "All Status" : statusFilter}</span>
                  </Button>
                </Popover.Trigger>
                <Popover.Content placement="bottom end" className="w-36 p-1.5 bg-content1 border border-divider rounded-2xl shadow-xl space-y-1 text-xs">
                  {["all", "active", "disabled"].map((st) => (
                    <div
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl cursor-pointer capitalize flex items-center justify-between text-xs transition-colors ${
                        statusFilter === st ? "bg-foreground text-background font-semibold" : "hover:bg-default-100 text-default-700"
                      }`}
                    >
                      <span>{st}</span>
                      {statusFilter === st && <Check className="size-3.5" />}
                    </div>
                  ))}
                </Popover.Content>
              </Popover>
            )}

            {/* View Mode Toggle (Grid / Table) */}
            {activeSection === "subscriptions" && (
              <div className="flex items-center p-0.5 bg-default-100 border border-divider rounded-xl">
                <button
                  type="button"
                  onClick={() => setDisplayMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${displayMode === "grid" ? "bg-background text-foreground shadow-xs" : "text-default-400 hover:text-foreground"}`}
                  title="Grid View"
                >
                  <LayoutGrid className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode("table")}
                  className={`p-1.5 rounded-lg transition-colors ${displayMode === "table" ? "bg-background text-foreground shadow-xs" : "text-default-400 hover:text-foreground"}`}
                  title="Table View"
                >
                  <ListIcon className="size-3.5" />
                </button>
              </div>
            )}

            {/* Create Subscription Header Button */}
            <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-sm bg-foreground text-background" onPress={() => router.push("/admin/notifications/new")}>
              <Plus className="size-3.5" />
              <span>Create Subscription</span>
            </Button>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* WORKSPACE BODY SECTION                                                */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          
          {/* SECTION 1: SUBSCRIPTIONS */}
          {activeSection === "subscriptions" && (
            <div className="space-y-6">
              
              {/* Subscriptions Grid View */}
              {displayMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSubscriptions.length === 0 ? (
                    <div className="col-span-full py-16 text-center space-y-3 border border-dashed border-divider rounded-3xl bg-content1/40">
                      <Bell className="size-8 text-default-300 mx-auto" />
                      <p className="text-xs text-default-500">No subscriptions found matching query.</p>
                      <Button size="sm" variant="outline" onPress={() => router.push("/admin/notifications/new")}>Create Subscription</Button>
                    </div>
                  ) : (
                    filteredSubscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubscription(sub)}
                        className={`p-4 bg-content1 border rounded-2xl shadow-xs transition-all cursor-pointer hover:border-default-400 flex flex-col justify-between space-y-4 ${
                          selectedSubscription?.id === sub.id ? "border-foreground ring-2 ring-foreground/10" : "border-divider"
                        }`}
                      >
                        {/* Subscription Top Row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold text-foreground leading-tight hover:text-accent transition-colors">
                              {sub.name}
                            </h3>
                            <p className="text-[11px] text-default-500 line-clamp-2 leading-relaxed">
                              {sub.description}
                            </p>
                          </div>
                          <Chip
                            size="sm"
                            variant="soft"
                            color={sub.status === "Active" ? "success" : "default"}
                            className="text-[10px] shrink-0 font-semibold"
                          >
                            {sub.status}
                          </Chip>
                        </div>

                        {/* Events & Providers */}
                        <div className="space-y-2.5 text-xs">
                          
                          {/* Events List */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Events</span>
                            <div className="flex flex-wrap gap-1">
                              {sub.events.map((evt) => (
                                <span key={evt} className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-medium border border-amber-500/20">
                                  ⚡ {evt}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Providers List */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Providers</span>
                            <div className="flex flex-wrap gap-1">
                              {sub.providers.map((p) => (
                                <span key={p} className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-medium border border-blue-500/20">
                                  📡 {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-divider flex items-center justify-between text-xs">
                          <span className="text-[11px] text-default-400 font-medium">
                            {sub.totalDelivered.toLocaleString()} Delivered
                          </span>

                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-[11px] gap-1"
                              onPress={() => handleSendTestNotification(sub.name, sub.providers[0] || "Slack")}
                            >
                              <Play className="size-3 text-emerald-500" />
                              <span>Test</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px]"
                              onPress={() => setSelectedSubscription(sub)}
                            >
                              Details
                            </Button>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* Table View */
                <Table>
                  <TableContent aria-label="Subscriptions Table">
                    <TableHeader>
                      <TableColumn key="name">SUBSCRIPTION NAME</TableColumn>
                      <TableColumn key="events">EVENTS</TableColumn>
                      <TableColumn key="providers">PROVIDERS</TableColumn>
                      <TableColumn key="recipients">RECIPIENTS</TableColumn>
                      <TableColumn key="status">STATUS</TableColumn>
                      <TableColumn key="actions">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody items={filteredSubscriptions}>
                      {(item) => (
                        <TableRow key={item.id} className="cursor-pointer hover:bg-default-100/50" onClick={() => setSelectedSubscription(item)}>
                          <TableCell className="font-semibold text-xs text-foreground">{item.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.events.map((e) => (
                                <Chip key={e} size="sm" variant="soft" color="warning" className="text-[10px]">{e}</Chip>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.providers.map((p) => (
                                <Chip key={p} size="sm" variant="soft" color="accent" className="text-[10px]">{p}</Chip>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-default-500 truncate max-w-[200px]">{item.recipients}</TableCell>
                          <TableCell>
                            <Chip size="sm" variant="soft" color={item.status === "Active" ? "success" : "default"} className="text-[10px]">
                              {item.status}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onPress={(e) => {
                                handleSendTestNotification(item.name, item.providers[0] || "Slack")
                              }}
                              className="text-xs gap-1"
                            >
                              <Play className="size-3 text-emerald-500" />
                              <span>Test</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </TableContent>
                </Table>
              )}

            </div>
          )}

          {/* SECTION 2: PROVIDERS */}
          {activeSection === "providers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {NOTIFICATION_PROVIDERS.map((p) => {
                const IconComp = p.icon
                return (
                  <div key={p.id} className="p-4 bg-content1 border border-divider rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${p.color}`}>
                          <IconComp className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-foreground">{p.name}</h3>
                          <span className="text-[10px] text-emerald-500 font-medium">● Provider Connected</span>
                        </div>
                      </div>
                      <Chip size="sm" variant="soft" color="success" className="text-[10px]">Ready</Chip>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Default Endpoint / Channel</label>
                      <input
                        type="text"
                        readOnly
                        value={p.defaultRecipient}
                        className="w-full px-3 py-1.5 text-xs bg-background border border-divider rounded-xl text-default-600 focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 border-t border-divider flex items-center justify-between">
                      <span className="text-[11px] text-default-400">Status: Active</span>
                      <Button size="sm" variant="outline" className="text-xs" onPress={() => handleSendTestNotification(`Direct ${p.name} Test`, p.name)}>
                        Test Provider
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* SECTION 3: TEMPLATES */}
          {activeSection === "templates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { domain: "Workflow", title: "Workflow Completion Alert", vars: "{{workflow.id}}, {{workflow.status}}, {{workflow.duration}}" },
                { domain: "Agent", title: "Agent Execution Summary", vars: "{{agent.name}}, {{agent.task}}, {{agent.steps_count}}" },
                { domain: "Article", title: "Article Publication Digest", vars: "{{article.title}}, {{article.url}}, {{article.site}}" },
                { domain: "Website", title: "Website Build Incident Alert", vars: "{{website.name}}, {{website.error}}, {{website.build_time}}" },
                { domain: "Sources", title: "Source Sync Exception Notice", vars: "{{source.name}}, {{source.items_count}}, {{source.status}}" },
                { domain: "Files", title: "File Upload Notification", vars: "{{file.name}}, {{file.size}}, {{file.uploader}}" },
                { domain: "Integrations", title: "Integration Connection Failure", vars: "{{integration.provider}}, {{error.code}}, {{error.message}}" },
                { domain: "Custom", title: "Custom System Event Dispatch", vars: "{{event.name}}, {{event.payload_json}}" }
              ].map((t, idx) => (
                <div key={idx} className="p-4 bg-content1 border border-divider rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{t.domain} Template</span>
                    <Chip size="sm" variant="soft" color="default" className="text-[10px]">HTML & Markdown</Chip>
                  </div>
                  <h3 className="text-xs font-bold text-foreground">{t.title}</h3>
                  <div className="p-3 bg-background border border-divider rounded-xl text-xs space-y-1 text-default-600 font-mono">
                    <p className="text-[11px] font-semibold text-foreground">Header: [ALERT] {t.title}</p>
                    <p className="text-[11px] text-default-400">Vars: {t.vars}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 4: DELIVERY LOGS */}
          {activeSection === "logs" && (
            <div className="space-y-4">
              <Table>
                <TableContent aria-label="Notification Delivery Logs">
                  <TableHeader>
                    <TableColumn key="evt">EVENT</TableColumn>
                    <TableColumn key="sub">SUBSCRIPTION</TableColumn>
                    <TableColumn key="prv">PROVIDER</TableColumn>
                    <TableColumn key="rec">RECIPIENT</TableColumn>
                    <TableColumn key="st">STATUS</TableColumn>
                    <TableColumn key="dt">DELIVERED AT</TableColumn>
                    <TableColumn key="res">API RESPONSE</TableColumn>
                  </TableHeader>
                  <TableBody items={deliveryLogs}>
                    {(log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-semibold text-xs text-foreground">⚡ {log.event}</TableCell>
                        <TableCell className="text-xs text-default-600">{log.subscription}</TableCell>
                        <TableCell>
                          <Chip size="sm" variant="soft" color="accent" className="text-[10px]">
                            {log.provider}
                          </Chip>
                        </TableCell>
                        <TableCell className="text-xs text-default-500 font-mono">{log.recipient}</TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            variant="soft"
                            color={log.status === "Delivered" ? "success" : "danger"}
                            className="text-[10px]"
                          >
                            {log.status}
                          </Chip>
                        </TableCell>
                        <TableCell className="text-xs text-default-400">{log.deliveredAt}</TableCell>
                        <TableCell className="text-xs text-default-500 font-mono text-[11px]">{log.response}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </TableContent>
              </Table>
            </div>
          )}

          {/* SECTION 5: SETTINGS */}
          {activeSection === "settings" && (
            <div className="max-w-2xl space-y-6">
              <div className="p-5 bg-content1 border border-divider rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-foreground">Global Delivery Throttle</h3>
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                    <label className="font-semibold text-default-700">Max Dispatch Rate</label>
                    <input
                      type="text"
                      defaultValue="100 alerts / minute"
                      className="px-3 py-1.5 bg-background border border-divider rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                    <label className="font-semibold text-default-700">Retry Max Attempts</label>
                    <input
                      type="number"
                      defaultValue={3}
                      className="px-3 py-1.5 bg-background border border-divider rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-content1 border border-divider rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-foreground">Resend Email API Credentials</h3>
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                    <label className="font-semibold text-default-700">Resend API Key</label>
                    <input
                      type="password"
                      defaultValue="re_98324792837498273498"
                      className="px-3 py-1.5 bg-background border border-divider rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                    <label className="font-semibold text-default-700">Sender Address</label>
                    <input
                      type="text"
                      defaultValue="notifications@aipub.io"
                      className="px-3 py-1.5 bg-background border border-divider rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 3. SUBSCRIPTION DETAILS INSPECTOR DRAWER                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {selectedSubscription && (
        <aside className="w-96 bg-content1 border-l border-divider flex flex-col shrink-0 overflow-hidden shadow-2xl animate-in slide-in-from-right-4">
          
          {/* Drawer Header */}
          <div className="h-14 border-b border-divider px-4 flex items-center justify-between bg-content1">
            <h3 className="text-xs font-bold text-foreground truncate pr-2">{selectedSubscription.name}</h3>
            <button
              type="button"
              onClick={() => setSelectedSubscription(null)}
              className="p-1 rounded-lg text-default-400 hover:text-foreground hover:bg-default-100 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs scrollbar-thin">
            
            {/* Description */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Description</span>
              <p className="text-xs text-default-600 leading-relaxed">{selectedSubscription.description}</p>
            </div>

            {/* Status & Quick Test */}
            <div className="p-3 bg-default-50 border border-divider rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Subscription Status</span>
                <p className="text-xs font-semibold text-foreground">{selectedSubscription.status}</p>
              </div>
              <Button
                size="sm"
                className="gap-1 text-xs bg-foreground text-background"
                onPress={() => handleSendTestNotification(selectedSubscription.name, selectedSubscription.providers[0] || "Slack")}
              >
                <Play className="size-3" />
                <span>Send Test</span>
              </Button>
            </div>

            {/* Events */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider">System Events</label>
              <div className="space-y-1.5">
                {selectedSubscription.events.map((e: string) => (
                  <div key={e} className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
                    <Zap className="size-3.5" />
                    <span>{e}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Providers */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Providers</label>
              <div className="space-y-1.5">
                {selectedSubscription.providers.map((p: string) => (
                  <div key={p} className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2">
                    <Send className="size-3.5" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Recipients & Endpoints</label>
              <div className="p-3 bg-background border border-divider rounded-xl font-mono text-[11px] text-default-700 break-all">
                {selectedSubscription.recipients}
              </div>
            </div>

            {/* Template */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Message Template</label>
              <div className="p-3 bg-background border border-divider rounded-xl font-medium text-foreground">
                {selectedSubscription.template}
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Trigger Conditions</label>
              <div className="p-3 bg-background border border-divider rounded-xl font-mono text-[11px] text-default-500">
                {selectedSubscription.conditions}
              </div>
            </div>

          </div>
        </aside>
      )}

    </div>
  )
}
