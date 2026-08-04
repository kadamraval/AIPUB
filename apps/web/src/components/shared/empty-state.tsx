import React from "react"
import { Card, CardContent } from "@heroui/react"
import { Layers } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
}

export function EmptyState({
  title = "No data found",
  description = "No items match your search or filter criteria.",
  icon: Icon = Layers,
  action
}: EmptyStateProps) {
  return (
    <Card className="border border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-3">
        <div className="size-10 rounded-full bg-default-100 flex items-center justify-center text-default-400">
          <Icon className="size-5" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-default-400 leading-relaxed">{description}</p>
        </div>
        {action && <div className="pt-2">{action}</div>}
      </CardContent>
    </Card>
  )
}
