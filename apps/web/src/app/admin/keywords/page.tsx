"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@heroui/react"
import { Chip } from "@heroui/react"
import { TrendingUp } from "lucide-react"

export default function KeywordsPage() {
  const clusters = [
    { clusterName: "Autonomous AI Agents", primaryKeyword: "autonomous ai agents", volume: "14.5K", difficulty: "Medium (42)", intent: "Informational / Transactional", trendScore: 94.2 },
    { clusterName: "Programmatic SEO Workflows", primaryKeyword: "programmatic seo 2026", volume: "22.1K", difficulty: "High (68)", intent: "Commercial", trendScore: 89.5 },
    { clusterName: "WordPress REST Publishing", primaryKeyword: "wordpress rest api automation", volume: "8.9K", difficulty: "Low (24)", intent: "Informational", trendScore: 81.0 }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clusters.map((c) => (
          <Card key={c.clusterName}>
            <CardHeader className="pb-2 flex-col items-start">
              <p className="text-sm font-semibold">{c.clusterName}</p>
              <p className="text-xs text-default-400">{c.primaryKeyword}</p>
            </CardHeader>
            <CardContent className="space-y-2 text-xs pt-0">
              <div className="flex justify-between border-b border-divider pb-1.5 text-default-400">
                <span>Monthly Volume:</span>
                <span className="font-medium text-foreground">{c.volume}</span>
              </div>
              <div className="flex justify-between border-b border-divider pb-1.5 text-default-400">
                <span>Difficulty:</span>
                <span className="font-medium text-foreground">{c.difficulty}</span>
              </div>
              <div className="flex justify-between border-b border-divider pb-1.5 text-default-400">
                <span>Intent:</span>
                <span className="font-medium text-foreground">{c.intent}</span>
              </div>
              <div className="flex justify-between pt-1 text-default-400">
                <span>Trend Score:</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <TrendingUp className="size-3.5" /> {c.trendScore}/100
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
