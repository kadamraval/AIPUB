"use client"

import React, { useEffect, useState } from "react"
import { DataCard } from "@/components/shared/data-card"

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Chip,
  Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@heroui/react"
import {
  Globe, Users, Eye, MousePointer, Search, FileText, GitBranch,
  Bot, Shield, DollarSign, Cpu, FileSpreadsheet, Activity, TrendingUp,
  Clock, CheckCircle2, AlertTriangle, ArrowUpRight, Filter, Calendar, Download, RefreshCw, Layers
} from "lucide-react"
import { fetchWebsites } from "@/lib/api"

const DEMO_WEBSITES = [
  { id: "all", name: "All Websites", domain: "all-properties" },
  { id: "site-1", name: "AI News", domain: "ainews.io" },
  { id: "site-2", name: "Tech Blog", domain: "techblog.com" },
  { id: "site-3", name: "Finance Blog", domain: "financeblog.net" },
  { id: "site-4", name: "Travel Blog", domain: "travelblog.org" }
]

const NAV_TABS = [
  "Overview", "Traffic", "Search", "Content", "Workflows",
  "Agents", "SEO", "Revenue", "AI Usage", "Reports", "Logs"
]

export default function AnalyticsPage() {
  const [websites, setWebsites] = useState<any[]>(DEMO_WEBSITES)
  const [selectedSiteId, setSelectedSiteId] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("Overview")
  const [dateRange, setDateRange] = useState<string>("30d")

  useEffect(() => {
    async function loadWebsites() {
      const data = await fetchWebsites()
      if (data && data.length > 0) {
        const formatted = [
          { id: "all", name: "All Websites", domain: "all-properties" },
          ...data.map((w: any) => ({
            id: w.id,
            name: w.name,
            domain: w.domain || `${w.name.toLowerCase().replace(/\s+/g, '')}.com`
          }))
        ]
        setWebsites(formatted)
      }
    }
    loadWebsites()

    const handleSiteChange = (e: CustomEvent) => {
      if (e.detail?.siteId) setSelectedSiteId(e.detail.siteId)
    }
    const handleDateChange = (e: CustomEvent) => {
      if (e.detail?.dateRange) setDateRange(e.detail.dateRange)
    }

    window.addEventListener("analytics-site-change", handleSiteChange as EventListener)
    window.addEventListener("analytics-date-change", handleDateChange as EventListener)

    return () => {
      window.removeEventListener("analytics-site-change", handleSiteChange as EventListener)
      window.removeEventListener("analytics-date-change", handleDateChange as EventListener)
    }
  }, [])

  const currentSite = websites.find(w => w.id === selectedSiteId) || websites[0]

  const siteMultiplier = selectedSiteId === "all" ? 1 : selectedSiteId === "site-1" ? 0.45 : selectedSiteId === "site-2" ? 0.3 : 0.15

  const usersCount = Math.round(142500 * siteMultiplier).toLocaleString()
  const sessionsCount = Math.round(198200 * siteMultiplier).toLocaleString()
  const pageViewsCount = Math.round(412000 * siteMultiplier).toLocaleString()
  const publishedCount = Math.round(348 * siteMultiplier)
  const clicksCount = Math.round(84200 * siteMultiplier).toLocaleString()
  const impressionsCount = Math.round(1850000 * siteMultiplier).toLocaleString()
  const ctrValue = (4.55 + (selectedSiteId === "site-1" ? 0.3 : -0.2)).toFixed(2) + "%"
  const avgPosition = (3.2 + (selectedSiteId === "site-2" ? -0.5 : 0.2)).toFixed(1)
  const revenueVal = "$" + (1840.50 * siteMultiplier).toFixed(2)
  const workflowSuccessRate = "99.4%"
  const aiCostVal = "$" + (18.45 * siteMultiplier).toFixed(2)

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-divider">
        {NAV_TABS.map((tab) => (
          <Button
            key={tab}
            size="sm"
            variant={activeTab === tab ? "primary" : "ghost"}
            onPress={() => setActiveTab(tab)}
            className="text-xs font-medium"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <DataCard title="Unique Visitors" value={usersCount} caption="+14.2% vs prev" icon={Users} />
            <DataCard title="Sessions" value={sessionsCount} caption="+18.5% vs prev" icon={Globe} />
            <DataCard title="Page Views" value={pageViewsCount} caption="+22.1% vs prev" icon={Eye} />
            <DataCard title="Published" value={publishedCount} caption="+8 articles" icon={FileText} />
            <DataCard title="Clicks" value={clicksCount} caption="+12.4% GSC" icon={MousePointer} />
            <DataCard title="Impressions" value={impressionsCount} caption="+31.0% GSC" icon={Search} />
            <DataCard title="CTR" value={ctrValue} caption="+0.4% vs avg" icon={TrendingUp} />
            <DataCard title="Avg Position" value={`#${avgPosition}`} caption="Top 5 SERP" icon={ArrowUpRight} />
            <DataCard title="Revenue" value={revenueVal} caption="+19.8% MoM" icon={DollarSign} />
            <DataCard title="Workflow Success" value={workflowSuccessRate} caption="Reliable" icon={CheckCircle2} />
            <DataCard title="AI Cost" value={aiCostVal} caption="$0.041/post" icon={Cpu} />
          </div>

          <div>
            <p className="text-xs font-medium text-default-400 uppercase tracking-wider mb-3">
              {currentSite.name} Overview Trends
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold flex items-center gap-1.5"><Users className="size-3.5 text-default-400" /> Traffic Trend</div>
                    <Chip variant="soft" color="accent" size="sm">Sessions</Chip>
                  </div>
                  <div className="h-28 flex items-end gap-1.5 pt-2 pb-1 px-1">
                    {[28, 35, 42, 39, 58, 64, 72].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all" style={{ height: `${(v / 80) * 100}%` }} />
                        <span className="text-xs text-default-400">d{i+1}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold flex items-center gap-1.5"><Search className="size-3.5 text-default-400" /> Search Performance</div>
                    <Chip variant="soft" color="accent" size="sm">Impressions</Chip>
                  </div>
                  <div className="h-28 flex items-end gap-1.5 pt-2 pb-1 px-1">
                    {[120, 145, 130, 180, 210, 240, 290].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all" style={{ height: `${(v / 300) * 100}%` }} />
                        <span className="text-xs text-default-400">d{i+1}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold flex items-center gap-1.5"><FileText className="size-3.5 text-default-400" /> Publishing Trend</div>
                    <Chip variant="soft" color="accent" size="sm">Posts/Day</Chip>
                  </div>
                  <div className="h-28 flex items-end gap-1.5 pt-2 pb-1 px-1">
                    {[8, 12, 10, 15, 14, 18, 16].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all" style={{ height: `${(v / 20) * 100}%` }} />
                        <span className="text-xs text-default-400">d{i+1}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TRAFFIC TAB */}
      {activeTab === "Traffic" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <DataCard title="Users" value={usersCount} icon={Users} />
            <DataCard title="Sessions" value={sessionsCount} icon={Globe} />
            <DataCard title="Page Views" value={pageViewsCount} icon={Eye} />
            <DataCard title="Top Pages" value="142 pages" icon={FileText} />
            <DataCard title="Sources" value="18 sources" icon={Layers} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3 px-4 border-b border-divider font-semibold text-sm">Top Pages ({currentSite.name})</CardHeader>
              <CardContent className="p-0 overflow-hidden">
                <Table><TableContent aria-label="Top pages">
                  <TableHeader><TableColumn>Path</TableColumn><TableColumn>Views</TableColumn><TableColumn>Unique</TableColumn></TableHeader>
                  <TableBody>
                    <TableRow key="1"><TableCell className="font-mono text-xs">/blog/ai-agents-guide-2026</TableCell><TableCell className="font-mono">42,100</TableCell><TableCell className="font-mono">31,500</TableCell></TableRow>
                    <TableRow key="2"><TableCell className="font-mono text-xs">/reviews/fal-ai-flux-models</TableCell><TableCell className="font-mono">28,400</TableCell><TableCell className="font-mono">22,100</TableCell></TableRow>
                  </TableBody>
                </TableContent></Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 border-b border-divider font-semibold text-sm">Traffic Sources</CardHeader>
              <CardContent className="p-0 overflow-hidden">
                <Table><TableContent aria-label="Traffic sources">
                  <TableHeader><TableColumn>Source</TableColumn><TableColumn>Share</TableColumn><TableColumn>Sessions</TableColumn></TableHeader>
                  <TableBody>
                    <TableRow key="1"><TableCell className="font-medium">Organic Search (Google)</TableCell><TableCell className="font-mono text-success-600 font-medium">64.5%</TableCell><TableCell className="font-mono">127,800</TableCell></TableRow>
                    <TableRow key="2"><TableCell className="font-medium">Direct Traffic</TableCell><TableCell className="font-mono text-blue-600">22.1%</TableCell><TableCell className="font-mono">43,800</TableCell></TableRow>
                  </TableBody>
                </TableContent></Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* SEARCH TAB */}
      {activeTab === "Search" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <DataCard title="Impressions" value={impressionsCount} icon={Search} />
            <DataCard title="Clicks" value={clicksCount} icon={MousePointer} />
            <DataCard title="CTR" value={ctrValue} icon={TrendingUp} />
            <DataCard title="Avg Position" value={`#${avgPosition}`} icon={ArrowUpRight} />
            <DataCard title="Keywords" value="1,420" icon={FileSpreadsheet} />
          </div>

          <Card>
            <CardHeader className="py-3 px-4 border-b border-divider font-semibold text-sm">Keywords Performance</CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <Table><TableContent aria-label="Keywords performance">
                <TableHeader><TableColumn>Query Keyword</TableColumn><TableColumn>Impressions</TableColumn><TableColumn>Clicks</TableColumn><TableColumn>CTR</TableColumn><TableColumn>Position</TableColumn></TableHeader>
                <TableBody>
                  <TableRow key="1"><TableCell className="font-medium">autonomous publishing OS</TableCell><TableCell className="font-mono">420,000</TableCell><TableCell className="font-mono">28,500</TableCell><TableCell className="font-mono text-success-600 font-medium">6.8%</TableCell><TableCell className="font-mono text-success-600 font-medium">#1</TableCell></TableRow>
                  <TableRow key="2"><TableCell className="font-medium">ai blog generator workflow</TableCell><TableCell className="font-mono">310,000</TableCell><TableCell className="font-mono">16,700</TableCell><TableCell className="font-mono text-success-600 font-medium">5.4%</TableCell><TableCell className="font-mono text-success-600 font-medium">#2</TableCell></TableRow>
                </TableBody>
              </TableContent></Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CONTENT TAB */}
      {activeTab === "Content" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <Card><CardContent className="p-3"><div className="text-xs text-default-400 font-medium">Articles</div><div className="text-xl font-bold font-mono mt-1 text-foreground">{publishedCount + 14}</div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-xs text-default-400 font-medium">Published</div><div className="text-xl font-bold font-mono mt-1 text-foreground">{publishedCount}</div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-xs text-default-400 font-medium">Drafts</div><div className="text-xl font-bold font-mono mt-1 text-foreground">14</div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-xs text-default-400 font-medium">Top Articles</div><div className="text-xl font-bold font-mono mt-1 text-foreground">24</div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-xs text-default-400 font-medium">Refresh Queue</div><div className="text-xl font-bold font-mono mt-1 text-foreground">6</div></CardContent></Card>
        </div>
      )}

      {/* OTHER TABS FALLBACK */}
      {!["Overview", "Traffic", "Search", "Content"].includes(activeTab) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <Card><CardContent className="p-3"><div className="text-xs text-default-400 font-medium">{activeTab} Metrics</div><div className="text-xl font-bold font-mono mt-1 text-foreground">1,420</div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-xs text-default-400 font-medium">Success Rate</div><div className="text-xl font-bold font-mono mt-1 text-success-500">99.4%</div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-xs text-default-400 font-medium">Status</div><div className="text-xl font-bold font-mono mt-1 text-success-500">Active</div></CardContent></Card>
        </div>
      )}
    </div>
  )
}
