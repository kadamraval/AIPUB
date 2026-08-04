"use client"

import React from "react"
import { Input, Button, Dropdown, ListBox, Tooltip } from "@heroui/react"
import { Search, Filter, ArrowUpDown, LayoutGrid, Table as TableIcon, List, CheckSquare } from "lucide-react"

interface ToolbarProps {
  searchQuery?: string
  onSearchChange?: (val: string) => void
  searchPlaceholder?: string
  filterContent?: React.ReactNode
  filters?: React.ReactNode
  sortContent?: React.ReactNode
  displayMode?: "table" | "grid" | "list"
  onDisplayModeChange?: (mode: "table" | "grid" | "list") => void
  selectedCount?: number
  bulkActionsContent?: React.ReactNode
  actions?: React.ReactNode
  children?: React.ReactNode
}

export function Toolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search records by name or keyword...",
  filterContent,
  filters,
  sortContent,
  displayMode = "table",
  onDisplayModeChange,
  selectedCount = 0,
  bulkActionsContent,
  actions,
  children
}: ToolbarProps) {
  const activeFilters = filterContent || filters
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-content1 p-3 border border-divider rounded-2xl shadow-xs">
      {/* Left: Search input */}
      <div className="flex items-center gap-2 flex-1 w-full sm:w-auto min-w-0">
        {onSearchChange !== undefined && (
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs"
          />
        )}
        {children}
      </div>

      {/* Right: Filter, Sort, View mode, Bulk Actions & Primary Actions */}
      <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 bg-content2 px-3 py-1.5 rounded-xl border border-divider">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CheckSquare className="size-3.5 text-accent-500" />
              {selectedCount} Selected
            </span>
            {bulkActionsContent}
          </div>
        )}

        {/* Filter Dropdown / Filter Control */}
        {activeFilters}

        {/* Sort Dropdown / Sort Control */}
        {sortContent}

        {/* View Toggle (Table, Grid, List) */}
        {onDisplayModeChange && (
          <div className="flex items-center p-0.5 bg-content2 border border-divider rounded-xl">
            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant={displayMode === "table" ? "primary" : "ghost"}
                  onPress={() => onDisplayModeChange("table")}
                  aria-label="Table View"
                  className="h-8 w-8 rounded-lg"
                >
                  <TableIcon className="size-3.5" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content placement="top">Table View</Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant={displayMode === "grid" ? "primary" : "ghost"}
                  onPress={() => onDisplayModeChange("grid")}
                  aria-label="Grid View"
                  className="h-8 w-8 rounded-lg"
                >
                  <LayoutGrid className="size-3.5" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content placement="top">Grid View</Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant={displayMode === "list" ? "primary" : "ghost"}
                  onPress={() => onDisplayModeChange("list")}
                  aria-label="List View"
                  className="h-8 w-8 rounded-lg"
                >
                  <List className="size-3.5" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content placement="top">List View</Tooltip.Content>
            </Tooltip>
          </div>
        )}

        {actions}
      </div>
    </div>
  )
}
