"use client"

import { useState, useEffect } from "react"

/**
 * Renders children only on the client side (after mount).
 * Prevents server-side rendering of components that cannot render in SSR context,
 * such as HeroUI/React Aria collection-based components (Table, Select, etc.)
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <>{fallback}</>
  return <>{children}</>
}
