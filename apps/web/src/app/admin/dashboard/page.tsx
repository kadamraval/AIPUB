"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Chip,
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react"
import {
  LayoutDashboard, Globe, FileText, GitBranch, Zap, Activity, Clock, CheckCircle2,
  XCircle, AlertTriangle, Play, Plus, ArrowUpRight, HardDrive, DollarSign,
  TrendingUp, BarChart3, Bot, Database, ShieldCheck, CheckSquare, RefreshCw, Sparkles
} from "lucide-react"
import { fetchWebsites, fetchArticles, fetchAnalyticsSummary, triggerAgentWorkflow } from "@/lib/api"

import { DataCard } from "@/components/shared/data-card"
import { PageHeader, AppCard, AppButton, AppChip } from "@/components/shared/ui-system"

const defaultDemoArticles = [
  { id: "art-1", title: "Quantum Computing Breakthroughs in 2026", website_name: "TechPulse Daily", status: "published" },
  { id: "art-2", title: "Top 10 Autonomous AI Agents for Enterprise", website_name: "SaaS Journal", status: "published" },
  { id: "art-3", title: "FLUX.1 vs Midjourney v6 Comparison", website_name: "AI Trends Hub", status: "draft" },
  { id: "art-4", title: "Next.js 15 Server Components Deep Dive", website_name: "Dev Stack News", status: "published" }
]

const defaultDemoWebsites = [
  { id: "site-1", name: "TechPulse Daily", cms_type: "WordPress" },
  { id: "site-2", name: "SaaS Journal", cms_type: "Shopify Store Blog" },
  { id: "site-3", name: "AI Trends Hub", cms_type: "Webflow" }
]

const demoPendingApprovals = [
  { id: "p-1", title: "Building Micro-SaaS with Next.js & Supabase", agent: "SEO Copywriter Agent" },
  { id: "p-2", title: "The Future of Generative Video in 2026", agent: "Research Intelligence Agent" },
  { id: "p-3", title: "Optimizing Postgres Vector Queries for RAG", agent: "Technical Reviewer Agent" }
]

const demoRecentActivity = [
  { id: "act-1", event: "Article Published", target: "TechPulse Daily", time: "2m ago" },
  { id: "act-2", event: "Workflow Started", target: "Autonomous Newsroom", time: "8m ago" },
  { id: "act-3", event: "Keyword Clustered", target: "SEO Generator", time: "15m ago" },
  { id: "act-4", event: "Image Generated", target: "fal.ai FLUX.1 Engine", time: "22m ago" }
]

const demoRunningWorkflows = [
  { id: "wf-1", name: "Autonomous Newsroom Blueprint", step: "Step 3: Copywriter Agent", progress: "60%" },
  { id: "wf-2", name: "SEO Cluster Pipeline", step: "Step 2: Keyword Expansion", progress: "40%" },
  { id: "wf-3", name: "Tech Content Pipeline", step: "Step 4: Image Generation", progress: "80%" }
]

const demoScheduledJobs = [
  { id: "job-1", name: "RSS Newsfeed Intake", freq: "Every 6 Hours", next: "In 14 mins" },
  { id: "job-2", name: "SEO Keyword Rank Check", freq: "Daily at 00:00", next: "In 7 hours" },
  { id: "job-3", name: "Newsletter Digest Batch", freq: "Weekly (Mon)", next: "In 3 days" }
]

const demoRecentErrors = [
  { id: "err-1", message: "No critical errors reported in the last 24 hours.", component: "System", status: "Healthy" }
]

const demoTopWorkflows = [
  { id: "twf-1", name: "Autonomous Newsroom Blueprint", executions: "420 runs", rate: "100%" },
  { id: "twf-2", name: "SEO Cluster Pipeline", executions: "310 runs", rate: "99.2%" },
  { id: "twf-3", name: "Tech Content Pipeline", executions: "280 runs", rate: "98.9%" }
]

export default function DashboardPage() {
  const [websites, setWebsites] = useState<any[]>(defaultDemoWebsites)
  const [articles, setArticles] = useState<any[]>(defaultDemoArticles)
  const [summary, setSummary] = useState<any>(null)
  const [triggering, setTriggering] = useState(false)
  const [triggerMsg, setTriggerMsg] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      const [sitesData, articlesData, summaryData] = await Promise.all([
        fetchWebsites(),
        fetchArticles(),
        fetchAnalyticsSummary()
      ])
      if (sitesData && sitesData.length > 0) setWebsites(sitesData)
      if (articlesData && articlesData.length > 0) setArticles(articlesData)
      if (summaryData) setSummary(summaryData)
    }
    loadDashboardData()
  }, [])

  const handleRunWorkflow = async () => {
    if (websites.length === 0) return
    setTriggering(true)
    setTriggerMsg("Triggering autonomous workflow pipeline...")
    const firstSite = websites[0]
    const res = await triggerAgentWorkflow(firstSite.id, "Autonomous AI Publishing Execution")
    if (res) {
      setTriggerMsg(`Workflow started for ${firstSite.name}! Status: ${res.status || 'running'}`)
      const updatedArticles = await fetchArticles()
      if (updatedArticles) setArticles(updatedArticles)
    }
    setTriggering(false)
    setTimeout(() => setTriggerMsg(null), 5000)
  }

  const handleQuickAction = (action: string) => {
    if (action === "Run Workflow") {
      handleRunWorkflow()
    } else {
      window.dispatchEvent(new CustomEvent("open-admin-modal"))
    }
  }

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of active properties, publication queue & AI metrics"
        icon={LayoutDashboard}
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/websites">
              <AppButton variant="outline" icon={Plus}>Add Website</AppButton>
            </Link>
            <Link href="/admin/custom-agents/new">
              <AppButton variant="outline" icon={Plus}>Add Agent</AppButton>
            </Link>
            <Link href="/admin/workflows">
              <AppButton variant="outline" icon={Plus}>New Workflow</AppButton>
            </Link>
            <AppButton variant="primary" onPress={() => handleQuickAction("Run Workflow")} isDisabled={triggering}>
              {triggering ? "Executing..." : "Run Workflow"}
            </AppButton>
          </div>
        }
      />

      {/* Top Banner / Trigger Message */}
      {triggerMsg && (
        <div className="p-3 bg-success-50 border border-success-200 text-success-700 text-xs rounded-large flex items-center gap-2">
          <Sparkles className="size-4" />
          <span>{triggerMsg}</span>
        </div>
      )}

      {/* ── 1. QUICK ACTIONS SECTION ──────────────────────────────────────────────── */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              <Zap className="size-4 text-default-400" /> Quick Actions
            </div>
            <p className="text-sm text-default-400 mt-0.5">One-click workflow & publishing triggers</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/websites">
              <Button size="sm" variant="outline"><Plus className="size-4"  /> Add Website</Button>
            </Link>
            <Link href="/admin/custom-agents/new">
              <Button size="sm" variant="outline"><Plus className="size-4"  /> Add Agent</Button>
            </Link>
            <Link href="/admin/workflows">
              <Button size="sm" variant="outline"><Plus className="size-4"  /> New Workflow</Button>
            </Link>
            <Button size="sm" onPress={() => handleQuickAction("Run Workflow")} isDisabled={triggering} >
              {triggering ? "Executing..." : "Run Workflow"}
            </Button>
            <Link href="/admin/articles">
              <Button size="sm" variant="secondary"><FileText className="size-4"  /> Publish Draft</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. METRICS GRID ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <DataCard title="Connected Websites" value={websites.length || 4} caption="100% online" icon={Globe} pulseDot />
        <DataCard title="Published Today" value="18" caption="+24% vs yesterday" icon={FileText} />
        <DataCard title="Running Workflows" value="3" caption="Active in canvas" icon={GitBranch} />
        <DataCard title="Running Executions" value="2" caption="2 node tasks processing" icon={Activity} />
        <DataCard title="Failed Executions" value="0" caption="0 errors in 24h" icon={XCircle} />
        <DataCard title="Success Rate" value="99.4%" caption="Top tier reliability" icon={CheckCircle2} />
        <DataCard title="Active Agents" value="13" caption="Custom Studio agents" icon={Bot} />
        <DataCard title="Average Runtime" value="4.2s" caption="-0.4s optimization" icon={Clock} />
        <DataCard title="Today's Cost" value="$1.42" caption="Avg $0.041/article" icon={DollarSign} />
        <DataCard title="Storage Used" value="14.2 GB" caption="Cloudflare R2 Bucket" icon={HardDrive} />
      </div>

      {/* ── 3. CHARTS GRID ──────────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-medium text-default-400 uppercase tracking-wider mb-3">Analytics & Trend Metrics</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chart 1: Articles / Day */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Articles / Day</span>
                <Chip variant="soft" color="accent" size="sm">7 Days</Chip>
              </div>
              <div className="h-28 flex items-end gap-2 pt-2 pb-1 px-1">
                {[12, 16, 14, 22, 19, 25, 18].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all" style={{ height: `${(v / 28) * 100}%` }} title={`${v} articles`} />
                    <span className="text-xs text-default-400">{["M","T","W","T","F","S","S"][i]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: Workflow Success */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Workflow Success</span>
                <Chip variant="soft" color="success" size="sm">99.4%</Chip>
              </div>
              <div className="h-28 flex flex-col justify-center space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-default-400">Successful Executions</span>
                    <span className="font-medium">1,420</span>
                  </div>
                  <div className="h-2 w-full bg-default-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[99.4%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-default-400">Failed / Retried</span>
                    <span className="font-medium text-danger">8</span>
                  </div>
                  <div className="h-2 w-full bg-default-100 rounded-full overflow-hidden">
                    <div className="h-full bg-danger w-[0.6%]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart 3: Execution Trend */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Execution Trend</span>
                <Chip variant="soft" color="accent" size="sm">Velocity</Chip>
              </div>
              <div className="h-28 flex items-end gap-1.5 pt-2 pb-1 px-1">
                {[45, 60, 52, 80, 74, 95, 110].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all" style={{ height: `${(v / 120) * 100}%` }} title={`${v} executions`} />
                    <span className="text-xs text-default-400">d{i+1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart 4: Publishing Trend */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Publishing Trend</span>
                <Chip variant="soft" color="accent" size="sm">Live Sync</Chip>
              </div>
              <div className="h-28 flex items-end gap-1.5 pt-2 pb-1 px-1">
                {[30, 42, 38, 55, 60, 72, 68].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all" style={{ height: `${(v / 80) * 100}%` }} title={`${v} posts`} />
                    <span className="text-xs text-default-400">d{i+1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart 5: Traffic Trend */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Traffic Trend</span>
                <Chip variant="soft" color="success" size="sm">+34% YoY</Chip>
              </div>
              <div className="h-28 flex items-end gap-1.5 pt-2 pb-1 px-1">
                {[120, 140, 135, 180, 210, 260, 310].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all" style={{ height: `${(v / 350) * 100}%` }} title={`${v}k visits`} />
                    <span className="text-xs text-default-400">w{i+1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart 6: Cost Trend */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Cost Trend</span>
                <Chip variant="soft" color="accent" size="sm">$0.041 avg</Chip>
              </div>
              <div className="h-28 flex items-end gap-1.5 pt-2 pb-1 px-1">
                {[1.2, 1.5, 1.1, 1.8, 1.4, 1.9, 1.42].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all" style={{ height: `${(v / 2.5) * 100}%` }} title={`$${v}`} />
                    <span className="text-xs text-default-400">d{i+1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── 4. TABLES GRID ──────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-default-400 uppercase tracking-wider">Activity, Queue & System Tables</p>

        {/* Row 1: Recent Activity & Recent Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-3 px-4 border-b border-divider flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2"><Activity className="size-3.5 text-sky-500" /> Recent Activity</span>
              <Chip variant="soft" color="accent" size="sm">Live Feed</Chip>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <Table><TableContent aria-label="Recent activity">
                <TableHeader>
                  <TableColumn key="event" isRowHeader>Event</TableColumn>
                  <TableColumn key="target">Target</TableColumn>
                  <TableColumn key="time">Time</TableColumn>
                </TableHeader>
                <TableBody items={demoRecentActivity}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.event}</TableCell>
                      <TableCell className="text-default-400">{item.target}</TableCell>
                      <TableCell>{item.time}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableContent></Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3 px-4 border-b border-divider flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2"><FileText className="size-3.5 text-success-500" /> Recent Articles</span>
              <Link href="/admin/articles" className="text-xs text-default-400 hover:text-foreground transition-colors">View All</Link>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <Table><TableContent aria-label="Recent articles">
                <TableHeader>
                  <TableColumn key="title" isRowHeader>Title</TableColumn>
                  <TableColumn key="website">Website</TableColumn>
                  <TableColumn key="status">Status</TableColumn>
                </TableHeader>
                <TableBody items={articles.slice(0, 4)}>
                  {(art: any) => (
                    <TableRow key={art.id}>
                      <TableCell className="font-medium truncate max-w-[200px]">{art.title}</TableCell>
                      <TableCell className="text-default-400">{art.website_name || "TechPulse Daily"}</TableCell>
                      <TableCell>
                        <Chip size="sm" variant="soft" color="success">
                          {art.status || "published"}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableContent></Table>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Running Workflows & Scheduled Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-3 px-4 border-b border-divider flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2"><GitBranch className="size-3.5 text-violet-500" /> Running Workflows</span>
              <Chip variant="soft" color="accent" size="sm">3 Active</Chip>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <Table><TableContent aria-label="Running workflows">
                <TableHeader>
                  <TableColumn key="workflow" isRowHeader>Workflow Blueprint</TableColumn>
                  <TableColumn key="step">Current Step</TableColumn>
                  <TableColumn key="progress">Progress</TableColumn>
                </TableHeader>
                <TableBody items={demoRunningWorkflows}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-default-400">{item.step}</TableCell>
                      <TableCell><Chip variant="soft" color="accent" size="sm">{item.progress}</Chip></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableContent></Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3 px-4 border-b border-divider flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2"><Clock className="size-3.5 text-indigo-500" /> Scheduled Jobs</span>
              <Chip variant="soft" color="accent" size="sm">Cron Schedule</Chip>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <Table><TableContent aria-label="Scheduled jobs">
                <TableHeader>
                  <TableColumn key="job" isRowHeader>Job Name</TableColumn>
                  <TableColumn key="freq">Frequency</TableColumn>
                  <TableColumn key="next">Next Run</TableColumn>
                </TableHeader>
                <TableBody items={demoScheduledJobs}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-default-400">{item.freq}</TableCell>
                      <TableCell>{item.next}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableContent></Table>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Pending Approval & Recent Errors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-3 px-4 border-b border-divider flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2"><CheckSquare className="size-3.5 text-warning-500" /> Pending Approval</span>
              <Chip variant="soft" color="warning" size="sm">5 Items</Chip>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <Table><TableContent aria-label="Pending approval">
                <TableHeader>
                  <TableColumn key="draft" isRowHeader>Article Draft</TableColumn>
                  <TableColumn key="author">Author Agent</TableColumn>
                  <TableColumn key="action">Action</TableColumn>
                </TableHeader>
                <TableBody items={demoPendingApprovals}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="text-default-400">{item.agent}</TableCell>
                      <TableCell><Button size="sm" variant="ghost">Review</Button></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableContent></Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3 px-4 border-b border-divider flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2"><AlertTriangle className="size-3.5 text-danger-500" /> Recent Errors</span>
              <Chip variant="soft" color="success" size="sm">0 Active</Chip>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <Table><TableContent aria-label="Recent errors">
                <TableHeader>
                  <TableColumn key="err" isRowHeader>Error Message</TableColumn>
                  <TableColumn key="comp">Component</TableColumn>
                  <TableColumn key="stat">Status</TableColumn>
                </TableHeader>
                <TableBody items={demoRecentErrors}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-default-400 italic">{item.message}</TableCell>
                      <TableCell className="text-default-400 font-mono text-xs">{item.component}</TableCell>
                      <TableCell><Chip variant="soft" color="success" size="sm">{item.status}</Chip></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableContent></Table>
            </CardContent>
          </Card>
        </div>

        {/* Row 4: Top Websites & Top Workflows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-3 px-4 border-b border-divider flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2"><Globe className="size-3.5 text-blue-500" /> Top Websites</span>
              <Link href="/admin/websites" className="text-xs text-default-400 hover:text-foreground transition-colors">Manage</Link>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <Table><TableContent aria-label="Top websites">
                <TableHeader>
                  <TableColumn key="site" isRowHeader>Website</TableColumn>
                  <TableColumn key="cms">CMS</TableColumn>
                  <TableColumn key="posts">Posts Today</TableColumn>
                </TableHeader>
                <TableBody items={websites}>
                  {(site: any) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">{site.name}</TableCell>
                      <TableCell><Chip variant="soft" color="accent" size="sm" className="font-mono">{site.cms_type || "WordPress"}</Chip></TableCell>
                      <TableCell className="font-mono text-success-600 font-medium">4 posts</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableContent></Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3 px-4 border-b border-divider flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2"><GitBranch className="size-3.5 text-violet-500" /> Top Workflows</span>
              <Link href="/admin/workflows" className="text-xs text-default-400 hover:text-foreground transition-colors">View Canvas</Link>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <Table><TableContent aria-label="Top workflows">
                <TableHeader>
                  <TableColumn key="wf" isRowHeader>Workflow Blueprint</TableColumn>
                  <TableColumn key="exec">Executions</TableColumn>
                  <TableColumn key="rate">Success Rate</TableColumn>
                </TableHeader>
                <TableBody items={demoTopWorkflows}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="font-mono text-default-400">{item.executions}</TableCell>
                      <TableCell className="font-mono text-success-600 font-medium">{item.rate}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableContent></Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
