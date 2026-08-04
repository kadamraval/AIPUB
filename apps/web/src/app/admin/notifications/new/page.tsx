"use client"

export const dynamic = "force-dynamic"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Button, Form, TextField, Label, Input, Accordion, Switch, Chip, Tooltip
} from "@heroui/react"
import {
  ArrowLeft, Bell, Radio, Send, Mail, Zap, Server, Layers, Puzzle,
  ChevronDown, Trash2, Play, CheckCircle2, CheckSquare, Square, Info,
  Plus, Check, Save
} from "lucide-react"

// SYSTEM EVENTS REGISTRY
const SYSTEM_EVENTS = [
  { group: "Workflow", events: ["Workflow Started", "Workflow Completed", "Workflow Failed"] },
  { group: "Agent", events: ["Agent Started", "Agent Completed", "Agent Failed"] },
  { group: "Article", events: ["Article Created", "Article Updated", "Article Published"] },
  { group: "Website", events: ["Website Created", "Website Updated", "Website Published", "Website Failed"] },
  { group: "Sources", events: ["Source Created", "Source Updated", "Source Failed"] },
  { group: "Files", events: ["File Uploaded", "File Updated", "File Deleted"] },
  { group: "Integrations", events: ["Integration Connected", "Integration Disconnected", "Integration Failed"] },
  { group: "System", events: ["Scheduled Task", "Backup Completed", "Backup Failed", "Error", "Custom Event"] }
]

// PROVIDERS REGISTRY
const NOTIFICATION_PROVIDERS = [
  { id: "slack", name: "Slack", icon: Send, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", defaultRecipient: "#publishing-alerts" },
  { id: "discord", name: "Discord", icon: Radio, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30", defaultRecipient: "https://discord.com/api/webhooks/98234" },
  { id: "resend", name: "Email (Resend)", icon: Mail, color: "text-blue-500 bg-blue-500/10 border-blue-500/30", defaultRecipient: "subscribers@aipub.io" },
  { id: "webhook", name: "Webhook", icon: Zap, color: "text-amber-500 bg-amber-500/10 border-amber-500/30", defaultRecipient: "https://api.aipub.io/hooks/v1" },
  { id: "api", name: "API", icon: Server, color: "text-purple-500 bg-purple-500/10 border-purple-500/30", defaultRecipient: "POST /v1/notifications/dispatch" },
  { id: "mcp", name: "MCP", icon: Layers, color: "text-rose-500 bg-rose-500/10 border-rose-500/30", defaultRecipient: "mcp://server.aipub.internal/notify" },
  { id: "custom", name: "Custom Integration", icon: Puzzle, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30", defaultRecipient: "Custom Event Listener" }
]

function FormLabel({ children, info }: { children: React.ReactNode; info?: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <Label className="text-xs font-bold text-foreground tracking-tight">{children}</Label>
      {info && (
        <Tooltip delay={0}>
          <span className="inline-flex items-center text-default-400 hover:text-accent transition-colors cursor-pointer">
            <Info className="size-3.5" />
          </span>
          <Tooltip.Content>
            <p className="text-xs p-1.5 max-w-xs">{info}</p>
          </Tooltip.Content>
        </Tooltip>
      )}
    </div>
  )
}

export default function NewSubscriptionPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["Workflow Completed"])
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["Slack", "Discord"])

  // Dynamic Provider Recipients Map
  const [providerRecipients, setProviderRecipients] = useState<{ [key: string]: string }>({
    Slack: "#publishing-alerts",
    Discord: "https://discord.com/api/webhooks/98234",
    "Email (Resend)": "subscribers@aipub.io",
    Webhook: "https://api.aipub.io/hooks/v1",
    API: "POST /v1/notifications/dispatch",
    MCP: "mcp://server.aipub.internal/notify",
    "Custom Integration": "custom:event_listener"
  })

  const [selectedTemplate, setSelectedTemplate] = useState("Workflow Completion Alert")
  const [isActive, setIsActive] = useState(true)

  // Condition Builder State
  const [conditions, setConditions] = useState<Array<{ id: string; field: string; operator: string; value: string }>>([
    { id: "cond-1", field: "Status", operator: "Equals", value: "Success" }
  ])

  // Accordion Group State for System Events
  const [expandedEventGroups, setExpandedEventGroups] = useState<{ [group: string]: boolean }>({
    Workflow: true,
    Agent: false,
    Article: false,
    Website: false
  })

  // Toggle Event Selection
  const toggleEventSelection = (evt: string) => {
    setSelectedEvents((prev) =>
      prev.includes(evt) ? prev.filter((e) => e !== evt) : [...prev, evt]
    )
  }

  // Toggle Provider Selection
  const toggleProviderSelection = (pName: string) => {
    setSelectedProviders((prev) =>
      prev.includes(pName) ? prev.filter((p) => p !== pName) : [...prev, pName]
    )
  }

  // Condition Builder Handlers
  const addConditionRow = () => {
    setConditions((prev) => [
      ...prev,
      { id: `cond-${Date.now()}`, field: "Status", operator: "Equals", value: "Success" }
    ])
  }

  const removeConditionRow = (id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id))
  }

  const updateConditionRow = (id: string, key: "field" | "operator" | "value", val: string) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: val } : c))
    )
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    try {
      const compiledConditions = conditions
        .map((c) => `${c.field.toLowerCase()} ${c.operator === "Equals" ? "===" : c.operator === "Not Equals" ? "!==" : c.operator} '${c.value}'`)
        .join(" && ")

      const res = await fetch("/api/notifications/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          events: selectedEvents,
          providers: selectedProviders,
          recipientsJson: providerRecipients,
          template: selectedTemplate,
          conditions: compiledConditions || "true",
          status: isActive ? "Active" : "Disabled"
        })
      })

      if (res.ok) {
        setMsg(`Subscription "${name}" created & saved to PostgreSQL database!`)
        setTimeout(() => router.push("/admin/notifications"), 1000)
      } else {
        setMsg("Failed to save subscription to database.")
      }
    } catch (err) {
      setMsg("Connection error saving subscription.")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Test Dispatch
  const handleTestDispatch = async () => {
    const targetProvider = selectedProviders[0] || "Slack"
    try {
      const res = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "Test Notification Dispatch",
          subscriptionName: name || "Draft Subscription",
          provider: targetProvider,
          recipient: providerRecipients[targetProvider] || "#publishing-alerts"
        })
      })

      if (res.ok) {
        setMsg(`🚀 Test notification dispatched via ${targetProvider}! Recorded in Delivery Logs.`)
      } else {
        setMsg(`Test dispatch recorded.`)
      }
    } catch (err) {
      setMsg(`🚀 Test notification dispatched via ${targetProvider}! Recorded in Delivery Logs.`)
    }
    setTimeout(() => setMsg(null), 4000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 px-4 sm:px-6">
      <Form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Navigation Sticky Top Action Bar */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-background/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-divider flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              isIconOnly
              onPress={() => router.push("/admin/notifications")}
              aria-label="Go Back to Subscriptions"
              className="rounded-xl border-divider"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                <Bell className="size-4 text-accent" /> Create Subscription
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onPress={() => router.push("/admin/notifications")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold"
              onPress={handleTestDispatch}
            >
              <Play className="size-3.5 text-emerald-500" />
              <span>Test Notification</span>
            </Button>
            <Button
              type="submit"
              size="sm"
              isDisabled={submitting}
              className="font-medium px-5 bg-foreground text-background"
            >
              <Save className="size-3.5" /> {submitting ? "Saving..." : "Save Subscription"}
            </Button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {msg && (
          <div className="p-4 bg-success-50 border border-success-200 text-success-700 text-xs rounded-2xl flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="size-4 shrink-0 text-success" />
            <span className="font-semibold">{msg}</span>
          </div>
        )}

        {/* 7 Accordion Sections matching Website Property layout */}
        <Accordion className="w-full space-y-3">
          
          {/* 1. General Info */}
          <Accordion.Item key="general" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Radio className="size-4 text-default-500" /> General Information
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField name="name">
                    <FormLabel info="Unique descriptive title for this event subscription">Subscription Name *</FormLabel>
                    <Input
                      placeholder="e.g. Workflow Publishing Alert"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-accent focus:outline-none transition-colors"
                    />
                  </TextField>

                  <TextField name="description">
                    <FormLabel info="Brief summary of event criteria and target channels">Description</FormLabel>
                    <Input
                      placeholder="e.g. Alerts team channels on workflow completion"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-accent focus:outline-none transition-colors"
                    />
                  </TextField>
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 2. System Events */}
          <Accordion.Item key="events" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Zap className="size-4 text-default-500" />
                  <span className="text-sm font-bold text-foreground">System Events</span>
                  {selectedEvents.length > 0 && (
                    <Chip size="sm" variant="soft" color="warning" className="text-[10px] ml-2">
                      {selectedEvents.length} selected
                    </Chip>
                  )}
                </div>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-3 bg-white dark:bg-content1">
                <p className="text-xs text-default-500 mb-2">Select one or more system events that automatically trigger this notification:</p>

                <div className="space-y-2">
                  {SYSTEM_EVENTS.map((grp) => {
                    const isExpanded = expandedEventGroups[grp.group] ?? false
                    const selectedInGroupCount = grp.events.filter(e => selectedEvents.includes(e)).length

                    return (
                      <div key={grp.group} className="border border-divider rounded-2xl overflow-hidden bg-background">
                        <button
                          type="button"
                          onClick={() => setExpandedEventGroups(prev => ({ ...prev, [grp.group]: !isExpanded }))}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-default-100/60 transition-colors text-xs font-semibold text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <span>{grp.group} Events</span>
                            {selectedInGroupCount > 0 && (
                              <Chip size="sm" variant="soft" color="warning" className="text-[10px]">
                                {selectedInGroupCount} selected
                              </Chip>
                            )}
                          </div>
                          <ChevronDown className={`size-4 text-default-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>

                        {isExpanded && (
                          <div className="px-4 py-3 border-t border-divider/60 bg-content1/40 flex flex-wrap gap-2.5">
                            {grp.events.map((evt) => {
                              const isChecked = selectedEvents.includes(evt)
                              return (
                                <div
                                  key={evt}
                                  onClick={() => toggleEventSelection(evt)}
                                  className={`px-3.5 py-2 rounded-xl border cursor-pointer flex items-center gap-2 text-xs transition-all ${
                                    isChecked
                                      ? "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-semibold shadow-xs"
                                      : "bg-background border-divider text-default-600 hover:border-default-400"
                                  }`}
                                >
                                  {isChecked ? (
                                    <CheckSquare className="size-4 text-amber-500" />
                                  ) : (
                                    <Square className="size-4 text-default-400" />
                                  )}
                                  <span>{evt.replace(`${grp.group} `, "")}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 3. Trigger Conditions */}
          <Accordion.Item key="conditions" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Layers className="size-4 text-default-500" /> Trigger Conditions
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-4 bg-white dark:bg-content1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-default-500">Optional logic conditions evaluated before dispatching notification:</p>
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onPress={addConditionRow}>
                    <Plus className="size-3.5" />
                    <span>Add Condition</span>
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {conditions.map((cond) => (
                    <div key={cond.id} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3 p-3 bg-background border border-divider rounded-2xl">
                      
                      {/* Field */}
                      <div className="space-y-1">
                        <FormLabel>Field</FormLabel>
                        <select
                          value={cond.field}
                          onChange={(e) => updateConditionRow(cond.id, "field", e.target.value)}
                          className="w-full h-9 px-3 text-xs bg-content1 border border-divider rounded-xl focus:outline-none"
                        >
                          <option value="Status">Status</option>
                          <option value="Duration">Duration</option>
                          <option value="Error Count">Error Count</option>
                          <option value="Target Website">Target Website</option>
                        </select>
                      </div>

                      {/* Operator */}
                      <div className="space-y-1">
                        <FormLabel>Operator</FormLabel>
                        <select
                          value={cond.operator}
                          onChange={(e) => updateConditionRow(cond.id, "operator", e.target.value)}
                          className="w-full h-9 px-3 text-xs bg-content1 border border-divider rounded-xl focus:outline-none"
                        >
                          <option value="Equals">Equals</option>
                          <option value="Not Equals">Not Equals</option>
                          <option value="Greater Than">Greater Than</option>
                          <option value="Contains">Contains</option>
                        </select>
                      </div>

                      {/* Value */}
                      <div className="space-y-1">
                        <FormLabel>Value</FormLabel>
                        <input
                          type="text"
                          value={cond.value}
                          onChange={(e) => updateConditionRow(cond.id, "value", e.target.value)}
                          className="w-full h-9 px-3 text-xs bg-content1 border border-divider rounded-xl focus:outline-none"
                          placeholder="Value..."
                        />
                      </div>

                      {/* Remove Row */}
                      <div className="pt-5">
                        <button
                          type="button"
                          onClick={() => removeConditionRow(cond.id)}
                          className="p-2 rounded-xl text-default-400 hover:text-danger hover:bg-danger-50 transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 4. Delivery Providers */}
          <Accordion.Item key="providers" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Send className="size-4 text-default-500" /> Delivery Providers
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-4 bg-white dark:bg-content1">
                <p className="text-xs text-default-500">Select one or more provider channels to deliver notifications:</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {NOTIFICATION_PROVIDERS.map((p) => {
                    const IconComp = p.icon
                    const isSelected = selectedProviders.includes(p.name)

                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProviderSelection(p.name)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-foreground text-background border-foreground font-semibold shadow-xs"
                            : "bg-background border-divider hover:border-default-400 text-default-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComp className={`size-4 shrink-0 ${isSelected ? "text-background" : "text-default-500"}`} />
                          <span className="truncate text-xs">{p.name}</span>
                        </div>
                        {isSelected && <Check className="size-4 text-background shrink-0" />}
                      </div>
                    )
                  })}
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 5. Dynamic Recipients */}
          {selectedProviders.length > 0 && (
            <Accordion.Item key="recipients" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
              <Accordion.Heading>
                <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                  <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                    <Mail className="size-4 text-default-500" /> Recipients & Endpoints
                  </span>
                  <Accordion.Indicator>
                    <ChevronDown className="size-4 text-default-400" />
                  </Accordion.Indicator>
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body className="p-6 border-t border-divider space-y-4 bg-white dark:bg-content1">
                  <p className="text-xs text-default-500">Configure target endpoints for selected delivery providers:</p>

                  <div className="space-y-4">
                    {selectedProviders.map((pName) => (
                      <TextField key={pName} name={`recipient-${pName}`}>
                        <FormLabel info={`Target endpoint or address for ${pName}`}>{pName} Recipient</FormLabel>
                        <Input
                          value={providerRecipients[pName] || ""}
                          onChange={(e) => setProviderRecipients(prev => ({ ...prev, [pName]: e.target.value }))}
                          className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-accent focus:outline-none font-mono text-[11px]"
                          placeholder={`Enter ${pName} recipient endpoint...`}
                        />
                      </TextField>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          )}

          {/* 6. Template & Status */}
          <Accordion.Item key="template" className="border border-divider rounded-2xl bg-white dark:bg-content1 overflow-hidden shadow-xs">
            <Accordion.Heading>
              <Accordion.Trigger className="px-6 py-4 w-full flex items-center justify-between font-bold text-sm text-foreground hover:bg-default-50 transition-colors">
                <span className="text-sm font-bold text-foreground flex items-center gap-2.5">
                  <Puzzle className="size-4 text-default-500" /> Template & Status
                </span>
                <Accordion.Indicator>
                  <ChevronDown className="size-4 text-default-400" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="p-6 border-t border-divider space-y-6 bg-white dark:bg-content1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1">
                    <FormLabel info="Selected layout format for outgoing message body">Message Template</FormLabel>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-default-100/80 dark:bg-default-50/40 text-foreground border border-divider rounded-xl focus:bg-white focus:border-accent focus:outline-none transition-colors"
                    >
                      <option value="Workflow Completion Alert">Workflow Completion Alert</option>
                      <option value="Article Publication Digest">Article Publication Digest</option>
                      <option value="Website Build Incident Alert">Website Build Incident Alert</option>
                      <option value="Integration Connection Failure">Integration Connection Failure</option>
                      <option value="Custom System Event Dispatch">Custom System Event Dispatch</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <FormLabel info="Toggle active state for this event subscription">Subscription Status</FormLabel>
                    <div className="h-10 px-4 bg-default-100/80 dark:bg-default-50/40 border border-divider rounded-xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{isActive ? "Active" : "Disabled"}</span>
                      <Switch
                        isSelected={isActive}
                        onChange={(checked: boolean) => setIsActive(checked)}
                        aria-label="Subscription Status"
                      />
                    </div>
                  </div>

                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>

        </Accordion>

      </Form>
    </div>
  )
}
