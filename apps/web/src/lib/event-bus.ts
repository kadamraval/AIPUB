import { EventEmitter } from "events"

export interface SystemEventPayload {
  eventName: string // e.g. "Workflow.Completed", "Article.Published", "Website.Failed"
  module: "Workflow" | "Agent" | "Article" | "Website" | "Sources" | "Files" | "Integrations" | "System"
  action: string
  entityId?: string
  entityName?: string
  status?: string // "success" | "failed" | "info"
  data?: Record<string, any>
  timestamp: string
}

class SystemEventBus extends EventEmitter {
  private static instance: SystemEventBus

  private constructor() {
    super()
    this.setMaxListeners(50)
  }

  public static getInstance(): SystemEventBus {
    if (!SystemEventBus.instance) {
      SystemEventBus.instance = new SystemEventBus()
    }
    return SystemEventBus.instance
  }

  /**
   * Automatically Emit System Event across all AIPUB modules
   */
  public emitSystemEvent(payload: Omit<SystemEventPayload, "timestamp">): void {
    const fullPayload: SystemEventPayload = {
      ...payload,
      timestamp: new Date().toISOString()
    }
    
    // Broadcast on specific event name (e.g. "Workflow.Completed")
    this.emit(payload.eventName, fullPayload)

    // Broadcast on global system channel
    this.emit("system-event", fullPayload)
  }
}

export const eventBus = SystemEventBus.getInstance()
export default eventBus
