import { prisma } from "@/lib/prisma"
import { fetchRSSFeed } from "../ingestion/rss"
import { dispatchNotification } from "../notifications/dispatcher"

export interface WorkerJobResult {
  jobId: string
  taskType: string
  status: "Completed" | "Failed"
  itemsProcessed: number
}

export async function processBackgroundJob(taskType: "poll_sources" | "run_workflows" | "send_digest"): Promise<WorkerJobResult> {
  const jobId = `job_${Date.now()}`

  try {
    if (taskType === "poll_sources") {
      const activeSources = await prisma.source.findMany({
        where: { status: "Active" }
      })

      let itemsIngested = 0
      for (const src of activeSources) {
        const feedItems = await fetchRSSFeed(src.url)
        itemsIngested += feedItems.length

        await prisma.source.update({
          where: { id: src.id },
          data: {
            itemsIngested: { increment: feedItems.length },
            lastFetchedAt: new Date()
          }
        })
      }

      return {
        jobId,
        taskType,
        status: "Completed",
        itemsProcessed: itemsIngested
      }
    }

    if (taskType === "send_digest") {
      await dispatchNotification({
        event: "Daily System Digest",
        subscriptionName: "System Backup Incident Dispatcher",
        provider: "Email (Resend)",
        recipient: "admin@aipub.io"
      })

      return {
        jobId,
        taskType,
        status: "Completed",
        itemsProcessed: 1
      }
    }

    return {
      jobId,
      taskType,
      status: "Completed",
      itemsProcessed: 0
    }
  } catch (error: any) {
    return {
      jobId,
      taskType,
      status: "Failed",
      itemsProcessed: 0
    }
  }
}
