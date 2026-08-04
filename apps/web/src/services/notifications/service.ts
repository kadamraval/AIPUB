import { prisma } from "@/lib/prisma"
import { eventBus, SystemEventPayload } from "@/lib/event-bus"
import { AppriseAdapter, buildAppriseUrl } from "./apprise"

export interface ProcessEventOptions {
  eventPayload: SystemEventPayload
}

export class NotificationService {
  private static initialized = false

  /**
   * Initialize System Event Bus Listeners
   */
  public static initialize(): void {
    if (this.initialized) return

    eventBus.on("system-event", async (eventPayload: SystemEventPayload) => {
      await this.handleSystemEvent(eventPayload)
    })

    this.initialized = true
  }

  /**
   * Handle incoming system event (Method 1: Automatic Event Subscriptions)
   */
  public static async handleSystemEvent(eventPayload: SystemEventPayload): Promise<void> {
    try {
      // 1. Fetch active subscriptions from PostgreSQL matching event name or module
      const subscriptions = await prisma.notificationSubscription.findMany({
        where: {
          status: "Active"
        }
      })

      const matchingSubs = subscriptions.filter((sub) =>
        sub.events.some((e) =>
          e.toLowerCase() === eventPayload.eventName.toLowerCase() ||
          e.toLowerCase() === `${eventPayload.module} ${eventPayload.action}`.toLowerCase()
        )
      )

      if (matchingSubs.length === 0) return

      // 2. Process each matching subscription
      for (const sub of matchingSubs) {
        // Evaluate conditions if defined
        if (sub.conditions && sub.conditions !== "true") {
          const isConditionMet = this.evaluateCondition(sub.conditions, eventPayload)
          if (!isConditionMet) continue
        }

        // Parse provider endpoints map
        const recipientsMap = (sub.recipientsJson as Record<string, string>) || {}

        for (const provider of sub.providers) {
          const recipient = recipientsMap[provider] || "#publishing-alerts"

          // Render Template
          const renderedTitle = `[ALERT] ${eventPayload.eventName}: ${eventPayload.entityName || eventPayload.module}`
          const renderedBody = `System Event: ${eventPayload.eventName}\nEntity: ${eventPayload.entityName || "N/A"}\nStatus: ${eventPayload.status || "Info"}\nTimestamp: ${eventPayload.timestamp}`

          // Dispatch via Apprise Adapter
          const result = await AppriseAdapter.send({
            title: renderedTitle,
            body: renderedBody,
            provider,
            recipient
          })

          // Save Audit Log to PostgreSQL notification_logs
          await prisma.notificationLog.create({
            data: {
              subscriptionId: sub.id,
              event: eventPayload.eventName,
              provider,
              recipient,
              status: result.status,
              responsePayload: result.responsePayload
            }
          })

          // Update Subscription stats
          await prisma.notificationSubscription.update({
            where: { id: sub.id },
            data: {
              totalDelivered: { increment: 1 },
              lastTriggered: new Date()
            }
          })
        }
      }
    } catch (error) {
      console.error("Error processing Notification Service system event:", error)
    }
  }

  /**
   * Method 2: Immediate Manual Notification Node Execution (Bypasses Subscriptions)
   */
  public static async sendDirectNotification(options: {
    provider: string
    recipient: string
    title: string
    message: string
  }) {
    const result = await AppriseAdapter.send({
      title: options.title,
      body: options.message,
      provider: options.provider,
      recipient: options.recipient
    })

    // Record Audit Log in PostgreSQL
    const logEntry = await prisma.notificationLog.create({
      data: {
        event: "Manual Workflow Notification Node",
        provider: options.provider,
        recipient: options.recipient,
        status: result.status,
        responsePayload: result.responsePayload
      }
    })

    return { result, log: logEntry }
  }

  /**
   * Helper to evaluate simple condition strings
   */
  private static evaluateCondition(conditionStr: string, payload: SystemEventPayload): boolean {
    try {
      if (conditionStr.includes("status === 'success'") && payload.status !== "success") return false
      if (conditionStr.includes("errorCount > 0") && payload.status !== "failed") return false
      return true
    } catch (e) {
      return true
    }
  }
}

// Auto-initialize event listeners
NotificationService.initialize()
