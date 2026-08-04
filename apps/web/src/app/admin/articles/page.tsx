"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Button, Chip, Select, ListBox, Checkbox,
  Table,
} from "@heroui/react"
import { FileText, Plus } from "lucide-react"
import { fetchArticles } from "@/lib/api"

import { Toolbar } from "@/components/shared/toolbar"
import { TableRowActions } from "@/components/shared/table-row-actions"
import { TablePagination } from "@/components/shared/table-pagination"

export const dynamic = "force-dynamic"

const defaultDemoArticles = [
  { id: "art-1", title: "Building Micro-SaaS with Next.js & Supabase in 2026", website_name: "TechPulse Daily", workflow_name: "Autonomous Newsroom Digest", status: "published", seo_score: 98, created_at: "2 hours ago" },
  { id: "art-2", title: "The Future of Generative Video in 2026 Publishing", website_name: "AI Frontier Journal", workflow_name: "Autonomous Newsroom Digest", status: "published", seo_score: 94, created_at: "5 hours ago" },
  { id: "art-3", title: "Optimizing Postgres Vector Queries for High Velocity RAG", website_name: "SaaS Growth Chronicle", workflow_name: "SEO Topic Cluster & Article Generator", status: "draft", seo_score: 89, created_at: "1 day ago" },
  { id: "art-4", title: "Autonomous Content Pipelines with Multi-Agent Systems", website_name: "TechPulse Daily", workflow_name: "Multi-Lingual Translation & Publishing", status: "published", seo_score: 96, created_at: "2 days ago" },
  { id: "art-5", title: "AI-Driven Personalization at Scale for Modern Newsrooms", website_name: "Crypto Trends Today", workflow_name: "Not Assigned", status: "review", seo_score: 91, created_at: "3 days ago" }
]

export default function ArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<any[]>(defaultDemoArticles)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    async function loadArticles() {
      const data = await fetchArticles()
      if (data && data.length > 0) setArticles(data)
    }
    loadArticles()
  }, [])

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.website_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || art.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredArticles.length / pageSize)
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleDelete = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search articles by title or site name..."
        selectedCount={selectedIds.size}
        filters={
          <Select
            selectedKey={statusFilter}
            onSelectionChange={(key) => {
              if (key) { setStatusFilter(key as string); setCurrentPage(1); }
            }}
            className="w-36"
            aria-label="Filter by status"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all">All Statuses</ListBox.Item>
                <ListBox.Item id="published">Published</ListBox.Item>
                <ListBox.Item id="draft">Draft</ListBox.Item>
                <ListBox.Item id="review">In Review</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        }
      />

      <div className="space-y-3">
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Articles table"
              selectedKeys={selectedIds as any}
              selectionMode="multiple"
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  setSelectedIds(new Set(filteredArticles.map((a) => a.id)))
                } else {
                  setSelectedIds(new Set(Array.from(keys) as string[]))
                }
              }}
            >
              <Table.Header>
                <Table.Column className="pe-0">
                  <Checkbox aria-label="Select all articles" slot="selection">
                    <Checkbox.Content>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                    </Checkbox.Content>
                  </Checkbox>
                </Table.Column>
                <Table.Column isRowHeader>Article</Table.Column>
                <Table.Column>Website</Table.Column>
                <Table.Column>Workflow</Table.Column>
                <Table.Column>SEO Score</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Updated</Table.Column>
                <Table.Column className="text-right">Actions</Table.Column>
              </Table.Header>
              <Table.Body items={paginatedArticles}>
                {(art: any) => (
                  <Table.Row key={art.id} id={art.id} className="hover:bg-content2/40 cursor-pointer" onClick={() => router.push(`/admin/articles/${art.id}`)}>
                    <Table.Cell className="pe-0" onClick={(e) => e.stopPropagation()}>
                      <Checkbox aria-label={`Select ${art.title}`} slot="selection">
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        </Checkbox.Content>
                      </Checkbox>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="font-bold text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                        <FileText className="size-4 text-primary shrink-0" />
                        <span>{art.title}</span>
                      </div>
                    </Table.Cell>

                    <Table.Cell className="text-xs text-default-500 font-medium">
                      {art.website_name}
                    </Table.Cell>

                    <Table.Cell>
                      <Chip variant="soft" color="accent" size="sm" className="text-xs font-medium">
                        {art.workflow_name}
                      </Chip>
                    </Table.Cell>

                    <Table.Cell>
                      <Chip variant="soft" color={art.seo_score > 90 ? "success" : "warning"} size="sm" className="font-mono text-xs font-bold">
                        {art.seo_score}/100
                      </Chip>
                    </Table.Cell>

                    <Table.Cell>
                      <Chip
                        variant="soft"
                        color={
                          art.status === "published" ? "success" :
                          art.status === "review" ? "warning" : "default"
                        }
                        size="sm"
                        className="text-xs font-semibold uppercase"
                      >
                        {art.status}
                      </Chip>
                    </Table.Cell>

                    <Table.Cell className="text-xs text-default-400 font-mono">
                      {art.created_at}
                    </Table.Cell>

                    <Table.Cell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <TableRowActions
                        id={art.id}
                        name={art.title}
                        onEdit={() => router.push(`/admin/articles/${art.id}`)}
                        onDelete={() => handleDelete(art.id)}
                        onView={() => router.push(`/admin/articles/${art.id}`)}
                      />
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredArticles.length}
          itemLabel="articles"
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
        />
      </div>
    </div>
  )
}
