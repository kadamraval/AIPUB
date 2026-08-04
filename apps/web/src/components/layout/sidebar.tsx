"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Globe,
  Rss,
  Bot,
  GitBranch,
  LineChart,
  FileText,
  Search,
  Image as ImageIcon,
  Puzzle,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from "lucide-react"
import {
  Dropdown,
  Avatar,
} from "@heroui/react"

// Exact User Grouped Navigation Order
const navigationGroup1 = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Websites", href: "/admin/websites", icon: Globe },
  { name: "Sources", href: "/admin/sources", icon: Rss },
  { name: "Agent", href: "/admin/custom-agents", icon: Bot },
  { name: "Workflow", href: "/admin/workflows", icon: GitBranch },
  { name: "Analytics", href: "/admin/analytics", icon: LineChart },
]

const navigationGroup2 = [
  { name: "Articles", href: "/admin/articles", icon: FileText },
  { name: "Keyword", href: "/admin/keywords", icon: Search },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
]

const navigationGroup3 = [
  { name: "Integration", href: "/admin/integrations", icon: Puzzle },
  { name: "Newsletter", href: "/admin/newsletters", icon: Mail },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    router.push("/login")
  }

  const renderNavGroup = (items: typeof navigationGroup1) => (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            title={isCollapsed ? item.name : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-medium text-sm font-medium transition-colors ${
              isCollapsed ? "justify-center px-0" : ""
            } ${
              isActive
                ? "bg-default-100 text-foreground"
                : "text-default-500 hover:bg-default-100/60 hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </Link>
        )
      })}
    </div>
  )

  return (
    <aside
      className={`border-r border-divider bg-content1 flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 border-b border-divider flex items-center justify-between px-3">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-7 w-7 rounded-medium bg-foreground text-background flex items-center justify-center font-bold text-sm shrink-0">
              AI
            </div>
            <span className="font-semibold text-sm tracking-tight truncate">
              Publishing OS
            </span>
          </div>
        )}

        {isCollapsed && (
          <div className="h-7 w-7 rounded-medium bg-foreground text-background flex items-center justify-center font-bold text-sm mx-auto">
            AI
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-7 w-7 rounded-medium border border-divider flex items-center justify-center text-default-400 hover:text-foreground hover:bg-default-100 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Search above Dashboard */}
      <div className="p-2 border-b border-divider">
        <button
          className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-medium border border-divider bg-background text-default-400 text-xs hover:text-foreground hover:bg-default-100 transition-colors ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
          title="Search (Ctrl+K)"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 shrink-0" />
            {!isCollapsed && <span>Search...</span>}
          </div>
          {!isCollapsed && (
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-default-100 text-default-400 border border-divider rounded">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Navigation Items with Smooth Scrollbar on Hover */}
      <nav className="flex-1 p-2 space-y-3 overflow-y-hidden hover:overflow-y-auto transition-all scrollbar-thin scrollbar-thumb-default-200 hover:scrollbar-thumb-default-400">
        {/* Group 1 */}
        {renderNavGroup(navigationGroup1)}

        {/* Divider 1 */}
        <div className="border-t border-divider/60 my-2" />

        {/* Group 2 */}
        {renderNavGroup(navigationGroup2)}

        {/* Divider 2 */}
        <div className="border-t border-divider/60 my-2" />

        {/* Group 3 */}
        {renderNavGroup(navigationGroup3)}
      </nav>

      {/* User Profile at Bottom with Proper HeroUI Compound Popover Menu */}
      <div className="p-2 border-t border-divider relative">
        <Dropdown>
          <Dropdown.Trigger>
            <div
              role="button"
              tabIndex={0}
              className={`w-full flex items-center gap-2.5 p-2 rounded-medium hover:bg-default-100 transition-colors text-left outline-none cursor-pointer ${
                isCollapsed ? "justify-center p-1" : ""
              }`}
            >
              <Avatar size="sm" color="default">
                <Avatar.Fallback>KR</Avatar.Fallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">Kadam Raval</div>
                  <div className="text-xs text-default-400 truncate">kadam@aipublishing.os</div>
                </div>
              )}
            </div>
          </Dropdown.Trigger>
          <Dropdown.Popover className="w-56 p-1.5 bg-content1 border border-divider rounded-2xl shadow-xl z-50">
            <Dropdown.Menu aria-label="User profile options">
              <Dropdown.Item id="user-header" className="px-3 py-2 border-b border-divider mb-1 outline-none">
                <div className="text-xs font-bold text-foreground">Kadam Raval</div>
                <div className="text-[11px] text-default-400 truncate">kadam@aipublishing.os</div>
              </Dropdown.Item>
              <Dropdown.Item
                id="my-profile"
                onPress={() => router.push("/admin/settings")}
                className="px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-default-100 cursor-pointer outline-none flex items-center gap-2"
              >
                <User className="size-3.5 text-default-500" /> My Profile
              </Dropdown.Item>
              <Dropdown.Item
                id="settings"
                onPress={() => router.push("/admin/settings")}
                className="px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-default-100 cursor-pointer outline-none flex items-center gap-2"
              >
                <Settings className="size-3.5 text-default-500" /> Settings
              </Dropdown.Item>
              <Dropdown.Item
                id="logout"
                onPress={handleLogout}
                className="px-3 py-2 text-xs font-medium text-danger rounded-xl hover:bg-danger-50 cursor-pointer outline-none flex items-center gap-2 mt-1 border-t border-divider/60"
              >
                <LogOut className="size-3.5 text-danger" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </aside>
  )
}
