"use client"

import React from "react"
import { Card, CardHeader, CardContent, Chip } from "@heroui/react"

export default function NewslettersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">🔥 New Deep Dive: Autonomous AI Agents in Enterprise</h3>
            <p className="text-xs text-default-400 mt-1">Scheduled for 14,200 subscribers</p>
          </div>
          <Chip variant="soft" color="accent" size="sm">
            Scheduled
          </Chip>
        </CardHeader>
        <CardContent className="space-y-3 text-xs pt-0">
          <div className="p-3 border border-divider rounded-medium bg-default-50 text-xs space-y-1">
            <div><span className="font-semibold">Subject:</span> 🔥 New Deep Dive: The Future of Autonomous AI Agents</div>
            <div><span className="font-semibold">Preview:</span> How multi-agent networks are scaling digital content publishing...</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
