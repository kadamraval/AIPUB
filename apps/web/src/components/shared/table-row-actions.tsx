"use client"

import React, { useState } from "react"
import { Button, Tooltip, Dropdown, ListBox } from "@heroui/react"
import { Edit, Trash2, MoreVertical, Eye, Copy, Edit3, Download, Key } from "lucide-react"

interface TableRowActionsProps {
  id: string
  name?: string
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  onDuplicate?: () => void
  onRename?: () => void
  onExport?: () => void
  onCopyId?: () => void
}

export function TableRowActions({
  id,
  name,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onRename,
  onExport,
  onCopyId
}: TableRowActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyId = () => {
    if (onCopyId) {
      onCopyId()
    } else if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {/* 1. EDIT BUTTON */}
      <Tooltip>
        <Tooltip.Trigger>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onPress={onEdit}
            aria-label="Edit"
            className="h-8 w-8 text-default-500 hover:text-foreground hover:bg-default-100"
          >
            <Edit className="size-3.5" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content placement="top">Edit</Tooltip.Content>
      </Tooltip>

      {/* 2. DELETE BUTTON */}
      <Tooltip>
        <Tooltip.Trigger>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onPress={onDelete}
            aria-label="Delete"
            className="h-8 w-8 text-danger-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950/40"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content placement="top">Delete</Tooltip.Content>
      </Tooltip>

      {/* 3. MORE ACTIONS BUTTON */}
      <Dropdown>
        <Dropdown.Trigger>
          <div
            role="button"
            tabIndex={0}
            aria-label="More Actions"
            className="inline-flex items-center justify-center h-8 w-8 rounded-medium text-default-500 hover:text-foreground hover:bg-default-100 transition-colors cursor-pointer outline-none"
          >
            <MoreVertical className="size-3.5" />
          </div>
        </Dropdown.Trigger>

        <Dropdown.Popover className="w-48 p-1.5 bg-content1 border border-divider rounded-2xl shadow-xl z-50">
          <ListBox aria-label={`Actions for ${name || id}`}>
            <ListBox.Item id="view" onPress={onView} className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-xl cursor-pointer">
              <Eye className="size-3.5 text-default-400" /> View Details
            </ListBox.Item>

            <ListBox.Item id="duplicate" onPress={onDuplicate} className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-xl cursor-pointer">
              <Copy className="size-3.5 text-default-400" /> Duplicate
            </ListBox.Item>

            <ListBox.Item id="rename" onPress={onRename} className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-xl cursor-pointer">
              <Edit3 className="size-3.5 text-default-400" /> Rename
            </ListBox.Item>

            <ListBox.Item id="export" onPress={onExport} className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-xl cursor-pointer">
              <Download className="size-3.5 text-default-400" /> Export Config
            </ListBox.Item>

            <ListBox.Item id="copy-id" onPress={handleCopyId} className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-xl cursor-pointer">
              <Key className="size-3.5 text-default-400" /> {copied ? "Copied!" : "Copy ID"}
            </ListBox.Item>
          </ListBox>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  )
}
