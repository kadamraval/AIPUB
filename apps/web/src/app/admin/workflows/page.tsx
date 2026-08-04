"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  Connection,
  Edge,
  Node,
  NodeProps,
  BackgroundVariant
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import {
  Button, Form, TextField, Label, Input, Card, CardContent, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox, Chip, Select, ListBox, Tooltip
} from "@heroui/react"
import {
  Plus, Search, Edit, Trash2, Download, CheckCircle2, GitBranch, ArrowLeft,
  Save, Play, Layers, Repeat, Bell, XCircle, ChevronLeft, ChevronRight, Bot, Sliders, Info,
  Zap, Clock, Send, Sparkles, Copy, RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2, Map, LayoutTemplate, Hand, MousePointer, Tag
} from "lucide-react"

import { Toolbar } from "@/components/shared/toolbar"
import { TableRowActions } from "@/components/shared/table-row-actions"
import { TablePagination } from "@/components/shared/table-pagination"
import { fetchWorkflows, deleteWorkflow, updateWorkflow, fetchCustomAgents } from "@/lib/api"

// Dynamic SSR rule for admin page
export const dynamic = "force-dynamic"

// Demo Websites
const DEMO_WEBSITES = ["TechPulse Daily", "AI Insider Journal", "SaaS Growth Hub", "Crypto Trends Today"]

// Workflow Templates
const WORKFLOW_TEMPLATES = [
  {
    id: "blank",
    name: "Blank Canvas",
    tag: "Custom",
    desc: "Start with a clean, empty canvas and build your custom node graph step by step from scratch.",
    nodes: [],
    edges: []
  },
  {
    id: "newsroom",
    name: "Autonomous Newsroom Digest",
    tag: "RSS & WordPress",
    desc: "Scrapes RSS feeds, generates SEO copy with GPT-4o, creates artwork with fal.ai, and publishes to WordPress.",
    nodes: [
      { id: "node-1", type: "customNode", position: { x: 80, y: 150 }, data: { label: "Trigger", category: "Start", typeName: "Trigger", config: { triggerTypes: ["Schedule", "Fetch"], schedule: "Hourly" } } },
      { id: "node-2", type: "customNode", position: { x: 440, y: 150 }, data: { label: "Agent", category: "Main", typeName: "Agent", config: { agentName: "SEO Copywriter Agent" } } },
      { id: "node-3", type: "customNode", position: { x: 800, y: 150 }, data: { label: "Publish", category: "Main", typeName: "Publish", config: { website: "TechPulse Daily", status: "Publish Immediately" } } }
    ],
    edges: [
      { id: "e1-2", source: "node-1", target: "node-2", animated: true, style: { strokeDasharray: "6 6", stroke: "var(--heroui-primary, #3b82f6)", strokeWidth: 2 } },
      { id: "e2-3", source: "node-2", target: "node-3", animated: true, style: { strokeDasharray: "6 6", stroke: "var(--heroui-primary, #3b82f6)", strokeWidth: 2 } }
    ]
  },
  {
    id: "serp-cluster",
    name: "SERP Topic Cluster Generator",
    tag: "SEO & Ghost",
    desc: "Fetches search engine keywords, constructs topic clusters, drafts longform articles, and saves to Ghost.",
    nodes: [
      { id: "node-1", type: "customNode", position: { x: 80, y: 150 }, data: { label: "Trigger", category: "Start", typeName: "Trigger", config: { triggerTypes: ["Manual"], schedule: "Daily" } } },
      { id: "node-2", type: "customNode", position: { x: 440, y: 150 }, data: { label: "Agent", category: "Main", typeName: "Agent", config: { agentName: "SERP Keyword Extractor" } } },
      { id: "node-3", type: "customNode", position: { x: 800, y: 150 }, data: { label: "Condition", category: "Condition", typeName: "Condition", config: { rule: "{{word_count}} > 1000" } } },
      { id: "node-4", type: "customNode", position: { x: 440, y: 380 }, data: { label: "Publish", category: "Main", typeName: "Publish", config: { website: "AI Insider Journal" } } }
    ],
    edges: [
      { id: "e1-2", source: "node-1", target: "node-2", animated: true, style: { strokeDasharray: "6 6", stroke: "var(--heroui-primary, #3b82f6)", strokeWidth: 2 } },
      { id: "e2-3", source: "node-2", target: "node-3", animated: true, style: { strokeDasharray: "6 6", stroke: "var(--heroui-primary, #3b82f6)", strokeWidth: 2 } },
      { id: "e3-4", source: "node-3", target: "node-4", animated: true, style: { strokeDasharray: "6 6", stroke: "var(--heroui-secondary, #a855f7)", strokeWidth: 2 } }
    ]
  },
  {
    id: "polyglot",
    name: "Multi-Lingual Translation",
    tag: "Translation & Webflow",
    desc: "Translates master articles into 5+ languages and pushes to Webflow Collections.",
    nodes: [
      { id: "node-1", type: "customNode", position: { x: 80, y: 150 }, data: { label: "Trigger", category: "Start", typeName: "Trigger", config: { triggerTypes: ["Webhook"] } } },
      { id: "node-2", type: "customNode", position: { x: 440, y: 150 }, data: { label: "Agent", category: "Main", typeName: "Agent", config: { agentName: "Polyglot Translator" } } },
      { id: "node-3", type: "customNode", position: { x: 800, y: 150 }, data: { label: "Publish", category: "Main", typeName: "Publish", config: { website: "SaaS Growth Hub" } } }
    ],
    edges: [
      { id: "e1-2", source: "node-1", target: "node-2", animated: true, style: { strokeDasharray: "6 6", stroke: "var(--heroui-primary, #3b82f6)", strokeWidth: 2 } },
      { id: "e2-3", source: "node-2", target: "node-3", animated: true, style: { strokeDasharray: "6 6", stroke: "var(--heroui-primary, #3b82f6)", strokeWidth: 2 } }
    ]
  }
]

const DEMO_WORKFLOWS = [
  {
    id: "wf-1",
    name: "Autonomous Newsroom Blueprint",
    description: "Scrapes RSS feeds, generates SEO copy with GPT-4o, and publishes to WordPress.",
    target_website: "TechPulse Daily",
    status: "Published",
    tags: ["Autonomous", "SEO", "Newsroom"],
    nodes: WORKFLOW_TEMPLATES[1].nodes,
    edges: WORKFLOW_TEMPLATES[1].edges
  },
  {
    id: "wf-2",
    name: "SEO Topic Cluster & Article Generator",
    description: "Fetches SERP keywords, builds topic cluster, generates longform content, saves to Ghost.",
    target_website: "AI Insider Journal",
    status: "Published",
    tags: ["SEO", "Topic Cluster"],
    nodes: WORKFLOW_TEMPLATES[2].nodes,
    edges: WORKFLOW_TEMPLATES[2].edges
  },
  {
    id: "wf-3",
    name: "Multi-Lingual Translation & Publishing",
    description: "Translates master articles into Spanish & German and pushes to Webflow Collections.",
    target_website: "SaaS Growth Hub",
    status: "Draft",
    tags: ["Translation", "Multi-Language"],
    nodes: WORKFLOW_TEMPLATES[3].nodes,
    edges: WORKFLOW_TEMPLATES[3].edges
  }
]

// EXACT USER PALETTE NODE DEFINITIONS
const PALETTE_NODE_ITEMS = [
  { type: "Trigger", category: "Start" as const, name: "Trigger", desc: "Configure one or more methods used to start the workflow.", icon: Zap },
  { type: "End", category: "Start" as const, name: "End", desc: "Marks the completion of the workflow execution.", icon: XCircle },

  { type: "Agent", category: "Main" as const, name: "Agent", desc: "Execute one or more AI Agents.", icon: Bot },
  { type: "Publish", category: "Main" as const, name: "Publish", desc: "Publish or save content to the selected Website.", icon: Send },
  { type: "Notification", category: "Main" as const, name: "Notification", desc: "Send workflow notifications or approval requests.", icon: Bell },
  { type: "Export", category: "Main" as const, name: "Export", desc: "Export workflow results.", icon: Download },

  { type: "Condition", category: "Condition" as const, name: "Condition", desc: "Execute different workflow paths based on rules.", icon: GitBranch },
  { type: "Loop", category: "Condition" as const, name: "Loop", desc: "Repeat workflow steps.", icon: Repeat },
  { type: "Merge", category: "Condition" as const, name: "Merge", desc: "Combine multiple workflow branches.", icon: Layers },
  { type: "Delay", category: "Condition" as const, name: "Delay", desc: "Pause workflow execution.", icon: Clock },
  { type: "Wait", category: "Condition" as const, name: "Wait", desc: "Wait until a specified event, condition or time before continuing.", icon: Clock }
]

function getNodeIcon(typeName: string) {
  switch (typeName) {
    case "Trigger": return Zap
    case "End": return XCircle
    case "Agent": return Bot
    case "Publish": return Send
    case "Notification": return Bell
    case "Export": return Download
    case "Condition": return GitBranch
    case "Loop": return Repeat
    case "Merge": return Layers
    case "Delay":
    case "Wait": return Clock
    default: return Sliders
  }
}

// HERO UI DESIGN SYSTEM COMPLIANT NODE COMPONENT
function CustomWorkflowNodeComponent({ id, data, selected }: NodeProps) {
  const category = (data.category as string) || "Main"
  const typeName = (data.typeName as string) || "Node"
  const label = (data.label as string) || typeName
  const IconComp = getNodeIcon(typeName)
  const config = (data.config as Record<string, any>) || {}

  const isStart = category === "Start"
  const isCondition = category === "Condition"

  const cardBorderClass = selected
    ? "border-primary ring-2 ring-primary/30 shadow-xl scale-[1.01]"
    : "border-divider hover:border-default-400 shadow-md"

  const headerBgClass = isStart
    ? "bg-warning-50/40 dark:bg-warning-950/40 border-b border-warning/20 text-warning"
    : isCondition
    ? "bg-secondary-50/40 dark:bg-secondary-950/40 border-b border-secondary/20 text-secondary"
    : "bg-primary-50/40 dark:bg-primary-950/40 border-b border-primary/20 text-primary"

  const categoryBadgeColor = isStart ? "warning" : isCondition ? "accent" : "default"

  const iconBgClass = isStart
    ? "bg-warning text-warning-foreground"
    : isCondition
    ? "bg-secondary text-secondary-foreground"
    : "bg-primary text-primary-foreground"

  return (
    <div
      className={`relative w-72 rounded-2xl bg-content1 border backdrop-blur-md transition-all duration-150 ${cardBorderClass}`}
    >
      {/* Input Handle Port (Left) */}
      {!isStart && (
        <Handle
          type="target"
          position={Position.Left}
          className="!size-4 !bg-primary !border-2 !border-background hover:!scale-125 transition-transform !-left-2 shadow-md"
        />
      )}

      {/* Card Header */}
      <div className={`p-3.5 flex items-center justify-between rounded-t-2xl ${headerBgClass}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shadow-xs ${iconBgClass}`}>
            <IconComp className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground tracking-tight">{label}</h4>
            <span className="text-[11px] text-default-500 font-medium capitalize">{typeName}</span>
          </div>
        </div>
        <Chip size="sm" color={categoryBadgeColor} variant="soft" className="text-[9px] h-4 font-bold uppercase tracking-wider">
          ★ {category}
        </Chip>
      </div>

      {/* Card Body Summary */}
      <div className="p-4 space-y-2 text-xs bg-content2/50 rounded-b-2xl">
        {typeName === "Trigger" && (
          <div className="space-y-1.5">
            <span className="text-[11px] text-default-400 font-bold block">Active Triggers:</span>
            <div className="flex flex-wrap gap-1.5">
              {(config.triggerTypes || ["Manual"]).map((t: string) => (
                <Chip key={t} size="sm" variant="soft" color="warning" className="text-[10px] h-5 font-bold">
                  {t}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {typeName === "Agent" && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-content1 border border-divider">
            <Bot className="size-4 text-primary shrink-0" />
            <span className="font-bold text-foreground truncate">{config.agentName || "SEO Copywriter Agent"}</span>
          </div>
        )}

        {typeName === "Publish" && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-content1 border border-divider">
            <span className="text-foreground font-bold truncate">{config.website || "TechPulse Daily"}</span>
            <Chip size="sm" color="success" variant="soft" className="text-[10px] font-bold">
              {config.status || "Live"}
            </Chip>
          </div>
        )}

        {typeName === "Condition" && (
          <div className="font-mono text-[11px] p-2.5 rounded-xl bg-content1 text-secondary border border-divider font-semibold">
            {config.rule || "{{word_count}} > 1000"}
          </div>
        )}

        {!["Trigger", "Agent", "Publish", "Condition"].includes(typeName) && (
          <p className="text-default-500 text-[11px] font-medium leading-snug">
            Configured for execution pipeline step.
          </p>
        )}
      </div>

      {/* Output Handle Port (Right) */}
      {typeName !== "End" && (
        <Handle
          type="source"
          position={Position.Right}
          className="!size-4 !bg-primary !border-2 !border-background hover:!scale-125 transition-transform !-right-2 shadow-md"
        />
      )}
    </div>
  )
}

function FormLabel({ children, info }: { children: React.ReactNode; info?: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <Label className="text-xs font-bold text-foreground tracking-tight">{children}</Label>
      {info && (
        <Tooltip delay={0}>
          <span className="inline-flex items-center text-default-400 hover:text-primary transition-colors cursor-pointer">
            <Info className="size-3.5" />
          </span>
          <Tooltip.Content>
            <p className="text-xs p-1.5 max-w-xs">{info}</p>
          </Tooltip.Content>
        </Tooltip>
      )}
    </div>
  )
}

export default function WorkflowsModulePage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<any[]>(DEMO_WORKFLOWS)
  const [customAgents, setCustomAgents] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"list" | "builder">("list")
  const [activeWorkflow, setActiveWorkflow] = useState<any | null>(null)

  // Sidebar State
  const [isLeftSidebarExpanded, setIsLeftSidebarExpanded] = useState(true)
  const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(false)
  const [paletteSearchQuery, setPaletteSearchQuery] = useState("")

  // Create Workflow Popup Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newWfName, setNewWfName] = useState("")
  const [newWfDesc, setNewWfDesc] = useState("")
  const [newWfTargetCms, setNewWfTargetCms] = useState("TechPulse Daily")
  const [newWfTags, setNewWfTags] = useState<string[]>(["Autonomous", "Publishing"])
  const [newWfTagInput, setNewWfTagInput] = useState("")

  // Template Modal Picker inside Builder
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)

  // List View Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("")
  const [websiteFilter, setWebsiteFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // React Flow State Engine
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const [msg, setMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const nodeTypes = useMemo(() => ({ customNode: CustomWorkflowNodeComponent }), [])

  useEffect(() => {
    async function loadData() {
      const [wfData, agentData] = await Promise.all([fetchWorkflows(), fetchCustomAgents()])
      if (wfData && wfData.length > 0) setWorkflows(wfData)
      if (agentData && agentData.length > 0) setCustomAgents(agentData)
    }
    loadData()

    const handleOpenModal = () => setIsCreateModalOpen(true)
    window.addEventListener("open-admin-modal", handleOpenModal)
    return () => window.removeEventListener("open-admin-modal", handleOpenModal)
  }, [])

  // React Flow Connection Handler
  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        ...connection,
        id: `e-${Date.now()}`,
        animated: true,
        style: { strokeDasharray: "6 6", stroke: "var(--heroui-primary, #3b82f6)", strokeWidth: 2.5 }
      }
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges]
  )

  // Node Selection Handler
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id)
    setIsRightSidebarExpanded(true)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
    setIsRightSidebarExpanded(false)
  }, [])

  // Open Canvas Builder in FULL SCREEN
  const handleOpenBuilder = (wf: any) => {
    setActiveWorkflow(JSON.parse(JSON.stringify(wf)))
    setNodes(wf.nodes || [])
    setEdges(wf.edges || wf.connections || [])
    setSelectedNodeId(null)
    setIsRightSidebarExpanded(false)
    setViewMode("builder")
  }

  // Confirm Create Workflow (Clean blueprint creation)
  const handleConfirmCreateWorkflow = () => {
    if (!newWfName.trim()) return
    const newId = `wf-${Date.now()}`

    const newWf = {
      id: newId,
      name: newWfName,
      description: newWfDesc || "Automated publishing workflow blueprint.",
      target_website: newWfTargetCms,
      status: "Draft",
      tags: newWfTags,
      nodes: [
        { id: "n-start", type: "customNode", position: { x: 100, y: 150 }, data: { label: "Trigger", category: "Start", typeName: "Trigger", config: { triggerTypes: ["Manual"] } } },
        { id: "n-end", type: "customNode", position: { x: 500, y: 150 }, data: { label: "End", category: "Start", typeName: "End", config: {} } }
      ],
      edges: [
        { id: "e-start-end", source: "n-start", target: "n-end", animated: true, style: { strokeDasharray: "6 6", stroke: "var(--heroui-primary, #3b82f6)", strokeWidth: 2.5 } }
      ]
    }

    setWorkflows((prev) => [newWf, ...prev])
    setIsCreateModalOpen(false)
    setNewWfName("")
    setNewWfDesc("")
    handleOpenBuilder(newWf)
  }

  // Tag Manager for Create Modal
  const handleAddModalTag = () => {
    if (newWfTagInput.trim() && !newWfTags.includes(newWfTagInput.trim())) {
      setNewWfTags([...newWfTags, newWfTagInput.trim()])
      setNewWfTagInput("")
    }
  }

  const handleRemoveModalTag = (tag: string) => {
    setNewWfTags(newWfTags.filter((t) => t !== tag))
  }

  // Apply Template inside Builder
  const handleApplyTemplateInBuilder = (tplId: string) => {
    const tpl = WORKFLOW_TEMPLATES.find((t) => t.id === tplId)
    if (!tpl) return
    setNodes(JSON.parse(JSON.stringify(tpl.nodes)))
    setEdges(JSON.parse(JSON.stringify(tpl.edges)))
    setSelectedNodeId(null)
    setIsRightSidebarExpanded(false)
    setIsTemplateModalOpen(false)
    setMsg(`Loaded template "${tpl.name}"`)
    setTimeout(() => setMsg(null), 3000)
  }

  // Add Node from Left Palette to Center Canvas
  const handleAddNodeToCanvas = (item: typeof PALETTE_NODE_ITEMS[0]) => {
    const newId = `node_${Math.random().toString(36).substring(2, 8)}`
    const newNode: Node = {
      id: newId,
      type: "customNode",
      position: { x: 300 + Math.random() * 80, y: 150 + Math.random() * 80 },
      data: {
        label: item.name,
        category: item.category,
        typeName: item.type,
        config: item.type === "Trigger"
          ? { triggerTypes: ["Manual"], variables: "payload, target_site", schedule: "Hourly" }
          : item.type === "Agent"
          ? { agentName: "SEO Copywriter Agent" }
          : item.type === "Publish"
          ? { website: activeWorkflow?.target_website || "TechPulse Daily", status: "Publish Immediately" }
          : {}
      }
    }
    setNodes((nds) => [...nds, newNode])
    setSelectedNodeId(newId)
    setIsRightSidebarExpanded(true)
  }

  const handleDeleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId))
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId))
    setSelectedNodeId(null)
    setIsRightSidebarExpanded(false)
  }, [selectedNodeId, setNodes, setEdges])

  const handleDuplicateSelectedNode = useCallback(() => {
    if (!selectedNodeId) return
    const target = nodes.find((n) => n.id === selectedNodeId)
    if (!target) return
    const newId = `node_${Math.random().toString(36).substring(2, 8)}`
    const dupNode: Node = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      position: { x: target.position.x + 40, y: target.position.y + 40 }
    }
    setNodes((nds) => [...nds, dupNode])
    setSelectedNodeId(newId)
    setIsRightSidebarExpanded(true)
  }, [selectedNodeId, nodes, setNodes])

  const handleSaveWorkflow = async () => {
    if (!activeWorkflow) return
    setSubmitting(true)
    const updatedWf = { ...activeWorkflow, nodes, edges }
    await updateWorkflow(activeWorkflow.id, updatedWf)
    setWorkflows((prev) => prev.map((w) => (w.id === activeWorkflow.id ? updatedWf : w)))
    setMsg(`Workflow "${activeWorkflow.name}" saved successfully!`)
    setSubmitting(false)
    setTimeout(() => setMsg(null), 3000)
  }

  const handlePublishWorkflow = async () => {
    if (!activeWorkflow) return
    setSubmitting(true)
    const updatedWf = { ...activeWorkflow, status: "Published", nodes, edges }
    setActiveWorkflow(updatedWf)
    await updateWorkflow(activeWorkflow.id, updatedWf)
    setWorkflows((prev) => prev.map((w) => (w.id === activeWorkflow.id ? updatedWf : w)))
    setMsg(`Workflow "${activeWorkflow.name}" published live!`)
    setSubmitting(false)
    setTimeout(() => setMsg(null), 3000)
  }

  // Selected Node Object
  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  const updateSelectedNodeConfig = (key: string, value: any) => {
    if (!selectedNodeId) return
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              config: { ...((n.data.config as Record<string, any>) || {}), [key]: value }
            }
          }
        }
        return n
      })
    )
  }

  const updateSelectedNodeName = (name: string) => {
    if (!selectedNodeId) return
    setNodes((nds) =>
      nds.map((n) => (n.id === selectedNodeId ? { ...n, data: { ...n.data, label: name } } : n))
    )
  }

  // Table Filtering
  const filteredWorkflows = workflows.filter((wf) => {
    const matchesSearch = wf.name.toLowerCase().includes(searchQuery.toLowerCase()) || (wf.description && wf.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesWebsite = websiteFilter === "all" || (wf.target_website || "TechPulse Daily") === websiteFilter
    const matchesStatus = statusFilter === "all" || (wf.status || "Draft") === statusFilter
    return matchesSearch && matchesWebsite && matchesStatus
  })

  const paginatedWorkflows = filteredWorkflows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const filteredPaletteItems = PALETTE_NODE_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(paletteSearchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(paletteSearchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(paletteSearchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {msg && (
        <div className="p-3.5 bg-success-50 border border-success-200 text-success-700 text-xs rounded-2xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="size-4 shrink-0 text-success" />
          <span className="font-semibold">{msg}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 1. WORKFLOW LIST VIEW MODE                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === "list" && (
        <div className="space-y-6">
          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            searchPlaceholder="Search workflows by name, description or tags..."
            actions={
              selectedIds.size > 0 ? (
                <Button size="sm" onPress={() => { setWorkflows((prev) => prev.filter((w) => !selectedIds.has(w.id))); setSelectedIds(new Set()); }} className="bg-danger-500 text-white font-bold">
                  <Trash2 className="size-4" /> Delete ({selectedIds.size})
                </Button>
              ) : null
            }
            filters={
              <div className="flex items-center gap-2">
                <Select selectedKey={websiteFilter} onSelectionChange={(key) => key && setWebsiteFilter(key as string)} className="w-44" aria-label="Website Filter">
                  <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="all">All Websites</ListBox.Item>
                      {DEMO_WEBSITES.map((site) => (<ListBox.Item key={site} id={site}>{site}</ListBox.Item>))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select selectedKey={statusFilter} onSelectionChange={(key) => key && setStatusFilter(key as string)} className="w-36" aria-label="Status Filter">
                  <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="all">All Statuses</ListBox.Item>
                      <ListBox.Item id="Published">Published</ListBox.Item>
                      <ListBox.Item id="Draft">Draft</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            }
          />

          <div className="space-y-3">
            <Table>
              <Table.ScrollContainer>
                <Table.Content
                  aria-label="Workflows table"
                  selectedKeys={selectedIds as any}
                  selectionMode="multiple"
                  onSelectionChange={(keys) => {
                    if (keys === "all") {
                      setSelectedIds(new Set(filteredWorkflows.map((w) => w.id)))
                    } else {
                      setSelectedIds(new Set(Array.from(keys) as string[]))
                    }
                  }}
                >
                  <Table.Header>
                    <Table.Column className="pe-0">
                      <Checkbox aria-label="Select all workflows" slot="selection">
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        </Checkbox.Content>
                      </Checkbox>
                    </Table.Column>
                    <Table.Column isRowHeader>Workflow</Table.Column>
                    <Table.Column>Website</Table.Column>
                    <Table.Column>Trigger</Table.Column>
                    <Table.Column>Status</Table.Column>
                    <Table.Column>Updated</Table.Column>
                    <Table.Column className="text-right">Actions</Table.Column>
                  </Table.Header>
                  <Table.Body items={paginatedWorkflows}>
                    {(wf) => (
                      <Table.Row key={wf.id} id={wf.id} className="hover:bg-content2/40 cursor-pointer" onClick={() => handleOpenBuilder(wf)}>
                        <Table.Cell className="pe-0" onClick={(e) => e.stopPropagation()}>
                          <Checkbox aria-label={`Select ${wf.name}`} slot="selection">
                            <Checkbox.Content>
                              <Checkbox.Control>
                                <Checkbox.Indicator />
                              </Checkbox.Control>
                            </Checkbox.Content>
                          </Checkbox>
                        </Table.Cell>

                        <Table.Cell>
                          <div className="font-bold text-xs text-foreground">{wf.name}</div>
                        </Table.Cell>

                        <Table.Cell>
                          <Chip size="sm" variant="soft" color="accent" className="text-xs font-medium">
                            {wf.target_website}
                          </Chip>
                        </Table.Cell>

                        <Table.Cell>
                          <Chip size="sm" variant="soft" color="accent" className="text-xs font-bold">
                            {wf.trigger || "Schedule (Hourly)"}
                          </Chip>
                        </Table.Cell>

                        <Table.Cell>
                          <Chip size="sm" color={wf.status === "Published" ? "success" : "warning"} variant="soft" className="text-xs font-semibold">
                            {wf.status}
                          </Chip>
                        </Table.Cell>

                        <Table.Cell className="text-xs text-default-400 font-mono">
                          {wf.updated_at || "Just now"}
                        </Table.Cell>

                        <Table.Cell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <TableRowActions
                            id={wf.id}
                            name={wf.name}
                            onEdit={() => handleOpenBuilder(wf)}
                            onDelete={async () => {
                              await deleteWorkflow(wf.id)
                              setWorkflows((prev) => prev.filter((w) => w.id !== wf.id))
                            }}
                            onView={() => handleOpenBuilder(wf)}
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
              totalPages={Math.ceil(filteredWorkflows.length / pageSize)}
              pageSize={pageSize}
              totalItems={filteredWorkflows.length}
              itemLabel="workflows"
              onPageChange={(p) => setCurrentPage(p)}
              onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 2. FULL SCREEN WORKFLOW BUILDER VIEW (HERO UI SEMANTIC SURFACES)       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === "builder" && activeWorkflow && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background h-screen w-screen overflow-hidden text-foreground">
          {/* TOP CANVAS TOOLBAR */}
          <div className="h-16 border-b border-divider bg-content1/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-30 shadow-xs">
            <div className="flex items-center gap-4">
              <Button size="sm" variant="outline" onPress={() => setViewMode("list")} className="font-semibold text-xs border-divider">
                <ArrowLeft className="size-4" /> Exit Builder
              </Button>
              <div className="h-6 w-px bg-divider" />
              <div>
                <h3 className="font-extrabold text-foreground text-base flex items-center gap-2.5">
                  {activeWorkflow.name}
                  <Chip size="sm" color={activeWorkflow.status === "Published" ? "success" : "warning"} variant="soft" className="text-[10px] h-5 font-extrabold">
                    {activeWorkflow.status}
                  </Chip>
                </h3>
                <p className="text-xs text-default-500 font-medium">Target CMS: {activeWorkflow.target_website}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onPress={() => setIsTemplateModalOpen(true)} className="text-xs font-bold border-divider">
                <LayoutTemplate className="size-4 text-secondary" /> Load Template
              </Button>
              <Button size="sm" variant="tertiary" onPress={handleSaveWorkflow} isPending={submitting} className="text-xs font-bold">
                <Save className="size-4" /> Save Graph
              </Button>
              <Button size="sm" variant="primary" className="font-extrabold text-xs px-5 shadow-sm" onPress={handlePublishWorkflow} isPending={submitting}>
                <Play className="size-4 fill-current" /> Publish Live
              </Button>
            </div>
          </div>

          {/* MAIN CANVAS BODY WITH SIDEBARS */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* LEFT SIDEBAR: PALETTE NODES */}
            <div
              className={`border-r border-divider bg-content1 backdrop-blur-md flex flex-col transition-all duration-300 z-20 shrink-0 shadow-sm ${
                isLeftSidebarExpanded ? "w-80" : "w-16"
              }`}
            >
              <div className="p-3.5 border-b border-divider flex items-center justify-between bg-content2/50">
                {isLeftSidebarExpanded ? (
                  <span className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Layers className="size-4 text-primary" /> Workflow Palette
                  </span>
                ) : (
                  <span className="text-xs font-bold text-default-400 mx-auto">Nodes</span>
                )}
                <Button size="sm" variant="ghost" isIconOnly onPress={() => setIsLeftSidebarExpanded(!isLeftSidebarExpanded)}>
                  {isLeftSidebarExpanded ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
                </Button>
              </div>

              {isLeftSidebarExpanded ? (
                <>
                  <div className="p-3 border-b border-divider bg-content2/30">
                    <div className="relative">
                      <Search className="size-3.5 text-default-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        placeholder="Search nodes..."
                        value={paletteSearchQuery}
                        onChange={(e) => setPaletteSearchQuery(e.target.value)}
                        className="w-full pl-9 text-xs bg-content1 border border-divider"
                      />
                    </div>
                  </div>

                  {/* SMOOTH HOVER SCROLLBAR PALETTE BODY */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-content1 scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-default-300 transition-colors">
                    {(["Start", "Main", "Condition"] as const).map((cat) => {
                      const items = filteredPaletteItems.filter((i) => i.category === cat)
                      if (items.length === 0) return null

                      const badgeColor = cat === "Start" ? "warning" : cat === "Condition" ? "accent" : "default"

                      return (
                        <div key={cat} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold text-default-500 uppercase tracking-wider">{cat} Nodes</span>
                            <Chip size="sm" color={badgeColor} variant="soft" className="text-[9px] h-4 font-extrabold">
                              ★ {cat}
                            </Chip>
                          </div>

                          <div className="space-y-2">
                            {items.map((item) => {
                              const IconC = item.icon
                              return (
                                <div
                                  key={item.type}
                                  onClick={() => handleAddNodeToCanvas(item)}
                                  className="p-3.5 rounded-2xl border border-divider bg-content2/70 hover:bg-content2 hover:border-primary/60 cursor-pointer transition-all hover:scale-[1.01] shadow-2xs group"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                                      <IconC className="size-4 text-primary shrink-0" />
                                      {item.name}
                                    </span>
                                    <Plus className="size-3.5 text-default-400 group-hover:text-primary transition-colors" />
                                  </div>
                                  <p className="text-[11px] text-default-500 leading-snug">{item.desc}</p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                /* COLLAPSED SIDEBAR WITH HERO UI TOOLTIPS */
                <div className="flex-1 overflow-y-auto py-4 flex flex-col items-center gap-3 bg-content1">
                  {PALETTE_NODE_ITEMS.map((item) => {
                    const IconC = item.icon
                    const isStart = item.category === "Start"
                    const isCondition = item.category === "Condition"
                    const iconColorClass = isStart ? "text-warning hover:bg-warning-50/20" : isCondition ? "text-secondary hover:bg-secondary-50/20" : "text-primary hover:bg-primary-50/20"

                    return (
                      <Tooltip key={item.type} delay={0}>
                        <button
                          onClick={() => handleAddNodeToCanvas(item)}
                          className={`p-3 rounded-2xl border border-divider bg-content2 transition-all hover:scale-110 shadow-xs ${iconColorClass}`}
                        >
                          <IconC className="size-4" />
                        </button>
                        <Tooltip.Content placement="right">
                          <div className="p-2 max-w-xs space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-foreground">{item.name}</span>
                              <Chip size="sm" variant="soft" color={isStart ? "warning" : isCondition ? "accent" : "default"} className="text-[9px] h-4">
                                {item.category}
                              </Chip>
                            </div>
                            <p className="text-[11px] text-default-500 leading-tight">{item.desc}</p>
                          </div>
                        </Tooltip.Content>
                      </Tooltip>
                    )
                  })}
                </div>
              )}
            </div>

            {/* CENTER CANVAS BOX WITH SUBTLE GRAY BACKGROUND */}
            <div className="flex-1 h-full bg-content2/50 relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.2}
                maxZoom={2}
                defaultEdgeOptions={{
                  type: "smoothstep",
                  animated: true,
                  style: { strokeDasharray: "6 6", stroke: "var(--heroui-primary, #3b82f6)", strokeWidth: 2.5 }
                }}
              >
                <Background variant={BackgroundVariant.Dots} gap={24} size={1.8} color="#94a3b844" />
                <Controls position="bottom-left" showInteractive={false} className="!bg-content1 !border-divider !shadow-lg !rounded-2xl !text-foreground" />
                <MiniMap
                  position="bottom-right"
                  nodeColor={(node) => {
                    const cat = node.data?.category as string
                    if (cat === "Start") return "#f59e0b"
                    if (cat === "Condition") return "#a855f7"
                    return "#3b82f6"
                  }}
                  className="!bg-content1/90 !border-divider !rounded-2xl !shadow-xl"
                  zoomable
                  pannable
                />
              </ReactFlow>
            </div>

            {/* RIGHT SIDEBAR: CLICK-TRIGGERED CONFIGURATION PANEL */}
            <div
              className={`border-l border-divider bg-content1 backdrop-blur-md flex flex-col transition-all duration-300 z-20 shrink-0 shadow-lg ${
                isRightSidebarExpanded ? "w-80" : "w-0 overflow-hidden"
              }`}
            >
              <div className="p-3.5 border-b border-divider flex items-center justify-between bg-content2/50">
                <span className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Sliders className="size-4 text-primary" /> Node Configuration
                </span>
                <Button size="sm" variant="ghost" isIconOnly onPress={() => setIsRightSidebarExpanded(false)}>
                  <XCircle className="size-4" />
                </Button>
              </div>

              {selectedNode ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-content1">
                  <div className="space-y-2">
                    <FormLabel info="Display title of this workflow node">Node Name</FormLabel>
                    <Input
                      value={(selectedNode.data.label as string) || ""}
                      onChange={(e) => updateSelectedNodeName(e.target.value)}
                      className="w-full font-bold bg-content2 border border-divider text-foreground"
                    />
                  </div>

                  {/* DYNAMIC CONFIGURATION BY NODE TYPE */}
                  {selectedNode.data.typeName === "Trigger" && (
                    <div className="space-y-4">
                      <div>
                        <FormLabel info="Select one or more methods used to trigger this workflow">Trigger Type</FormLabel>
                        <div className="space-y-2 mt-2">
                          {["Manual", "Schedule", "API", "Webhook", "Integration", "Fetch"].map((tt) => {
                            const cur = (selectedNode.data.config as any)?.triggerTypes || []
                            const isChecked = cur.includes(tt)
                            return (
                              <label key={tt} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-divider bg-content2/60 cursor-pointer hover:bg-content2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const next = e.target.checked ? [...cur, tt] : cur.filter((x: string) => x !== tt)
                                    updateSelectedNodeConfig("triggerTypes", next)
                                  }}
                                  className="rounded border-default-300 text-primary focus:ring-primary"
                                />
                                <span className="text-xs font-bold text-foreground">{tt}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <FormLabel info="Configure execution frequency for schedule triggers">Cron Schedule</FormLabel>
                        <Select
                          selectedKey={(selectedNode.data.config as any)?.schedule || "Hourly"}
                          onSelectionChange={(key) => key && updateSelectedNodeConfig("schedule", key as string)}
                          className="w-full"
                          aria-label="Cron Schedule"
                        >
                          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              <ListBox.Item id="Every 15 mins">Every 15 mins</ListBox.Item>
                              <ListBox.Item id="Hourly">Hourly</ListBox.Item>
                              <ListBox.Item id="Daily">Daily at Midnight</ListBox.Item>
                              <ListBox.Item id="Weekly">Weekly</ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedNode.data.typeName === "Agent" && (
                    <div className="space-y-4">
                      <div>
                        <FormLabel info="Select which specialized AI agent will process this step">AI Agent Persona</FormLabel>
                        <Select
                          selectedKey={(selectedNode.data.config as any)?.agentName || "SEO Copywriter Agent"}
                          onSelectionChange={(key) => key && updateSelectedNodeConfig("agentName", key as string)}
                          className="w-full"
                          aria-label="AI Agent Persona"
                        >
                          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              <ListBox.Item id="SEO Copywriter Agent">SEO Copywriter Agent</ListBox.Item>
                              <ListBox.Item id="SERP Keyword Extractor">SERP Keyword Extractor</ListBox.Item>
                              <ListBox.Item id="Polyglot Translator">Polyglot Translator</ListBox.Item>
                              {customAgents.map((ag) => (
                                <ListBox.Item key={ag.id} id={ag.name}>{ag.name}</ListBox.Item>
                              ))}
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedNode.data.typeName === "Publish" && (
                    <div className="space-y-4">
                      <div>
                        <FormLabel info="Select destination CMS website">Target CMS Website</FormLabel>
                        <Select
                          selectedKey={(selectedNode.data.config as any)?.website || "TechPulse Daily"}
                          onSelectionChange={(key) => key && updateSelectedNodeConfig("website", key as string)}
                          className="w-full"
                          aria-label="Target CMS Website"
                        >
                          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              {DEMO_WEBSITES.map((site) => (
                                <ListBox.Item key={site} id={site}>{site}</ListBox.Item>
                              ))}
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedNode.data.typeName === "Condition" && (
                    <div className="space-y-4">
                      <div>
                        <FormLabel info="Evaluation expression rule">Condition Rule</FormLabel>
                        <Input
                          value={(selectedNode.data.config as any)?.rule || "{{word_count}} > 1000"}
                          onChange={(e) => updateSelectedNodeConfig("rule", e.target.value)}
                          className="w-full font-mono text-xs bg-content2 border border-divider text-foreground"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-divider flex items-center justify-between">
                    <Button size="sm" variant="tertiary" onPress={handleDuplicateSelectedNode} className="text-xs font-bold">
                      <Copy className="size-3.5" /> Duplicate Node
                    </Button>
                    <Button size="sm" variant="danger-soft" onPress={handleDeleteSelectedNode} className="text-xs font-bold">
                      <Trash2 className="size-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-default-400 space-y-2 bg-content1">
                  <Info className="size-8 mx-auto" />
                  <p className="text-xs">Click any node on the canvas to configure parameters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 3. REDESIGNED POPUP MODAL (HERO UI SEMANTIC SURFACE CONTRAST)         */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-content1 border border-divider rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-foreground">
            {/* Modal Header */}
            <div className="p-5 border-b border-divider flex items-center justify-between bg-content2/60">
              <h3 className="font-extrabold text-foreground text-base flex items-center gap-2.5">
                <GitBranch className="size-5 text-primary" /> Create New Workflow Blueprint
              </h3>
              <Button size="sm" variant="ghost" isIconOnly onPress={() => setIsCreateModalOpen(false)}>
                <XCircle className="size-5 text-default-400" />
              </Button>
            </div>

            {/* Modal Content - Exactly the requested fields */}
            <div className="p-6 space-y-5 bg-content1">
              {/* 1. Workflow Name */}
              <div className="space-y-1.5">
                <FormLabel info="Unique name used to identify the workflow.">Workflow Name</FormLabel>
                <Input
                  placeholder="e.g. Autonomous Tech Newsroom Blueprint"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full bg-content2 border border-divider text-foreground font-semibold"
                />
              </div>

              {/* 2. Description */}
              <div className="space-y-1.5">
                <FormLabel info="Short explanation describing the workflow.">Description</FormLabel>
                <Input
                  placeholder="Short explanation describing the workflow..."
                  value={newWfDesc}
                  onChange={(e) => setNewWfDesc(e.target.value)}
                  className="w-full bg-content2 border border-divider text-foreground font-medium"
                />
              </div>

              {/* 3. Target Website */}
              <div className="space-y-1.5">
                <FormLabel info="Select the website this workflow belongs to.">Target Website</FormLabel>
                <Select
                  selectedKey={newWfTargetCms}
                  onSelectionChange={(key) => key && setNewWfTargetCms(key as string)}
                  className="w-full"
                  aria-label="Target Website"
                >
                  <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {DEMO_WEBSITES.map((site) => (
                        <ListBox.Item key={site} id={site}>{site}</ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* 4. Tags */}
              <div className="space-y-1.5">
                <FormLabel info="Used for searching, filtering and organizing workflows.">Tags</FormLabel>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add tag (e.g. SEO, Autonomous)..."
                    value={newWfTagInput}
                    onChange={(e) => setNewWfTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddModalTag())}
                    className="flex-1 bg-content2 border border-divider text-foreground text-xs"
                  />
                  <Button size="sm" variant="tertiary" onPress={handleAddModalTag} className="font-bold">
                    <Plus className="size-3.5" /> Add Tag
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {newWfTags.map((tag) => (
                    <Chip key={tag} size="sm" variant="soft" color="accent" className="text-xs font-semibold">
                      {tag}
                      <button onClick={() => handleRemoveModalTag(tag)} className="ml-1 text-default-400 hover:text-danger">
                        ×
                      </button>
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-divider flex items-center justify-end gap-3 bg-content2/60">
              <Button size="sm" variant="outline" onPress={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onPress={handleConfirmCreateWorkflow} isDisabled={!newWfName.trim()} className="font-extrabold px-6 shadow-sm">
                Create & Open Builder
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 4. TEMPLATE MODAL PICKER INSIDE BUILDER                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-content1 border border-divider rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl text-foreground">
            <div className="p-5 border-b border-divider flex items-center justify-between bg-content2/60">
              <h3 className="font-extrabold text-foreground text-base flex items-center gap-2.5">
                <LayoutTemplate className="size-5 text-secondary" /> Workflow Templates
              </h3>
              <Button size="sm" variant="ghost" isIconOnly onPress={() => setIsTemplateModalOpen(false)}>
                <XCircle className="size-5 text-default-400" />
              </Button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto bg-content1">
              {WORKFLOW_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className="p-4 rounded-2xl border border-divider bg-content2/70 hover:bg-content2 hover:border-primary/50 transition-all flex items-center justify-between">
                  <div className="space-y-1 max-w-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-foreground">{tpl.name}</span>
                      <Chip size="sm" variant="soft" color="accent" className="text-[10px] font-bold">
                        {tpl.tag}
                      </Chip>
                    </div>
                    <p className="text-xs text-default-500">{tpl.desc}</p>
                  </div>
                  <Button size="sm" variant="tertiary" onPress={() => handleApplyTemplateInBuilder(tpl.id)} className="font-bold">
                    Load Template
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
