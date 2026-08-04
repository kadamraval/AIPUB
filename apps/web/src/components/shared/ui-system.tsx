"use client"

import React from "react"
import {
  Card as HeroUICard,
  CardHeader as HeroUICardHeader,
  CardContent as HeroUICardContent,
  Button as HeroUIButton,
  Chip as HeroUIChip,
  Table as HeroUITable,
  TableContent as HeroUITableContent,
  TableHeader as HeroUITableHeader,
  TableColumn as HeroUITableColumn,
  TableBody as HeroUITableBody,
  TableRow as HeroUITableRow,
  TableCell as HeroUITableCell,
  Typography,
} from "@heroui/react"

// ── 1. UNIFORM PAGE HEADER ──────────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

export function PageHeader({ title, description, action, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-divider/60 mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="size-6 text-foreground/80 shrink-0" />}
          <Typography type="h3" className="font-extrabold">{title}</Typography>
        </div>
        {description && <Typography type="body-xs" color="muted">{description}</Typography>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  )
}

// ── 2. UNIFORM CARD CONTAINER ───────────────────────────────────────────────
interface AppCardProps {
  children: React.ReactNode
  title?: React.ReactNode
  description?: string
  action?: React.ReactNode
  className?: string
  contentClassName?: string
}

export function AppCard({ children, title, description, action, className = "", contentClassName = "" }: AppCardProps) {
  return (
    <HeroUICard className={`bg-content1 border border-divider rounded-2xl shadow-xs overflow-hidden transition-all ${className}`}>
      {(title || action) && (
        <HeroUICardHeader className="px-5 py-3.5 border-b border-divider bg-content2/30 flex items-center justify-between gap-3">
          <div>
            {typeof title === "string" ? (
              <h3 className="text-sm font-bold text-foreground tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {description && <p className="text-[11px] text-default-400 font-medium mt-0.5">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </HeroUICardHeader>
      )}
      <HeroUICardContent className={`p-5 ${contentClassName}`}>
        {children}
      </HeroUICardContent>
    </HeroUICard>
  )
}

// ── 3. UNIFORM STATUS CHIP ──────────────────────────────────────────────────
interface AppChipProps {
  children: React.ReactNode
  color?: "accent" | "success" | "warning" | "danger" | "default"
  variant?: "soft" | "primary" | "secondary" | "tertiary"
  className?: string
}

export function AppChip({ children, color = "accent", variant = "soft", className = "" }: AppChipProps) {
  return (
    <HeroUIChip size="sm" variant={variant} color={color} className={`font-semibold text-[11px] ${className}`}>
      {children}
    </HeroUIChip>
  )
}

// ── 4. UNIFORM ACTION BUTTON ────────────────────────────────────────────────
interface AppButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger-soft"
  size?: "sm" | "md" | "lg"
  onPress?: () => void
  isDisabled?: boolean
  isPending?: boolean
  className?: string
  icon?: React.ComponentType<{ className?: string }>
}

export function AppButton({
  children,
  variant = "primary",
  size = "sm",
  onPress,
  isDisabled,
  isPending,
  className = "",
  icon: Icon
}: AppButtonProps) {
  const sizeClasses = size === "sm" ? "h-9 px-3.5 text-xs font-bold rounded-xl" : "h-10 px-4 text-sm font-bold rounded-xl"
  return (
    <HeroUIButton
      variant={variant}
      size={size}
      onPress={onPress}
      isDisabled={isDisabled || isPending}
      className={`${sizeClasses} ${className}`}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {children}
    </HeroUIButton>
  )
}
