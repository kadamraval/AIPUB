"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Toolbar } from "@/components/shared/toolbar"
import { TableRowActions } from "@/components/shared/table-row-actions"
import { TablePagination } from "@/components/shared/table-pagination"
import { DataCard } from "@/components/shared/data-card"

import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Chip,
  Checkbox,
  Select,
  ListBox,
  Table,
} from "@heroui/react"
import {
  Globe,
  Plus,
  Search,
  Edit,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Layers,
  FileText,
  Users,
  Sparkles
} from "lucide-react"
import { fetchWebsites, toggleWebsiteStatus, deleteWebsite } from "@/lib/api"

const defaultDemoWebsites = [
  {
    id: "site-1",
    name: "TechPulse Daily",
    domain: "techpulsedaily.io",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    workflow_name: "Autonomous Newsroom Blueprint",
    cms_type: "WordPress",
    status: "active",
    articles: 142,
    visitors: "45.2K",
    last_published: "12 mins ago"
  },
  {
    id: "site-2",
    name: "AI Frontier Journal",
    domain: "aifrontierjournal.com",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    workflow_name: "SEO Cluster Pipeline",
    cms_type: "WordPress",
    status: "active",
    articles: 98,
    visitors: "28.9K",
    last_published: "1 hour ago"
  },
  {
    id: "site-3",
    name: "SaaS Commerce Weekly",
    domain: "saascommerce.store",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    workflow_name: "Multi-Lingual Translation Workflow",
    cms_type: "Shopify",
    status: "stopped",
    articles: 34,
    visitors: "12.4K",
    last_published: "3 days ago"
  }
]

export default function WebsitesPage() {
  const router = useRouter()
  const [websites, setWebsites] = useState<any[]>(defaultDemoWebsites)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cmsFilter, setCmsFilter] = useState<string>("all")
  const [displayMode, setDisplayMode] = useState<"table" | "grid">("table")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [msg, setMsg] = useState<string | null>(null)

  const [sortField, setSortField] = useState<string>("name")
  const [sortAsc, setSortAsc] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const loadData = async () => {
    const data = await fetchWebsites()
    if (data && data.length > 0) {
      const merged = data.map((w: any, idx: number) => ({
        ...w,
        name: w.name || w.websiteName || "Untitled Website",
        domain: w.domain || "",
        cms_type: w.cms_type || w.selectedCms || "WordPress",
        status: (w.status || "active").toLowerCase(),
        articles: w.articles || w.total_articles_published || (120 - idx * 25),
        visitors: w.visitors || `${(30 - idx * 8).toFixed(1)}K`
      }))
      setWebsites(merged)
    }
  }

  useEffect(() => {
    loadData()
    const handleOpenModal = () => { router.push("/admin/websites/new") }
    const handleFilter = (e: any) => setStatusFilter(e.detail || "all")
    const handleView = (e: any) => setDisplayMode(e.detail === "grid" ? "grid" : "table")

    window.addEventListener("open-admin-modal", handleOpenModal)
    window.addEventListener("header-filter-change", handleFilter)
    window.addEventListener("header-view-change", handleView)

    return () => {
      window.removeEventListener("open-admin-modal", handleOpenModal)
      window.removeEventListener("header-filter-change", handleFilter)
      window.removeEventListener("header-view-change", handleView)
    }
  }, [router])

  const handleToggleStatus = async (id: string) => {
    const current = websites.find((w) => w.id === id)
    const nextStatus = current?.status === "active" ? "stopped" : "active"
    await toggleWebsiteStatus(id, nextStatus)
    setWebsites((prev) => prev.map((w) => (w.id === id ? { ...w, status: nextStatus } : w)))
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this website property?")) return
    await deleteWebsite(id)
    setWebsites((prev) => prev.filter((w) => w.id !== id))
    setMsg("Website property deleted successfully.")
    setTimeout(() => setMsg(null), 3000)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected site(s)?`)) return
    setWebsites((prev) => prev.filter((w) => !selectedIds.has(w.id)))
    setMsg(`${selectedIds.size} site(s) deleted.`)
    setSelectedIds(new Set())
    setTimeout(() => setMsg(null), 4000)
  }

  const filteredAndSortedWebsites = websites
    .filter((site) => {
      const siteName = (site.name || site.websiteName || "").toLowerCase()
      const domainName = (site.domain || "").toLowerCase()
      const cmsType = (site.cms_type || site.selectedCms || "").toLowerCase()
      const query = searchQuery.toLowerCase()

      const matchesSearch =
        siteName.includes(query) ||
        domainName.includes(query) ||
        cmsType.includes(query)

      const matchesStatus = statusFilter === "all" || (site.status || "").toLowerCase() === statusFilter.toLowerCase()
      const matchesCms = cmsFilter === "all" || cmsType === cmsFilter.toLowerCase()
      return matchesSearch && matchesStatus && matchesCms
    })

  const totalPages = Math.ceil(filteredAndSortedWebsites.length / pageSize) || 1
  const paginatedWebsites = filteredAndSortedWebsites.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Summary Stats
  const totalSites = websites.length
  const activeSites = websites.filter(w => w.status === "active").length
  const wordpressSites = websites.filter(w => w.cms_type?.toLowerCase().includes("wordpress")).length
  const totalPublishedArticles = websites.reduce((acc, w) => acc + (w.articles || 0), 0)

  return (
    <div className="space-y-6">
      {/* 5-Card Metric Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <DataCard title="Total Properties" value={totalSites.toString()} caption="Target web properties" icon={Globe} />
        <DataCard title="Active CMS Sync" value={activeSites.toString()} caption="Automated publishing" icon={CheckCircle2} />
        <DataCard title="WordPress Sites" value={wordpressSites.toString()} caption="Connected via REST API" icon={Layers} />
        <DataCard title="Other CMS" value={(totalSites - wordpressSites).toString()} caption="Ghost, Webflow, Custom" icon={Sparkles} />
        <DataCard title="Total Articles" value={totalPublishedArticles.toString()} caption="Published across network" icon={FileText} />
      </div>

      {msg && (
        <div className="p-3 bg-success-50 border border-success-200 text-success-700 text-xs rounded-large flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{msg}</span>
        </div>
      )}



      {displayMode === "grid" ? (
        /* GRID SYSTEM VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedWebsites.map((w: any) => (
              <Card
                key={w.id}
                className="bg-content1 border border-divider hover:border-accent-500/50 hover:shadow-md transition-all rounded-2xl overflow-hidden flex flex-col"
              >
                <CardHeader className="p-5 pb-3 border-b border-divider/60 flex items-center justify-between bg-content2/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-500 font-black text-sm flex items-center justify-center shrink-0">
                      {(w.name || "W").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-foreground truncate">{w.name}</h3>
                      <a
                        href={`https://${w.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-default-400 hover:text-primary flex items-center gap-1 truncate"
                      >
                        {w.domain} <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                  <Chip variant="soft" color={w.status === "active" ? "success" : "default"} size="sm" className="font-bold text-[10px] uppercase">
                    {w.status}
                  </Chip>
                </CardHeader>

                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-default-500">
                      <span className="font-medium flex items-center gap-1.5"><Layers className="size-3.5 text-accent-500" /> CMS Engine</span>
                      <span className="font-bold text-foreground">{w.cms_type || "WordPress"}</span>
                    </div>

                    <div className="flex items-center justify-between text-default-500">
                      <span className="font-medium flex items-center gap-1.5"><Sparkles className="size-3.5 text-primary" /> Workflow</span>
                      <Chip variant="soft" color="accent" size="sm" className="text-[11px] font-medium max-w-[160px] truncate">
                        {w.workflow_name || "Autonomous Blueprint"}
                      </Chip>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-divider/40">
                      <div className="p-2.5 rounded-xl bg-content2/50 border border-divider">
                        <div className="text-[10px] text-default-400 uppercase font-bold">Articles</div>
                        <div className="text-sm font-extrabold text-foreground">{w.articles}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-content2/50 border border-divider">
                        <div className="text-[10px] text-default-400 uppercase font-bold">Visitors</div>
                        <div className="text-sm font-extrabold text-foreground">{w.visitors}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 text-xs font-bold gap-1.5 bg-content2 border border-divider"
                      onPress={() => router.push(`/admin/websites/${w.id}`)}
                    >
                      <Edit className="size-3.5" /> Manage Site
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      isIconOnly
                      className="text-default-400 hover:text-danger hover:bg-danger/10 border border-divider"
                      onPress={() => handleDelete(w.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredAndSortedWebsites.length}
            itemLabel="websites"
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
          />
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="space-y-3">
          <Table>
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Websites table"
                selectedKeys={selectedIds as any}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  if (keys === "all") {
                    setSelectedIds(new Set(filteredAndSortedWebsites.map((w) => w.id)))
                  } else {
                    setSelectedIds(new Set(Array.from(keys) as string[]))
                  }
                }}
              >
                <Table.Header>
                  <Table.Column className="pe-0">
                    <Checkbox aria-label="Select all websites" slot="selection">
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Content>
                    </Checkbox>
                  </Table.Column>
                  <Table.Column isRowHeader>Website</Table.Column>
                  <Table.Column>Domain</Table.Column>
                  <Table.Column>Workflow</Table.Column>
                  <Table.Column>Language</Table.Column>
                  <Table.Column>Status</Table.Column>
                  <Table.Column>Updated</Table.Column>
                  <Table.Column className="text-right">Actions</Table.Column>
                </Table.Header>
                <Table.Body items={paginatedWebsites}>
                  {(w: any) => (
                    <Table.Row key={w.id} id={w.id}>
                      <Table.Cell className="pe-0">
                        <Checkbox aria-label={`Select ${w.name}`} slot="selection">
                          <Checkbox.Content>
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                          </Checkbox.Content>
                        </Checkbox>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-medium bg-content1 border border-divider flex items-center justify-center font-bold text-xs text-foreground shrink-0">{(w.name || "W").charAt(0)}</div>
                          <div>
                            <div className="font-bold text-xs">{w.name}</div>
                            <span className="text-[11px] text-default-400">{w.cms_type || "WordPress"}</span>
                          </div>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <a href={`https://${w.domain}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5 text-xs">
                          {w.domain} <ExternalLink className="size-3 text-default-400" />
                        </a>
                      </Table.Cell>

                      <Table.Cell>
                        <Chip variant="soft" color="accent" size="sm">{w.workflow_name || "Autonomous Blueprint"}</Chip>
                      </Table.Cell>

                      <Table.Cell>
                        <span className="text-xs text-default-500 font-medium">English (US)</span>
                      </Table.Cell>

                      <Table.Cell>
                        <Chip variant="soft" color={w.status === "active" ? "success" : "default"} size="sm">
                          {w.status === "active" ? "Active" : "Stopped"}
                        </Chip>
                      </Table.Cell>

                      <Table.Cell className="text-xs text-default-400 font-mono">{w.last_published || "Just now"}</Table.Cell>

                      <Table.Cell className="text-right">
                        <TableRowActions
                          id={w.id}
                          name={w.name}
                          onEdit={() => router.push(`/admin/websites/${w.id}`)}
                          onDelete={() => handleDelete(w.id)}
                          onView={() => router.push(`/admin/websites/${w.id}`)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>

          {/* Standardized Pagination Footer */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredAndSortedWebsites.length}
            itemLabel="websites"
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
          />
        </div>
      )}
    </div>
  )
}
