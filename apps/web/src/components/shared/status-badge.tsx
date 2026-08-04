import React from "react"
import { Chip } from "@heroui/react"

interface StatusBadgeProps {
  status: string
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const normalized = (status || "published").toLowerCase()
  const displayLabel = label || status

  if (["active", "published", "running", "success"].includes(normalized)) {
    return (
      <Chip color="success" variant="soft" size="sm">
        {displayLabel}
      </Chip>
    )
  }

  if (["failed", "error", "stopped", "destructive"].includes(normalized)) {
    return (
      <Chip color="danger" variant="soft" size="sm">
        {displayLabel}
      </Chip>
    )
  }

  if (["pending", "draft", "warning"].includes(normalized)) {
    return (
      <Chip color="warning" variant="soft" size="sm">
        {displayLabel}
      </Chip>
    )
  }

  return (
    <Chip variant="soft" color="accent" size="sm">
      {displayLabel}
    </Chip>
  )
}
