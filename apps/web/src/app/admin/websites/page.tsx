"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Toolbar } from "@/components/shared/toolbar"
import { TableRowActions } from "@/components/shared/table-row-actions"
import { TablePagination } from "@/components/shared/table-pagination"

import {
  Card,
  CardContent,
  Button,
  Chip,
  Checkbox,
  Select,
  ListBox,
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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
  ArrowUpDown,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  FileText,
  Users
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
        articles: w.articles || w.total_articles_published || (120 - idx * 25),
        visitors: w.visitors || `${(30 - idx * 8).toFixed(1)}K`
      }))
      setWebsites(merged)
    }
  }

  useEffect(() => {
    loadData()
    const handleOpenModal = () => { router.push("/admin/websites/new") }
    window.addEventListener("open-admin-modal", handleOpenModal)
    return () => window.removeEventListener("open-admin-modal", handleOpenModal)
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

  const handleSort = (field: string) => {
    if (sortField === field) { setSortAsc(!sortAsc) } else { setSortField(field); setSortAsc(true) }
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
      const matchesSearch =
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.cms_type?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || site.status === statusFilter
      const matchesCms = cmsFilter === "all" || site.cms_type === cmsFilter
      return matchesSearch && matchesStatus && matchesCms
    })
    .sort((a, b) => {
      let valA = a[sortField] || ""
      let valB = b[sortField] || ""
      if (typeof valA === "string") valA = valA.toLowerCase()
      if (typeof valB === "string") valB = valB.toLowerCase()
      if (valA < valB) return sortAsc ? -1 : 1
      if (valA > valB) return sortAsc ? 1 : -1
      return 0
    })

  const totalPages = Math.ceil(filteredAndSortedWebsites.length / pageSize) || 1
  const paginatedWebsites = filteredAndSortedWebsites.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const allSelected = paginatedWebsites.length > 0 && paginatedWebsites.every((w) => selectedIds.has(w.id))

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredAndSortedWebsites.map((w) => w.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) { next.delete(id) } else { next.add(id) }
    setSelectedIds(next)
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div className="p-3 bg-success-50 border border-success-200 text-success-700 text-xs rounded-large flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{msg}</span>
        </div>
      )}

      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1) }}
        searchPlaceholder="Search by property name, domain, or CMS..."
        actions={
          selectedIds.size > 0 ? (
            <Button size="sm" onPress={handleBulkDelete}><Trash2 className="size-4"  /> 
              Delete ({selectedIds.size})
            </Button>
          ) : undefined
        }
        filters={
          <>
            <Select
              selectedKey={statusFilter}
              onSelectionChange={(key) => {
                if (key) { setStatusFilter(key as string); setCurrentPage(1); }
              }}
              className="w-36"
              aria-label="Filter by status"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all">All Statuses</ListBox.Item>
                  <ListBox.Item id="active">Active</ListBox.Item>
                  <ListBox.Item id="stopped">Stopped</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              selectedKey={cmsFilter}
              onSelectionChange={(key) => {
                if (key) { setCmsFilter(key as string); setCurrentPage(1); }
              }}
              className="w-40"
              aria-label="Filter by CMS"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all">All CMS Types</ListBox.Item>
                  <ListBox.Item id="WordPress">WordPress</ListBox.Item>
                  <ListBox.Item id="Shopify">Shopify</ListBox.Item>
                  <ListBox.Item id="Ghost">Ghost</ListBox.Item>
                  <ListBox.Item id="Webflow">Webflow</ListBox.Item>
                  <ListBox.Item id="Strapi">Strapi</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </>
        }
      />

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
    </div>
  )
}
