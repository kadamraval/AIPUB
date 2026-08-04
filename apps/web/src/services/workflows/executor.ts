import { prisma } from "@/lib/prisma"
import { eventBus } from "@/lib/event-bus"
import { NotificationService } from "../notifications/service"

export interface WorkflowExecuteOptions {
  workflowId: string
  inputData?: Record<string, any>
}

export interface WorkflowExecutionResult {
  executionId: string
  workflowId: string
  status: "Completed" | "Failed"
  durationMs: number
  logs: string[]
}

export async function executeWorkflow(options: WorkflowExecuteOptions): Promise<WorkflowExecutionResult> {
  const startTime = Date.now()
  const logs: string[] = []

  // 1. Fetch Workflow from PostgreSQL Database
  const workflow = await prisma.workflow.findUnique({
    where: { id: options.workflowId }
  })

  const workflowName = workflow?.name || "Newsroom Workflow"

  // Method 1 (Automatic Event): Emit Workflow Started
  eventBus.emitSystemEvent({
    eventName: "Workflow Started",
    module: "Workflow",
    action: "Started",
    entityId: options.workflowId,
    entityName: workflowName,
    status: "info"
  })

  logs.push(`[${new Date().toISOString()}] Workflow "${workflowName}" started.`)

  // Create Execution record in Database
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId: options.workflowId,
      status: "Running",
      startedAt: new Date()
    }
  })

  try {
    const nodes = (workflow?.nodesJson as any[]) || []

    // 2. Iterate through Workflow Canvas Nodes
    for (const node of nodes) {
      const nodeType = node.type || node.data?.label || ""
      logs.push(`Executing Node: ${nodeType}`)

      // Method 2: Direct Manual Notification Node in Workflow Canvas
      if (nodeType.toLowerCase().includes("notification") || node.data?.provider) {
        const provider = node.data?.provider || "Slack"
        const recipient = node.data?.recipient || "#publishing-alerts"
        const message = node.data?.message || `Immediate Workflow Alert from ${workflowName}`

        logs.push(`Executing Manual Notification Node: Sending directly via ${provider}...`)

        await NotificationService.sendDirectNotification({
          provider,
          recipient,
          title: `[WORKFLOW NODE] ${workflowName}`,
          message
        })

        logs.push(`Manual Notification Node dispatched to ${recipient}.`)
      }
    }

    const durationMs = Date.now() - startTime

    // Update Execution in Database
    await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: "Completed",
        durationMs,
        completedAt: new Date(),
        logsJson: logs
      }
    })

    // Method 1 (Automatic Event): Emit Workflow Completed Event
    eventBus.emitSystemEvent({
      eventName: "Workflow Completed",
      module: "Workflow",
      action: "Completed",
      entityId: options.workflowId,
      entityName: workflowName,
      status: "success"
    })

    return {
      executionId: execution.id,
      workflowId: options.workflowId,
      status: "Completed",
      durationMs,
      logs
    }
  } catch (error: any) {
    const durationMs = Date.now() - startTime
    logs.push(`Error executing workflow: ${error.message}`)

    await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: "Failed",
        durationMs,
        errorDetails: error.message,
        completedAt: new Date(),
        logsJson: logs
      }
    })

    // Method 1 (Automatic Event): Emit Workflow Failed Event
    eventBus.emitSystemEvent({
      eventName: "Workflow Failed",
      module: "Workflow",
      action: "Failed",
      entityId: options.workflowId,
      entityName: workflowName,
      status: "failed"
    })

    return {
      executionId: execution.id,
      workflowId: options.workflowId,
      status: "Failed",
      durationMs,
      logs
    }
  }
}
