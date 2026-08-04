"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, Button, Chip } from "@heroui/react"
import { ArrowLeft, Globe, FileText, Eye, TrendingUp, ExternalLink, GitBranch, ShieldCheck } from "lucide-react"
import { fetchWebsiteById } from "@/lib/api"

export default function WebsiteDetailPage() {
  const params = useParams()
  const siteId = params?.id as string
  const [site, setSite] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (siteId) {
        const data = await fetchWebsiteById(siteId)
        if (data) setSite(data)
      }
      setLoading(false)
    }
    loadData()
  }, [siteId])

  if (loading) {
    return <div className="p-6 text-xs text-default-400">Loading website analytics...</div>
  }

  if (!site) {
    return (
      <div className="p-6 space-y-4">
        <Link href="/admin/websites" className="text-xs text-default-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Back to Websites
        </Link>
        <div className="text-sm font-semibold text-foreground">Website property not found.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-divider pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/websites">
            <Button variant="outline" size="sm" isIconOnly>
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <img src={site.logo_url} alt={site.name} className="h-10 w-10 rounded-medium border border-divider object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">{site.name}</h1>
              <Chip variant="soft" color={site.status === "active" ? "success" : "default"} size="sm">
                {site.status === "active" ? "Active" : "Stopped"}
              </Chip>
            </div>
            <a href={`https://${site.domain}`} target="_blank" rel="noreferrer" className="text-xs text-default-400 hover:underline flex items-center gap-1 mt-0.5">
              {site.domain} <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Chip variant="soft" color="accent" size="sm">
            Workflow: <strong className="text-foreground">{site.workflow_name}</strong>
          </Chip>
          <Chip variant="soft" color="accent" size="sm">
            CMS: <strong className="text-foreground">{site.cms_type}</strong>
          </Chip>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="space-y-1">
            <div className="text-xs text-default-400">Total Published Posts</div>
            <div className="text-xl font-bold font-mono">{site.total_posts}</div>
            <div className="text-xs text-default-400 flex items-center gap-1 pt-1">
              <FileText className="size-3.5 text-success-500" /> +12 posts published this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1">
            <div className="text-xs text-default-400">Monthly Unique Visitors</div>
            <div className="text-xl font-bold font-mono">{site.total_visitors}</div>
            <div className="text-xs text-default-400 flex items-center gap-1 pt-1">
              <Eye className="size-3.5 text-success-500" /> +14.2% organic search growth
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1">
            <div className="text-xs text-default-400">Total Monthly Pageviews</div>
            <div className="text-xl font-bold font-mono">{site.monthly_pageviews}</div>
            <div className="text-xs text-default-400 flex items-center gap-1 pt-1">
              <Globe className="size-3.5 text-success-500" /> 2.8 pages per session
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1">
            <div className="text-xs text-default-400">Average Search CTR</div>
            <div className="text-xl font-bold font-mono">{site.avg_ctr}</div>
            <div className="text-xs text-default-400 flex items-center gap-1 pt-1">
              <TrendingUp className="size-3.5 text-success-500" /> Top 3 position on 42 keywords
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Breakdown & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col items-start pb-2">
            <h2 className="text-sm font-semibold">Organic Traffic & Keyword Ranking Performance</h2>
            <p className="text-xs text-default-400">30-day traffic growth breakdown generated by autonomous workflow</p>
          </CardHeader>
          <CardContent className="space-y-4 text-xs pt-0">
            <div className="h-48 bg-default-50 border border-divider rounded-medium p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-default-400 text-xs">
                <span>Organic Search (Google & Bing)</span>
                <span className="font-bold text-foreground">84.2% of Total Traffic</span>
              </div>
              <div className="flex items-end gap-2 h-32 pt-4">
                {[40, 55, 62, 70, 68, 82, 90, 110, 125, 142].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-foreground/20 hover:bg-foreground/40 rounded-t transition-all" style={{ height: `${val}%` }} title={`Day ${idx + 1}: ${val * 100} visits`} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-content1 border border-divider rounded-medium space-y-1">
                <span className="text-default-400 text-xs">Top Ranking Keywords</span>
                <div className="font-bold text-foreground">"autonomous ai publishing platform" (#1)</div>
                <div className="text-xs text-default-400">"fal.ai image generation workflow" (#2)</div>
              </div>
              <div className="p-3 bg-content1 border border-divider rounded-medium space-y-1">
                <span className="text-default-400 text-xs">Assigned Workflow Status</span>
                <div className="font-bold text-success-500 flex items-center gap-1">
                  <span className="size-2 rounded-full bg-success-500 animate-pulse" /> Running ({site.workflow_name})
                </div>
                <div className="text-xs text-default-400">Next publish run scheduled in 2 hours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CMS & Connection Details */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-sm font-semibold">CMS & Connection Settings</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-xs pt-0">
            <div>
              <span className="text-default-400">CMS Provider:</span>
              <div className="font-bold text-foreground">{site.cms_type}</div>
            </div>
            <div>
              <span className="text-default-400">REST Endpoint / Domain:</span>
              <div className="font-mono text-xs text-foreground truncate">{site.cms_credentials?.url || site.cms_credentials?.store_domain || site.domain}</div>
            </div>
            <div>
              <span className="text-default-400">Connected Workflow:</span>
              <div className="font-medium text-foreground">{site.workflow_name}</div>
            </div>
            <div className="pt-2 border-t border-divider text-default-400 text-xs">
              Created on {site.created_at}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
