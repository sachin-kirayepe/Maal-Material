import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * EdgeSyncOrchestratorEngine
 *
 * Orchestrates the ingestion of offline queues from field devices.
 * Groups operations into sessions, batches them, and generates SyncOperations
 * for the ConflictResolutionEngine to process.
 */
@Injectable()
export class EdgeSyncOrchestratorEngine {
  private readonly logger = new Logger(EdgeSyncOrchestratorEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Initializes a new synchronization session for an edge device.
   */
  async startSyncSession(tenantId: string, deviceId: string) {
    this.logger.log(`Starting edge sync session for device ${deviceId} (Tenant: ${tenantId})`);

    const session = await this.prisma.edgeSyncSession.create({
      data: {
        tenantId,
        deviceId,
        status: "IN_PROGRESS",
      },
    });

    return session;
  }

  /**
   * Processes an incoming batch of offline queue items from a device.
   */
  async ingestOfflineQueueBatch(sessionId: string, queueItems: unknown[]) {
    const session = await this.prisma.edgeSyncSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error(`Sync session ${sessionId} not found`);
    }

    let successCount = 0;

    for (const item of queueItems) {
      // 1. Store raw offline queue item
      const queueRecord = await this.prisma.offlineQueue.create({
        data: {
          tenantId: session.tenantId,
          deviceId: session.deviceId,
          operation: (item as any).operation,
          payload: JSON.stringify((item as any).payload),
          status: "PENDING",
        },
      });

      // 2. Generate a SyncOperation for tracking resolution
      const syncOp = await this.prisma.syncOperation.create({
        data: {
          queueId: queueRecord.id,
          status: "IN_PROGRESS",
        },
      });

      // 3. Dispatch to ConflictResolutionEngine via internal event bus
      this.eventDispatcher.dispatch("sync", "operation_ingested", {
        sessionId: session.id,
        syncOpId: syncOp.id,
        tenantId: session.tenantId,
      });

      successCount++;
    }

    // Update session metrics
    await this.prisma.edgeSyncSession.update({
      where: { id: session.id },
      data: {
        uploadedBytes: { increment: JSON.stringify(queueItems).length },
      },
    });

    return { processed: successCount };
  }

  /**
   * Finalizes the sync session, marking overall success or failure.
   */
  async finalizeSyncSession(
    sessionId: string,
    status: "SUCCESS" | "PARTIAL" | "FAILED",
    error?: string,
  ) {
    this.logger.log(`Finalizing sync session ${sessionId} with status ${status}`);

    await this.prisma.edgeSyncSession.update({
      where: { id: sessionId },
      data: {
        status,
        completedAt: new Date(),
        errorMessage: error || null,
      },
    });

    // Optionally update the device's lastSyncAt
    const session = await this.prisma.edgeSyncSession.findUnique({
      where: { id: sessionId },
      include: { device: true },
    });

    if (session && status !== "FAILED") {
      await this.prisma.offlineDevice.update({
        where: { id: session.deviceId },
        data: { lastSyncAt: new Date() },
      });
    }
  }
}
