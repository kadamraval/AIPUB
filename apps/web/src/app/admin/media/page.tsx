"use client"

import React from "react"
import { Card, CardContent, Chip } from "@heroui/react"

export default function MediaPage() {
  const assets = [
    {
      id: "m1",
      name: "Abstract AI Agent Network Artwork",
      type: "Featured Image",
      provider: "Freepik MCP",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
      article: "The Future of Autonomous AI Agents in Enterprise Software"
    },
    {
      id: "m2",
      name: "SEO Content Strategy Infographic",
      type: "Infographic",
      provider: "OpenAI DALL-E 3",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
      article: "Top 10 High-Volume SEO Strategies for 2026 Publishing"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4 space-y-3">
              <div className="h-40 rounded-medium bg-default-100 overflow-hidden relative border border-divider">
                <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="font-medium text-foreground text-sm flex items-center justify-between">
                  <span>{a.name}</span>
                  <Chip variant="soft" color="accent" size="sm">{a.provider}</Chip>
                </div>
                <div className="text-default-400 text-xs">Used in: {a.article}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
