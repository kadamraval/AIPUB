"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { Toolbar } from "@/components/shared/toolbar"
import { TableRowActions } from "@/components/shared/table-row-actions"
import { TablePagination } from "@/components/shared/table-pagination"

import {
  Card, CardContent, CardHeader, Button, Chip, Checkbox, Select, ListBox,
  Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@heroui/react"
import {
  Bot, Edit, Trash2, CheckCircle2, Sparkles, ArrowUpDown, Download,
  ChevronLeft, ChevronRight, LayoutGrid, List
} from "lucide-react"
import { fetchCustomAgents, deleteCustomAgent } from "@/lib/api"

const defaultDemoAgents = [
  {
    id: "agent-1",
    name: "Autonomous Research Agent",
    role_description: "Scrapes RSS & Google News feeds, extracts key facts, and generates topic outlines.",
    system_prompt: "You are an expert AI research agent specializing in tech & AI news intake.",
    skills: [
      { name: "Web Scraping & Extraction", description: "Parses raw HTML/RSS into structured JSON." },
      { name: "Fact Verification", description: "Cross-checks facts against reliable news sources." }
    ],
    permitted_integrations: ["openai", "fal_ai"],
    permitted_sources: ["TechCrunch AI Feed", "Google News AI Stream"],
    status: "active"
  },
  {
    id: "agent-2",
    name: "SEO Copywriter & Formatter",
    role_description: "Crafts engaging 1500+ word articles with proper H2/H3 headers, meta tags, and internal links.",
    system_prompt: "You are a professional SEO editor generating clean Markdown content.",
    skills: [
      { name: "Longform Markdown Writing", description: "Outputs publication-ready markdown." },
      { name: "Keyword Density Optimization", description: "Maintains optimal 1.5% keyword density." }
    ],
    permitted_integrations: ["openai", "freepik"],
    permitted_sources: ["Google Trends API"],
    status: "active"
  },
  {
    id: "agent-3",
    name: "WordPress Publisher Agent",
    role_description: "Connects to WordPress REST API, creates post drafts, attaches media, and manages publishing.",
    system_prompt: "You handle WordPress API post creation and publishing status.",
    skills: [
      { name: "REST API Post Creation", description: "Direct HTTP POST payload creation." },
      { name: "Draft vs Live Option", description: "Configures post publication state." }
    ],
    permitted_integrations: ["wordpress"],
    permitted_sources: ["WordPress CMS"],
    status: "active"
  },
  {
    id: "agent-4",
    name: "A/B Testing Thumbnail Agent",
    role_description: "Generates headline variants and featured image concepts to optimize publication CTR.",
    system_prompt: "You generate alternative article titles and image prompts.",
    skills: [
      { name: "CTR Variant Generation", description: "Generates 3 headline variations." },
      { name: "Image Prompt Crafting", description: "Crafts fal.ai FLUX image prompts." }
    ],
    permitted_integrations: ["fal_ai", "openai"],
    permitted_sources: ["Internal Analytics"],
    status: "active"
  },
  {
    id: "agent-5",
    name: "Video Script Shortform Agent",
    role_description: "Repurposes articles into 60s YouTube Shorts & TikTok scripts with timestamped captions.",
    system_prompt: "You format written articles into engaging video scripts.",
    skills: [
      { name: "Shortform Script Writing", description: "30-60 second engaging script hooks." },
      { name: "Caption Formatting", description: "Generates SRT captions." }
    ],
    permitted_integrations: ["openai"],
    permitted_sources: ["Articles Library"],
    status: "active"
  }
]

export default function CustomAgentsStudioPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<any[]>(defaultDemoAgents)
  const [displayMode, setDisplayMode] = useState<"table" | "grid">("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const [msg, setMsg] = useState<string | null>(null)

  const openCreateModal = () => {
    router.push("/admin/custom-agents/new")
  }

  const openCreateModalRef = useRef(openCreateModal)
  useEffect(() => { openCreateModalRef.current = openCreateModal })

  useEffect(() => {
    async function loadAgents() {
      const data = await fetchCustomAgents()
      if (data && data.length > 0) setAgents(data)
    }
    loadAgents()

    const handleOpenModal = () => openCreateModalRef.current()
    window.addEventListener("open-admin-modal", handleOpenModal)
    return () => {
      window.removeEventListener("open-admin-modal", handleOpenModal)
    }
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete AI Agent "${name}"?`)) return
    await deleteCustomAgent(id)
    setAgents((prev) => prev.filter((a) => a.id !== id))
    const next = new Set(selectedIds); next.delete(id); setSelectedIds(next)
    setMsg(`Deleted Agent "${name}".`)
    setTimeout(() => setMsg(null), 3000)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected agent(s)?`)) return
    setAgents((prev) => prev.filter((a) => !selectedIds.has(a.id)))
    setMsg(`${selectedIds.size} agent(s) deleted.`)
    setSelectedIds(new Set())
    setTimeout(() => setMsg(null), 4000)
  }

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Role Description,Status"]
        .concat(
          filteredAndSortedAgents.map(
            (a) => `${a.id},"${a.name}","${a.role_description}",${a.is_active !== false ? "active" : "paused"}`
          )
        )
        .join("\n")
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", `custom_agents_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const filteredAndSortedAgents = agents
    .filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role_description?.toLowerCase().includes(searchQuery.toLowerCase())
      const agentStatus = agent.is_active !== false ? "active" : "paused"
      const matchesStatus = statusFilter === "all" || agentStatus === statusFilter
      return matchesSearch && matchesStatus
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

  const totalPages = Math.ceil(filteredAndSortedAgents.length / pageSize) || 1
  const paginatedAgents = filteredAndSortedAgents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const allSelected = paginatedAgents.length > 0 && paginatedAgents.every((a) => selectedIds.has(a.id))
  const toggleSelectAll = (v: boolean) => {
    setSelectedIds(v ? new Set(filteredAndSortedAgents.map((a) => a.id)) : new Set())
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
        onSearchChange={(val) => {
          setSearchQuery(val)
          setCurrentPage(1)
        }}
        searchPlaceholder="Search agents by name, role description, or system prompt..."
        actions={
          <>
            <div className="flex items-center border border-divider rounded-medium p-0.5 bg-content1 mr-1">
              <Button
                variant={displayMode === "table" ? "secondary" : "ghost"}
                size="sm"
                isIconOnly
                onPress={() => setDisplayMode("table")}
              >
                <List className="size-4" />
              </Button>
              <Button
                variant={displayMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                isIconOnly
                onPress={() => setDisplayMode("grid")}
              >
                <LayoutGrid className="size-4" />
              </Button>
            </div>

            {selectedIds.size > 0 && (
              <Button size="sm" onPress={handleBulkDelete}><Trash2 className="size-4"  /> 
                Delete ({selectedIds.size})
              </Button>
            )}

            <Button variant="outline" size="sm" onPress={handleExportCSV}><Download className="size-4"  /> 
              Export CSV
            </Button>
          </>
        }
        filters={
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
                <ListBox.Item id="paused">Paused</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        }
      />

      {/* MODE 1: TABLE VIEW */}
      {displayMode === "table" && (
        <div className="space-y-3">
          <Table>
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Agents table"
                selectedKeys={selectedIds as any}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  if (keys === "all") {
                    setSelectedIds(new Set(filteredAndSortedAgents.map((a) => a.id)))
                  } else {
                    setSelectedIds(new Set(Array.from(keys) as string[]))
                  }
                }}
              >
                <Table.Header>
                  <Table.Column className="pe-0">
                    <Checkbox aria-label="Select all agents" slot="selection">
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Content>
                    </Checkbox>
                  </Table.Column>
                  <Table.Column isRowHeader>Agent</Table.Column>
                  <Table.Column>AI Model</Table.Column>
                  <Table.Column>Sources</Table.Column>
                  <Table.Column>Tools</Table.Column>
                  <Table.Column>Status</Table.Column>
                  <Table.Column>Updated</Table.Column>
                  <Table.Column className="text-right">Actions</Table.Column>
                </Table.Header>
                <Table.Body items={paginatedAgents}>
                  {(ag: any) => (
                    <Table.Row key={ag.id} id={ag.id}>
                      <Table.Cell className="pe-0">
                        <Checkbox aria-label={`Select ${ag.name}`} slot="selection">
                          <Checkbox.Content>
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                          </Checkbox.Content>
                        </Checkbox>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="font-bold text-xs flex items-center gap-2">
                          <Bot className="size-4 text-accent-500 shrink-0" />
                          <div>
                            <div>{ag.name}</div>
                            <div className="text-[11px] text-default-400 font-normal">{ag.role_description}</div>
                          </div>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <Chip variant="soft" color="accent" size="sm" className="font-mono text-[11px]">
                          {ag.model || "GPT-4o / Claude 3.5"}
                        </Chip>
                      </Table.Cell>

                      <Table.Cell className="text-xs text-default-500 font-medium">
                        {ag.sources_count || 3} Sources
                      </Table.Cell>

                      <Table.Cell className="text-xs text-default-500 font-medium">
                        {ag.skills?.length || 2} Tools
                      </Table.Cell>

                      <Table.Cell>
                        <Chip variant="soft" color="success" size="sm">
                          {ag.status || "active"}
                        </Chip>
                      </Table.Cell>

                      <Table.Cell className="text-xs text-default-400 font-mono">
                        {ag.updated_at || "10 mins ago"}
                      </Table.Cell>

                      <Table.Cell className="text-right">
                        <TableRowActions
                          id={ag.id}
                          name={ag.name}
                          onEdit={() => router.push("/admin/custom-agents/new")}
                          onDelete={() => handleDelete(ag.id, ag.name)}
                          onView={() => router.push("/admin/custom-agents/new")}
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
            totalItems={filteredAndSortedAgents.length}
            itemLabel="agents"
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
          />
        </div>
      )}

      {/* MODE 2: CARDS GRID VIEW */}
      {displayMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedAgents.map((ag, idx) => (
            <Card key={ag.id || idx}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Bot className="size-4 text-blue-500" /> {ag.name}
                  </div>
                  <p className="text-xs text-default-400 mt-1">{ag.role_description}</p>
                </div>
                <Chip variant="soft" color="success" size="sm">
                  {ag.status || "active"}
                </Chip>
              </CardHeader>
              <CardContent className="space-y-3 pt-2 border-t border-divider text-xs">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">Configured Agent Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ag.skills?.map((sk: any, sIdx: number) => (
                      <Chip key={sIdx} variant="soft" color="accent" size="sm">
                        {sk.name}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-divider/50 text-xs">
                  <div className="flex items-center gap-2">
                    <Button isIconOnly variant="ghost" size="sm" onPress={() => router.push("/admin/custom-agents/new")}>
                      <Edit className="size-3 text-default-400" />
                    </Button>
                    <Button isIconOnly variant="ghost" size="sm" onPress={() => handleDelete(ag.id, ag.name)}>
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
