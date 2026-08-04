import React from "react"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

export function PageHeader({ title, description, actions, action, icon: Icon }: PageHeaderProps) {
  const actionSlot = actions || action
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-divider/60 mb-6">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="size-5 text-foreground/80 shrink-0" />}
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
        </div>
        {description && (
          <p className="text-xs text-default-500 font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actionSlot && (
        <div className="flex items-center gap-2 shrink-0">
          {actionSlot}
        </div>
      )}
    </div>
  )
}
