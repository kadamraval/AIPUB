import React from "react"
import { Card, CardHeader, CardContent } from "@heroui/react"

interface DataCardProps {
  title: string
  value: string | number
  caption?: string
  icon?: React.ComponentType<{ className?: string }>
  trend?: string
  pulseDot?: boolean
}

export function DataCard({
  title,
  value,
  caption,
  icon: Icon,
  trend,
  pulseDot
}: DataCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
        <p className="text-xs font-medium text-default-500">{title}</p>
        {Icon && <Icon className="size-4 text-default-400 shrink-0" />}
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {caption && (
          <p className="text-xs text-default-400 flex items-center gap-1.5">
            {pulseDot && <span className="size-1.5 rounded-full bg-foreground inline-block animate-pulse" />}
            <span>{caption}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
