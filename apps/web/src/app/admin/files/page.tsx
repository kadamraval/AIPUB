"use client"

import React, { useState, useEffect } from "react"
import {
  Card, CardContent, Button, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Modal, Select, ListBox, Tooltip, Popover
} from "@heroui/react"
import {
  Folder, FolderPlus, FolderTree, FileText, Image as ImageIcon, Video, FileCode, Download, Upload, Trash2, Eye, ChevronRight, ChevronDown, Search, LayoutGrid, Table as TableIcon, HardDrive, Clock, X, Info, Check, Plus
} from "lucide-react"
import { fetchWebsites } from "@/lib/api"

export const dynamic = "force-dynamic"

// Default Websites/Company Root Folders if API returns empty
const INITIAL_WEBSITES = [
  { id: "site-1", name: "AI News", domain: "ainews.com" },
  { id: "site-2", name: "Health Blog", domain: "healthblog.org" },
  { id: "site-3", name: "Travel Guide", domain: "travelguide.io" }
]

// Standard subfolders inside every Root Folder
const STANDARD_SUBFOLDERS = ["Articles", "Images", "Videos", "Documents", "Downloads"]

// Folder Color Presets
const FOLDER_COLORS = [
  { id: "amber", label: "Gold", hex: "#f59e0b", class: "text-amber-500 fill-amber-500/20", bg: "bg-amber-500" },
  { id: "blue", label: "Blue", hex: "#3b82f6", class: "text-blue-500 fill-blue-500/20", bg: "bg-blue-500" },
  { id: "emerald", label: "Green", hex: "#10b981", class: "text-emerald-500 fill-emerald-500/20", bg: "bg-emerald-500" },
  { id: "purple", label: "Purple", hex: "#a855f7", class: "text-purple-500 fill-purple-500/20", bg: "bg-purple-500" },
  { id: "indigo", label: "Indigo", hex: "#6366f1", class: "text-indigo-500 fill-indigo-500/20", bg: "bg-indigo-500" },
  { id: "rose", label: "Rose", hex: "#f43f5e", class: "text-rose-500 fill-rose-500/20", bg: "bg-rose-500" }
]

// Initial Sample Files
const INITIAL_FILES = [
  {
    id: "f-1",
    name: "autonomous_agent_architecture.png",
    type: "Images",
    ext: "PNG",
    size: "2.4 MB",
    sizeBytes: 2516582,
    website: "AI News",
    folder: "Images",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    article: "The Future of Autonomous AI Agents",
    date: "2026-08-04",
    provider: "fal.ai FLUX"
  },
  {
    id: "f-2",
    name: "enterprise_seo_clusters_2026.pdf",
    type: "Documents",
    ext: "PDF",
    size: "4.8 MB",
    sizeBytes: 5033164,
    website: "AI News",
    folder: "Documents",
    url: "",
    article: "Top 10 High-Volume SEO Strategies",
    date: "2026-08-03",
    provider: "OpenAI DocGen"
  },
  {
    id: "f-3",
    name: "nutrition_and_longevity_report.docx",
    type: "Documents",
    ext: "DOCX",
    size: "1.2 MB",
    sizeBytes: 1258291,
    website: "Health Blog",
    folder: "Documents",
    url: "",
    article: "Science-Backed Longevity Habits",
    date: "2026-08-02",
    provider: "Internal Upload"
  },
  {
    id: "f-4",
    name: "mediterranean_diet_hero.jpg",
    type: "Images",
    ext: "JPG",
    size: "1.8 MB",
    sizeBytes: 1887436,
    website: "Health Blog",
    folder: "Images",
    url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80",
    article: "Mediterranean Diet Essentials",
    date: "2026-08-01",
    provider: "Freepik API"
  },
  {
    id: "f-5",
    name: "kyoto_travel_vlog_preview.mp4",
    type: "Videos",
    ext: "MP4",
    size: "24.5 MB",
    sizeBytes: 25690112,
    website: "Travel Guide",
    folder: "Videos",
    url: "",
    article: "7 Hidden Gems in Kyoto, Japan",
    date: "2026-07-28",
    provider: "Runway Gen-2"
  },
  {
    id: "f-6",
    name: "tokyo_itinerary_map.png",
    type: "Images",
    ext: "PNG",
    size: "3.1 MB",
    sizeBytes: 3250585,
    website: "Travel Guide",
    folder: "Images",
    url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80",
    article: "Ultimate 5-Day Tokyo Guide",
    date: "2026-07-25",
    provider: "fal.ai FLUX"
  }
]

export default function FilesPage() {
  const [websites, setWebsites] = useState<any[]>(INITIAL_WEBSITES)
  const [files, setFiles] = useState<any[]>(INITIAL_FILES)
  const [customFolders, setCustomFolders] = useState<{ id: string; name: string; website: string; color?: string; customHex?: string }[]>([
    { id: "cf-1", name: "Infographics", website: "AI News", color: "purple" },
    { id: "cf-2", name: "Vlog B-Roll", website: "Travel Guide", color: "blue" }
  ])

  // Active View State
  const [activeView, setActiveView] = useState<{
    type: "global" | "folder"
    filter?: string
    folderName?: string
    subfolder?: string
  }>({ type: "global", filter: "All" })

  // Selection & Multi-Delete State
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set())

  // Controls & Toolbar State
  const [searchQuery, setSearchQuery] = useState("")
  const [fileTypeFilter, setFileTypeFilter] = useState("all")
  const [sortField, setSortField] = useState<"date" | "name" | "size">("date")
  const [sortAsc, setSortAsc] = useState(false)
  const [displayMode, setDisplayMode] = useState<"grid" | "table">("grid")

  // Selected File Details Drawer State
  const [inspectedFile, setInspectedFile] = useState<any | null>(null)

  // Modals & Context State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false)
  const [modalSource, setModalSource] = useState<"sidebar" | "header">("header")
  
  // Create Folder Form State
  const [newFolderName, setNewFolderName] = useState("")
  const [targetFolderForNew, setTargetFolderForNew] = useState("Global / Custom")
  const [folderSelectSearch, setFolderSelectSearch] = useState("")
  const [selectedFolderColor, setSelectedFolderColor] = useState("amber")
  const [customHexColor, setCustomHexColor] = useState("#06b6d4")

  // Upload Form State
  const [uploadFolder, setUploadFolder] = useState(INITIAL_WEBSITES[0].name)
  const [uploadSubfolder, setUploadSubfolder] = useState("Images")
  const [uploadFileName, setUploadFileName] = useState("")
  const [uploadFileUrl, setUploadFileUrl] = useState("")

  // Helper to open Create Folder Modal with Context Awareness
  const openNewFolderModal = (source: "sidebar" | "header") => {
    setModalSource(source)
    if (source === "sidebar") {
      setTargetFolderForNew("Global / Custom")
    } else {
      if (activeView.type === "folder" && activeView.folderName) {
        setTargetFolderForNew(activeView.folderName)
      } else {
        setTargetFolderForNew("Global / Custom")
      }
    }
    setIsNewFolderModalOpen(true)
  }

  // Load Websites from API & Header Event Listeners
  useEffect(() => {
    async function loadSites() {
      const data = await fetchWebsites()
      if (data && data.length > 0) {
        setWebsites(data.map((w: any) => ({ id: w.id, name: w.name, domain: w.domain || "" })))
      }
    }
    loadSites()

    const handleOpenUpload = () => setIsUploadModalOpen(true)
    const handleOpenCreateFolder = () => openNewFolderModal("header")
    const handleFilter = (e: any) => setFileTypeFilter(e.detail || "all")
    const handleSort = (e: any) => {
      if (e.detail?.field) setSortField(e.detail.field)
      if (e.detail?.asc !== undefined) setSortAsc(e.detail.asc)
    }
    const handleView = (e: any) => setDisplayMode(e.detail === "table" ? "table" : "grid")

    window.addEventListener("open-admin-modal", handleOpenUpload)
    window.addEventListener("open-create-folder-modal", handleOpenCreateFolder)
    window.addEventListener("header-filter-change", handleFilter)
    window.addEventListener("header-sort-change", handleSort)
    window.addEventListener("header-view-change", handleView)

    return () => {
      window.removeEventListener("open-admin-modal", handleOpenUpload)
      window.removeEventListener("open-create-folder-modal", handleOpenCreateFolder)
      window.removeEventListener("header-filter-change", handleFilter)
      window.removeEventListener("header-sort-change", handleSort)
      window.removeEventListener("header-view-change", handleView)
    }
  }, [activeView])

  // Create Custom Folder handler
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return
    const preset = FOLDER_COLORS.find(c => c.id === selectedFolderColor)
    const newF = {
      id: `cf-${Date.now()}`,
      name: newFolderName.trim(),
      website: targetFolderForNew,
      color: selectedFolderColor,
      customHex: selectedFolderColor === "custom" ? customHexColor : (preset?.hex || "#f59e0b")
    }
    setCustomFolders((prev) => [...prev, newF])
    setNewFolderName("")
    setFolderSelectSearch("")
    setIsNewFolderModalOpen(false)
  }

  // Upload Submit handler
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFileName.trim()) return
    const ext = uploadFileName.split(".").pop()?.toUpperCase() || "FILE"
    const newFile = {
      id: `f-${Date.now()}`,
      name: uploadFileName.trim(),
      type: uploadSubfolder,
      ext: ext,
      size: "2.1 MB",
      sizeBytes: 2202009,
      website: uploadFolder,
      folder: uploadSubfolder,
      url: uploadFileUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      article: "Asset Upload",
      date: new Date().toISOString().split("T")[0],
      provider: "Manual Upload"
    }
    setFiles((prev) => [newFile, ...prev])
    setUploadFileName("")
    setUploadFileUrl("")
    setIsUploadModalOpen(false)
  }

  // Delete Single File handler
  const handleDeleteFile = (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    if (inspectedFile?.id === fileId) setInspectedFile(null)
    setSelectedFileIds((prev) => {
      const next = new Set(prev)
      next.delete(fileId)
      return next
    })
  }

  // Multi-Select Handlers
  const toggleSelectFile = (fileId: string) => {
    setSelectedFileIds((prev) => {
      const next = new Set(prev)
      if (next.has(fileId)) {
        next.delete(fileId)
      } else {
        next.add(fileId)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedFileIds.size === filteredFiles.length) {
      setSelectedFileIds(new Set())
    } else {
      setSelectedFileIds(new Set(filteredFiles.map((f) => f.id)))
    }
  }

  const handleBulkDelete = () => {
    if (selectedFileIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedFileIds.size} selected file(s)?`)) return
    setFiles((prev) => prev.filter((f) => !selectedFileIds.has(f.id)))
    if (inspectedFile && selectedFileIds.has(inspectedFile.id)) setInspectedFile(null)
    setSelectedFileIds(new Set())
  }

  // Filter Files Logic
  const filteredFiles = files.filter((file) => {
    if (activeView.type === "global") {
      const f = activeView.filter
      if (f === "History") {
        // Recent files
      } else if (f !== "All") {
        if (file.type?.toLowerCase() !== f?.toLowerCase()) return false
      }
    } else if (activeView.type === "folder") {
      if (file.website !== activeView.folderName) return false
      if (activeView.subfolder && file.folder !== activeView.subfolder) return false
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchName = file.name.toLowerCase().includes(q)
      const matchFolder = file.website.toLowerCase().includes(q)
      const matchType = file.type.toLowerCase().includes(q)
      if (!matchName && !matchFolder && !matchType) return false
    }

    if (fileTypeFilter !== "all") {
      if (fileTypeFilter === "images" && file.type !== "Images") return false
      if (fileTypeFilter === "videos" && file.type !== "Videos") return false
      if (fileTypeFilter === "documents" && file.type !== "Documents") return false
    }

    return true
  }).sort((a, b) => {
    if (sortField === "name") {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    }
    if (sortField === "size") {
      return sortAsc ? a.sizeBytes - b.sizeBytes : b.sizeBytes - a.sizeBytes
    }
    return sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
  })

  // Get File Icon helper
  const getFileIcon = (type: string) => {
    switch (type) {
      case "Images": return <ImageIcon className="size-8 text-blue-500" />
      case "Videos": return <Video className="size-8 text-purple-500" />
      case "Documents": return <FileText className="size-8 text-emerald-500" />
      default: return <FileCode className="size-8 text-amber-500" />
    }
  }

  // Get Folder Color class helper
  const getFolderColorClass = (colorName?: string) => {
    const found = FOLDER_COLORS.find(c => c.id === colorName)
    return found ? found.class : "text-amber-500 fill-amber-500/20"
  }

  // Folders to render in Workspace:
  const isHistoryView = activeView.type === "global" && activeView.filter === "History"
  const isInsideSubfolder = activeView.type === "folder" && Boolean(activeView.subfolder)
  
  const foldersToDisplayInWorkspace = (() => {
    if (isHistoryView || isInsideSubfolder) return []
    if (activeView.type === "global" && activeView.filter === "All") {
      const rootFolders = websites.map((site) => ({
        id: site.id,
        name: site.name,
        type: "root",
        colorClass: "text-amber-500 fill-amber-500/20",
        customHex: undefined,
        targetWebsite: site.name,
        targetSubfolder: undefined
      }))
      const customRootFolders = customFolders.map((cf) => ({
        id: cf.id,
        name: cf.name,
        type: "custom",
        colorClass: cf.color === "custom" ? "" : getFolderColorClass(cf.color),
        customHex: cf.color === "custom" ? cf.customHex : (FOLDER_COLORS.find(c => c.id === cf.color)?.hex),
        targetWebsite: cf.website === "Global / Custom" ? (websites[0]?.name || "AI News") : cf.website,
        targetSubfolder: cf.name
      }))
      return [...rootFolders, ...customRootFolders]
    }
    if (activeView.type === "folder" && activeView.folderName && !activeView.subfolder) {
      const siteName = activeView.folderName
      const standard = STANDARD_SUBFOLDERS.map((sub) => ({
        id: `${siteName}-${sub}`,
        name: sub,
        type: "sub",
        colorClass: "text-amber-500 fill-amber-500/20",
        customHex: undefined,
        targetWebsite: siteName,
        targetSubfolder: sub
      }))
      const custom = customFolders.filter(cf => cf.website === siteName || cf.website === "Global / Custom").map((cf) => ({
        id: cf.id,
        name: cf.name,
        type: "custom",
        colorClass: cf.color === "custom" ? "" : getFolderColorClass(cf.color),
        customHex: cf.color === "custom" ? cf.customHex : (FOLDER_COLORS.find(c => c.id === cf.color)?.hex),
        targetWebsite: siteName,
        targetSubfolder: cf.name
      }))
      return [...standard, ...custom]
    }
    return []
  })()

  const filteredTargetWebsites = websites.filter((w) =>
    w.name.toLowerCase().includes(folderSelectSearch.toLowerCase())
  )

  return (
    <div className="-m-6 h-[calc(100vh-3.5rem)] flex overflow-hidden border-t border-divider bg-background">
      
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 1. 2ND SIDEBAR                                                        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <aside className="w-64 bg-content1 border-r border-divider flex flex-col shrink-0 overflow-hidden">
        
        {/* Navigation Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs scrollbar-thin">
          
          {/* TOP: QUICK VIEWS */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-bold text-default-400 uppercase tracking-wider">
              Quick Views
            </div>

            {["All", "History", "Articles", "Images", "Videos", "Documents", "Downloads"].map((filterName) => {
              const isGlobalActive = activeView.type === "global" && activeView.filter === filterName
              return (
                <div
                  key={filterName}
                  onClick={() => setActiveView({ type: "global", filter: filterName })}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors text-xs ${
                    isGlobalActive ? "bg-foreground text-background font-semibold" : "text-default-500 hover:text-foreground hover:bg-default-100/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {filterName === "All" && <HardDrive className="size-3.5" />}
                    {filterName === "History" && <Clock className="size-3.5" />}
                    {filterName === "Articles" && <FileText className="size-3.5" />}
                    {filterName === "Images" && <ImageIcon className="size-3.5" />}
                    {filterName === "Videos" && <Video className="size-3.5" />}
                    {filterName === "Documents" && <FileCode className="size-3.5" />}
                    {filterName === "Downloads" && <Download className="size-3.5" />}
                    <span>{filterName}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* DIVIDER */}
          <div className="border-t border-divider my-2" />

          {/* BOTTOM: FOLDERS SECTION */}
          <div className="space-y-1">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-[11px] font-bold text-default-400 uppercase tracking-wider">
                Folders
              </span>
              <Tooltip>
                <Tooltip.Trigger>
                  <button
                    type="button"
                    onClick={() => openNewFolderModal("sidebar")}
                    className="p-1 rounded-lg text-default-400 hover:text-foreground hover:bg-default-100 transition-colors"
                  >
                    <FolderPlus className="size-3.5" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content placement="top">Add Folder</Tooltip.Content>
              </Tooltip>
            </div>

            {/* DEFAULT ALL FOLDERS OPTION */}
            <div
              onClick={() => setActiveView({ type: "global", filter: "All" })}
              className={`flex items-center justify-between px-2 py-1.5 rounded-xl cursor-pointer transition-colors ${
                activeView.type === "global" && activeView.filter === "All"
                  ? "bg-default-100 text-foreground font-semibold"
                  : "hover:bg-default-100 text-default-600"
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Folder className="size-4 text-amber-500 shrink-0 fill-amber-500/20" />
                <span className="truncate text-xs font-semibold">All Folders</span>
              </div>
            </div>

            {/* ROOT FOLDER LIST */}
            {websites.map((site) => {
              const isFolderActive = activeView.type === "folder" && activeView.folderName === site.name && !activeView.subfolder

              return (
                <div key={site.id} className="space-y-0.5">
                  <div
                    onClick={() => setActiveView({ type: "folder", folderName: site.name })}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-xl cursor-pointer transition-colors group ${
                      isFolderActive ? "bg-default-100 text-foreground font-semibold" : "hover:bg-default-100 text-default-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Folder className="size-4 text-amber-500 shrink-0 fill-amber-500/20" />
                      <span className="truncate text-xs font-semibold">{site.name}</span>
                    </div>
                    <ChevronRight className="size-3.5 text-default-400 group-hover:text-foreground transition-colors shrink-0" />
                  </div>
                </div>
              )
            })}

            {/* CUSTOM CREATED FOLDERS IN 2ND SIDEBAR */}
            {customFolders.length > 0 && (
              <div className="pt-2 border-t border-divider/60 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold text-default-400 uppercase tracking-wider">
                  Custom Folders
                </div>
                {customFolders.map((cf) => {
                  const isCustomActive = activeView.type === "folder" && activeView.folderName === (cf.website === "Global / Custom" ? websites[0]?.name : cf.website) && activeView.subfolder === cf.name
                  return (
                    <div
                      key={cf.id}
                      onClick={() => setActiveView({ type: "folder", folderName: cf.website === "Global / Custom" ? websites[0]?.name : cf.website, subfolder: cf.name })}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-xl cursor-pointer transition-colors ${
                        isCustomActive ? "bg-default-100 text-foreground font-semibold" : "hover:bg-default-100 text-default-600"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Folder
                          className={`size-4 shrink-0 ${cf.color === "custom" ? "" : getFolderColorClass(cf.color)}`}
                          style={cf.customHex ? { color: cf.customHex } : undefined}
                        />
                        <span className="truncate text-xs font-medium">{cf.name}</span>
                      </div>
                      <ChevronRight className="size-3.5 text-default-400 shrink-0" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 2. MAIN WORKSPACE                                                     */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        
        {/* WORKSPACE BREADCRUMB & BULK ACTIONS BAR */}
        <div className="px-4 py-2 border-b border-divider bg-content1/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-default-500">
            <span
              className="cursor-pointer hover:text-foreground transition-colors"
              onClick={() => setActiveView({ type: "global", filter: "All" })}
            >
              Files
            </span>
            <ChevronRight className="size-3.5 text-default-400" />
            {activeView.type === "global" ? (
              <span className="font-bold text-foreground">{activeView.filter}</span>
            ) : (
              <>
                <span
                  className="font-bold text-foreground cursor-pointer hover:underline"
                  onClick={() => setActiveView({ type: "folder", folderName: activeView.folderName })}
                >
                  {activeView.folderName}
                </span>
                {activeView.subfolder && (
                  <>
                    <ChevronRight className="size-3.5 text-default-400" />
                    <span className="font-bold text-accent-500">{activeView.subfolder}</span>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {selectedFileIds.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground bg-content2 border border-divider px-2.5 py-0.5 rounded-lg">
                  {selectedFileIds.size} selected
                </span>
                <Button size="sm" className="text-danger" variant="ghost" onPress={handleBulkDelete}>
                  <Trash2 className="size-3.5" /> Delete Selected
                </Button>
              </div>
            )}
            <div className="text-[11px] font-mono text-default-400">
              {filteredFiles.length} item(s)
            </div>
          </div>
        </div>

        {/* FILE CONTENT WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          
          {/* FOLDERS GRID IN WORKSPACE */}
          {foldersToDisplayInWorkspace.length > 0 && (
            <div className="mb-6 space-y-3">
              <div className="text-xs font-bold text-default-400 uppercase tracking-wider">
                Folders
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {foldersToDisplayInWorkspace.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.type === "root") {
                        setActiveView({ type: "folder", folderName: item.targetWebsite })
                      } else {
                        setActiveView({ type: "folder", folderName: item.targetWebsite, subfolder: item.targetSubfolder })
                      }
                    }}
                    className="p-3 bg-content1 border border-divider rounded-xl flex items-center gap-3 cursor-pointer hover:border-foreground hover:shadow-xs transition-all group"
                  >
                    <Folder
                      className={`size-5 shrink-0 ${item.colorClass}`}
                      style={item.customHex ? { color: item.customHex, fill: `${item.customHex}33` } : undefined}
                    />
                    <span className="text-xs font-semibold text-foreground truncate group-hover:text-foreground">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILES GRID / LIST */}
          {filteredFiles.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-divider rounded-2xl text-center p-6 space-y-3">
              <div className="size-12 rounded-full bg-content1 border border-divider flex items-center justify-center text-default-400">
                <Folder className="size-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">No files here</h4>
                <p className="text-xs text-default-400 max-w-sm">
                  Upload a file or select a folder to browse.
                </p>
              </div>
            </div>
          ) : displayMode === "grid" ? (
            /* GRID VIEW */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredFiles.map((file) => {
                const isSelected = inspectedFile?.id === file.id
                return (
                  <div
                    key={file.id}
                    onClick={() => setInspectedFile(file)}
                    className={`aspect-square rounded-2xl border transition-all cursor-pointer overflow-hidden flex items-center justify-center relative group ${
                      isSelected
                        ? "border-foreground ring-2 ring-foreground/20 shadow-md bg-content1"
                        : "border-divider bg-content1 hover:border-default-400 hover:shadow-xs"
                    }`}
                  >
                    {file.type === "Images" && file.url ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-2">
                        {getFileIcon(file.type)}
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-content2 border border-divider rounded-md text-default-500">
                          {file.ext}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            /* LIST VIEW (WITH MULTI-SELECT CHECKBOXES & BULK DELETE) */
            <div className="space-y-3">
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="Files table">
                    <Table.Header>
                      <Table.Column className="w-10">
                        <input
                          type="checkbox"
                          aria-label="Select all files"
                          checked={filteredFiles.length > 0 && selectedFileIds.size === filteredFiles.length}
                          onChange={toggleSelectAll}
                          className="size-3.5 rounded border-divider text-foreground focus:ring-0 cursor-pointer"
                        />
                      </Table.Column>
                      <Table.Column>File</Table.Column>
                      <Table.Column>Folder Path</Table.Column>
                      <Table.Column>Size</Table.Column>
                      <Table.Column>Date</Table.Column>
                      <Table.Column className="text-end">Actions</Table.Column>
                    </Table.Header>
                    <Table.Body items={filteredFiles}>
                      {(file) => {
                        const isChecked = selectedFileIds.has(file.id)
                        return (
                          <TableRow
                            key={file.id}
                            onClick={() => setInspectedFile(file)}
                            className={`cursor-pointer transition-colors ${
                              isChecked ? "bg-default-100/80" : "hover:bg-default-100/60"
                            }`}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                aria-label={`Select ${file.name}`}
                                checked={isChecked}
                                onChange={() => toggleSelectFile(file.id)}
                                className="size-3.5 rounded border-divider text-foreground focus:ring-0 cursor-pointer"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getFileIcon(file.type)}
                                <span className="text-xs font-bold text-foreground truncate max-w-xs">{file.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-default-500 font-mono">/{file.website}/{file.folder}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-default-500">{file.size}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-default-400">{file.date}</span>
                            </TableCell>
                            <TableCell className="text-end">
                              <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  isIconOnly
                                  onPress={() => setInspectedFile(file)}
                                >
                                  <Eye className="size-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  isIconOnly
                                  className="text-danger"
                                  onPress={() => handleDeleteFile(file.id)}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      }}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 3. FILE DETAILS INSPECTOR DRAWER                                      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {inspectedFile && (
        <aside className="w-80 bg-content1 border-l border-divider flex flex-col shrink-0 overflow-hidden animate-in slide-in-from-right duration-200">
          <div className="p-3.5 border-b border-divider flex items-center justify-between bg-content2/40">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-foreground" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">File Details</span>
            </div>
            <button
              type="button"
              onClick={() => setInspectedFile(null)}
              className="p-1 rounded-lg text-default-400 hover:text-foreground hover:bg-default-100 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs scrollbar-thin">
            {/* Preview Box */}
            <div className="h-44 rounded-2xl bg-content2/60 border border-divider overflow-hidden flex items-center justify-center relative">
              {inspectedFile.type === "Images" && inspectedFile.url ? (
                <img src={inspectedFile.url} alt={inspectedFile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {getFileIcon(inspectedFile.type)}
                  <span className="text-xs font-bold text-default-500 uppercase">{inspectedFile.ext}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground break-all">{inspectedFile.name}</h3>
              <p className="text-xs text-default-400">Added on {inspectedFile.date}</p>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-3 p-3 bg-content2/40 border border-divider rounded-xl">
              <div className="flex justify-between items-center text-xs">
                <span className="text-default-400">Website:</span>
                <span className="font-semibold text-foreground">{inspectedFile.website}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-default-400">Folder Path:</span>
                <span className="font-mono text-accent-500">/{inspectedFile.website}/{inspectedFile.folder}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-default-400">File Size:</span>
                <span className="font-medium text-foreground">{inspectedFile.size}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-default-400">Provider:</span>
                <span className="font-medium text-foreground">{inspectedFile.provider || "System"}</span>
              </div>
              {inspectedFile.article && (
                <div className="pt-2 border-t border-divider/60 space-y-1">
                  <span className="text-default-400 block text-[11px]">Used in Article:</span>
                  <span className="font-semibold text-foreground block truncate">{inspectedFile.article}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button size="sm" className="w-full" variant="outline" onPress={() => alert(`Downloading ${inspectedFile.name}...`)}>
                <Download className="size-3.5" /> Download File
              </Button>
              <Button size="sm" className="w-full text-danger" variant="ghost" onPress={() => handleDeleteFile(inspectedFile.id)}>
                <Trash2 className="size-3.5" /> Delete File
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 4. MODALS (CREATE FOLDER WITH SEARCH & COLOR, AND UPLOAD FILE)        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      
      {/* Create Folder Modal */}
      <Modal isOpen={isNewFolderModalOpen} onOpenChange={setIsNewFolderModalOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="center">
            <Modal.Dialog className="max-w-md w-full bg-content1 border border-divider rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-divider pb-4">
                <div className="flex items-center gap-2">
                  <FolderPlus className="size-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-foreground">Create Custom Folder</h3>
                </div>
                <button type="button" onClick={() => setIsNewFolderModalOpen(false)} className="p-1 rounded-lg text-default-400 hover:text-foreground hover:bg-default-100 transition-colors">
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="space-y-5 w-full">
                
                {/* 1. Folder Name Input */}
                <div className="grid grid-cols-[110px_1fr] items-center gap-3 w-full">
                  <label className="text-xs font-semibold text-default-700">Folder Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Infographics, Reports, Presentations..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-background text-foreground border border-divider rounded-xl focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/20 transition-all"
                    required
                  />
                </div>

                {/* 2. Parent Folder Select (ONLY SHOWN WHEN TRIGGERED FROM HEADER TO ASK PARENT FOLDER) */}
                {modalSource === "header" && (
                  <div className="grid grid-cols-[110px_1fr] items-center gap-3 w-full">
                    <label className="text-xs font-semibold text-default-700">Parent Folder</label>
                    
                    <Popover>
                      <Popover.Trigger>
                        <button
                          type="button"
                          className="w-full h-9 px-3 text-xs bg-background text-foreground border border-divider rounded-xl flex items-center justify-between hover:border-default-400 focus:outline-none transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Folder className="size-3.5 text-amber-500 fill-amber-500/20 shrink-0" />
                            <span className="truncate font-medium">{targetFolderForNew}</span>
                          </div>
                          <ChevronDown className="size-3.5 text-default-400 shrink-0" />
                        </button>
                      </Popover.Trigger>
                      <Popover.Content placement="bottom start" className="w-[320px] p-2 bg-content1 border border-divider rounded-2xl shadow-xl space-y-2 text-xs">
                        {/* Search Box inside Dropdown */}
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 size-3.5 text-default-400" />
                          <input
                            type="text"
                            placeholder="Search folders..."
                            value={folderSelectSearch}
                            onChange={(e) => setFolderSelectSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-divider rounded-xl focus:outline-none focus:border-foreground"
                          />
                        </div>

                        {/* Dropdown Options List */}
                        <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
                          <div
                            onClick={() => setTargetFolderForNew("Global / Custom")}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-colors ${
                              targetFolderForNew === "Global / Custom" ? "bg-foreground text-background font-bold" : "hover:bg-default-100 text-default-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Folder className="size-3.5 text-amber-500 fill-amber-500/20" />
                              <span>Custom Folders (Global)</span>
                            </div>
                            {targetFolderForNew === "Global / Custom" && <Check className="size-3.5" />}
                          </div>

                          <div className="border-t border-divider my-1.5" />

                          <div className="px-2 py-1 text-[10px] font-bold text-default-400 uppercase tracking-wider">
                            Website Folders
                          </div>

                          {filteredTargetWebsites.length === 0 ? (
                            <div className="p-2 text-[11px] text-default-400 text-center">No website folder found</div>
                          ) : (
                            filteredTargetWebsites.map((w) => (
                              <div
                                key={w.id}
                                onClick={() => setTargetFolderForNew(w.name)}
                                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-colors ${
                                  targetFolderForNew === w.name ? "bg-foreground text-background font-bold" : "hover:bg-default-100 text-default-700"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Folder className="size-3.5 text-blue-500 fill-blue-500/20" />
                                  <span className="truncate">{w.name}</span>
                                </div>
                                {targetFolderForNew === w.name && <Check className="size-3.5" />}
                              </div>
                            ))
                          )}
                        </div>
                      </Popover.Content>
                    </Popover>
                  </div>
                )}

                {/* 3. Folder Color Options + Custom Picker */}
                <div className="grid grid-cols-[110px_1fr] items-center gap-3 w-full">
                  <label className="text-xs font-semibold text-default-700">Folder Color</label>
                  <div className="flex items-center gap-2.5">
                    {FOLDER_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedFolderColor(c.id)}
                        className={`size-7 rounded-full ${c.bg} flex items-center justify-center transition-all ${
                          selectedFolderColor === c.id ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : "opacity-80 hover:opacity-100"
                        }`}
                        title={c.label}
                      >
                        {selectedFolderColor === c.id && <Check className="size-3 text-white" />}
                      </button>
                    ))}

                    {/* Custom Hex Color Picker Swatch */}
                    <div
                      className={`size-7 rounded-full flex items-center justify-center relative overflow-hidden transition-all ${
                        selectedFolderColor === "custom"
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                          : "border border-dashed border-divider bg-content2 hover:bg-default-100"
                      }`}
                      style={selectedFolderColor === "custom" ? { backgroundColor: customHexColor } : undefined}
                      title="Choose Custom Color"
                    >
                      <input
                        type="color"
                        value={customHexColor}
                        onChange={(e) => {
                          setCustomHexColor(e.target.value)
                          setSelectedFolderColor("custom")
                        }}
                        className="absolute inset-0 size-full opacity-0 cursor-pointer"
                      />
                      {selectedFolderColor === "custom" ? (
                        <Check className="size-3 text-white drop-shadow-xs" />
                      ) : (
                        <Plus className="size-3.5 text-default-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t border-divider/60">
                  <Button size="sm" variant="ghost" onPress={() => setIsNewFolderModalOpen(false)}>Cancel</Button>
                  <Button size="sm" type="submit">Create Folder</Button>
                </div>
              </form>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Upload File Modal */}
      <Modal isOpen={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="center">
            <Modal.Dialog className="max-w-md w-full bg-content1 border border-divider rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Upload className="size-4 text-accent-500" /> Upload File
                </h3>
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="text-default-400 hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Folder</label>
                  <Select
                    selectedKey={uploadFolder}
                    onSelectionChange={(key) => key && setUploadFolder(key as string)}
                    className="w-full"
                    aria-label="Select folder"
                  >
                    <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {websites.map((w) => (
                          <ListBox.Item key={w.name} id={w.name}>{w.name}</ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Subfolder</label>
                  <Select
                    selectedKey={uploadSubfolder}
                    onSelectionChange={(key) => key && setUploadSubfolder(key as string)}
                    className="w-full"
                    aria-label="Select subfolder"
                  >
                    <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {STANDARD_SUBFOLDERS.map((sub) => (
                          <ListBox.Item key={sub} id={sub}>{sub}</ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">File Name (with extension)</label>
                  <input
                    type="text"
                    placeholder="e.g. banner.png, report.pdf..."
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-background text-foreground border border-divider rounded-xl focus:outline-none focus:border-foreground"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">File Image URL (optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={uploadFileUrl}
                    onChange={(e) => setUploadFileUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-background text-foreground border border-divider rounded-xl focus:outline-none focus:border-foreground"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button size="sm" variant="ghost" onPress={() => setIsUploadModalOpen(false)}>Cancel</Button>
                  <Button size="sm" type="submit">Upload File</Button>
                </div>
              </form>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

    </div>
  )
}
