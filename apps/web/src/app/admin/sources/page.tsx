"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Toolbar } from "@/components/shared/toolbar"
import { TableRowActions } from "@/components/shared/table-row-actions"
import { TablePagination } from "@/components/shared/table-pagination"

import {
  Card, CardContent, Button, Select, ListBox, Checkbox, Chip,
  Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@heroui/react"
import {
  RefreshCw, Trash2, CheckCircle2, Download,
  ChevronLeft, ChevronRight,
} from "lucide-react"
import { fetchSources, triggerFetchSource, deleteSource, fetchWebsites } from "@/lib/api"

const defaultDemoSources = [
  { id: "src-1", name: "TechCrunch AI News Feed", source_type: "RSS Feed", url: "https://techcrunch.com/category/artificial-intelligence/feed/", target_site: "TechPulse Daily", fetch_interval: "Every 1 Hour", last_fetched: "10 mins ago", total_fetched_items: 342, status: "active" },
  { id: "src-2", name: "Google News Artificial Intelligence", source_type: "Google News Stream", url: "https://news.google.com/rss/search?q=artificial+intelligence", target_site: "AI Frontier Journal", fetch_interval: "Every 30 Mins", last_fetched: "5 mins ago", total_fetched_items: 512, status: "active" },
  { id: "src-3", name: "Hacker News Top Stories", source_type: "API Stream", url: "https://hacker-news.firebaseio.com/v0/topstories.json", target_site: "SaaS Growth Chronicle", fetch_interval: "Every 2 Hours", last_fetched: "1 hour ago", total_fetched_items: 189, status: "active" },
  { id: "src-4", name: "MIT Technology Review AI Feed", source_type: "RSS Feed", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", target_site: "TechPulse Daily", fetch_interval: "Every 4 Hours", last_fetched: "2 hours ago", total_fetched_items: 94, status: "active" },
  { id: "src-5", name: "GitHub Trending AI Repositories", source_type: "API Stream", url: "https://api.github.com/search/repositories?q=language:python+ai", target_site: "AI Frontier Journal", fetch_interval: "Every 6 Hours", last_fetched: "4 hours ago", total_fetched_items: 275, status: "active" }
]

export default function SourcesPage() {
  const router = useRouter()
  const [sources, setSources] = useState<any[]>(defaultDemoSources)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [siteFilter, setSiteFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const [srcData, siteData] = await Promise.all([fetchSources(), fetchWebsites()])
      if (srcData && srcData.length > 0) setSources(srcData)
    }
    loadData()
    const handleOpenModal = () => router.push("/admin/sources/new")
    window.addEventListener("open-admin-modal", handleOpenModal)
    return () => { window.removeEventListener("open-admin-modal", handleOpenModal) }
  }, [router])

  const handleAutoFetch = async (id: string, sourceName: string) => {
    const res = await triggerFetchSource(id)
    if (res && res.status === "success") {
      setSources((prev) => prev.map((s) => (s.id === id ? { ...s, last_fetched: "Just Now", total_fetched_items: s.total_fetched_items + 5 } : s)))
      setMsg(`Fetched 5 new items from "${sourceName}"!`)
      setTimeout(() => setMsg(null), 4000)
    }
  }

  const handleDelete = async (id: string, sourceName: string) => {
    if (!confirm(`Are you sure you want to remove data source "${sourceName}"?`)) return
    const res = await deleteSource(id)
    if (res) {
      setSources((prev) => prev.filter((s) => s.id !== id))
      const next = new Set(selectedIds); next.delete(id); setSelectedIds(next)
      setMsg(`Source "${sourceName}" removed.`)
      setTimeout(() => setMsg(null), 4000)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected source(s)?`)) return
    setSources((prev) => prev.filter((s) => !selectedIds.has(s.id)))
    setMsg(`${selectedIds.size} source(s) deleted.`)
    setSelectedIds(new Set())
    setTimeout(() => setMsg(null), 4000)
  }

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["ID,Name,Type,URL,Target Site,Interval,Total Fetched"].concat(
        filteredAndSortedSources.map((s) => `${s.id},"${s.name}",${s.source_type},"${s.url}","${s.target_site}",${s.fetch_interval},${s.total_fetched_items}`)
      ).join("\n")
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", `data_sources_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredAndSortedSources = sources
    .filter((src) => {
      const matchesSearch = src.name.toLowerCase().includes(searchQuery.toLowerCase()) || src.url.toLowerCase().includes(searchQuery.toLowerCase()) || src.target_site?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === "all" || src.source_type === typeFilter
      const matchesSite = siteFilter === "all" || src.target_site === siteFilter
      return matchesSearch && matchesType && matchesSite
    })
    .sort((a, b) => {
      let valA = a[sortField] || "", valB = b[sortField] || ""
      if (typeof valA === "string") valA = valA.toLowerCase()
      if (typeof valB === "string") valB = valB.toLowerCase()
      if (valA < valB) return sortAsc ? -1 : 1
      if (valA > valB) return sortAsc ? 1 : -1
      return 0
    })

  const totalPages = Math.ceil(filteredAndSortedSources.length / pageSize) || 1
  const paginatedSources = filteredAndSortedSources.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const allSelected = paginatedSources.length > 0 && paginatedSources.every((s) => selectedIds.has(s.id))
  const toggleSelectAll = (v: boolean) => {
    setSelectedIds(v ? new Set(filteredAndSortedSources.map((s) => s.id)) : new Set())
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
          <CheckCircle2 className="h-4 w-4" />
          <span>{msg}</span>
        </div>
      )}

      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1) }}
        searchPlaceholder="Search by source name, stream URL, or target property..."
        actions={
          <>
            {selectedIds.size > 0 && (
              <Button size="sm" onPress={handleBulkDelete}><Trash2 className="size-4" /> 
                Delete ({selectedIds.size})
              </Button>
            )}
            <Button variant="ghost" size="sm" onPress={handleExportCSV}><Download className="size-4" /> 
              Export CSV
            </Button>
          </>
        }
        filters={
          <>
            <Select
              selectedKey={typeFilter}
              onSelectionChange={(key) => {
                if (key) { setTypeFilter(key as string); setCurrentPage(1); }
              }}
              className="w-44"
              aria-label="Filter by source type"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all">All Source Types</ListBox.Item>
                  <ListBox.Item id="RSS Feed">RSS Feed</ListBox.Item>
                  <ListBox.Item id="Google News Stream">Google News Stream</ListBox.Item>
                  <ListBox.Item id="API Stream">API Stream</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              selectedKey={siteFilter}
              onSelectionChange={(key) => {
                if (key) { setSiteFilter(key as string); setCurrentPage(1); }
              }}
              className="w-48"
              aria-label="Filter by target property"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all">All Target Properties</ListBox.Item>
                  <ListBox.Item id="TechPulse Daily">TechPulse Daily</ListBox.Item>
                  <ListBox.Item id="AI Frontier Journal">AI Frontier Journal</ListBox.Item>
                  <ListBox.Item id="SaaS Growth Chronicle">SaaS Growth Chronicle</ListBox.Item>
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
              aria-label="Sources table"
              selectedKeys={selectedIds as any}
              selectionMode="multiple"
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  setSelectedIds(new Set(filteredAndSortedSources.map((s) => s.id)))
                } else {
                  setSelectedIds(new Set(Array.from(keys) as string[]))
                }
              }}
            >
              <Table.Header>
                <Table.Column className="pe-0">
                  <Checkbox aria-label="Select all sources" slot="selection">
                    <Checkbox.Content>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                    </Checkbox.Content>
                  </Checkbox>
                </Table.Column>
                <Table.Column isRowHeader>Source</Table.Column>
                <Table.Column>Type</Table.Column>
                <Table.Column>Used By</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Updated</Table.Column>
                <Table.Column className="text-right">Actions</Table.Column>
              </Table.Header>
              <Table.Body items={paginatedSources}>
                {(src: any) => (
                  <Table.Row key={src.id} id={src.id}>
                    <Table.Cell className="pe-0">
                      <Checkbox aria-label={`Select ${src.name}`} slot="selection">
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        </Checkbox.Content>
                      </Checkbox>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="font-bold text-xs text-foreground">{src.name}</div>
                    </Table.Cell>

                    <Table.Cell>
                      <Chip variant="soft" color="accent" size="sm">{src.source_type || "Fetch"}</Chip>
                    </Table.Cell>

                    <Table.Cell className="text-xs text-default-500 font-medium">
                      2 Connected Agents
                    </Table.Cell>

                    <Table.Cell>
                      <Chip variant="soft" color="success" size="sm">
                        {src.status || "active"}
                      </Chip>
                    </Table.Cell>

                    <Table.Cell className="text-xs text-default-400 font-mono">{src.last_fetched || "Just now"}</Table.Cell>

                    <Table.Cell className="text-right">
                      <TableRowActions
                        id={src.id}
                        name={src.name}
                        onEdit={() => router.push("/admin/sources/new")}
                        onDelete={() => handleDelete(src.id, src.name)}
                        onView={() => handleAutoFetch(src.id, src.name)}
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
          totalItems={filteredAndSortedSources.length}
          itemLabel="sources"
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
        />
      </div>

    </div>
  )
}
