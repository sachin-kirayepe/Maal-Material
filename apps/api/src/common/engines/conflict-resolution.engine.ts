import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * ConflictResolutionEngine
 *
 * Pluggable strategy engine for resolving offline-first data collisions.
 * Compares offline local payload vs current server state.
 */
@Injectable()
export class ConflictResolutionEngine {
  private readonly logger = new Logger(ConflictResolutionEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Evaluates a SyncOperation and applies deterministic conflict resolution.
   */
  async resolveSyncOperation(syncOpId: string) {
    const syncOp = await this.prisma.syncOperation.findUnique({
      where: { id: syncOpId },
      include: { queue: true },
    });

    if (!syncOp || syncOp.status !== "IN_PROGRESS") return;

    this.logger.debug(
      `Resolving sync operation ${syncOpId} for operation ${syncOp.queue.operation}`,
    );

    try {
      const payload = JSON.parse(syncOp.queue.payload);

      // Simulate fetching current server data based on operation type
      // In a real implementation, this dynamically queries the DB based on the entity.
      const serverDataMock = JSON.stringify({ version: 2, status: "MODIFIED_ON_SERVER" });
      const localDataStr = JSON.stringify(payload);

      // Determine Resolution Strategy (Pluggable logic based on Entity Type)
      // Example default: Server-Wins for Financials, Client-Wins for Field Notes
      let resolutionStatus = "PENDING";
      let actionTaken = "";

      if (
        syncOp.queue.operation.includes("FINANCE") ||
        syncOp.queue.operation.includes("INVOICE")
      ) {
        resolutionStatus = "SERVER_WINS";
        actionTaken = "Rejected local field change due to strict financial consistency rules.";
      } else if (
        syncOp.queue.operation.includes("ATTENDANCE") ||
        syncOp.queue.operation.includes("NOTE")
      ) {
        resolutionStatus = "LOCAL_WINS";
        actionTaken = "Accepted local field change (Offline worker data overrides server).";
      } else {
        resolutionStatus = "MERGED";
        actionTaken = "Auto-merged non-conflicting fields.";
      }

      // 1. Create Conflict Resolution Record
      const conflict = await this.prisma.conflictResolution.create({
        data: {
          syncOpId,
          entityType: syncOp.queue.operation, // Rough mapping for now
          entityId: payload.id || "unknown",
          localData: localDataStr,
          serverData: serverDataMock,
          resolution: resolutionStatus,
          resolvedBy: "SYSTEM_ENGINE",
        },
      });

      // 2. Create Audit Trail
      await this.prisma.reconciliationAudit.create({
        data: {
          conflictId: conflict.id,
          actionTaken,
          performedBy: "ConflictResolutionEngine",
          notes: `Auto-resolved via deterministic policy.`,
        },
      });

      // 3. Update SyncOperation and Queue Status
      await this.prisma.syncOperation.update({
        where: { id: syncOpId },
        data: {
          status: resolutionStatus === "SERVER_WINS" ? "CONFLICT" : "SUCCESS",
          completedAt: new Date(),
        },
      });

      await this.prisma.offlineQueue.update({
        where: { id: syncOp.queue.id },
        data: {
          status: resolutionStatus === "SERVER_WINS" ? "FAILED" : "SYNCED",
          errorMessage: resolutionStatus === "SERVER_WINS" ? actionTaken : null,
        },
      });

      // Dispatch downstream eventual consistency events if accepted
      if (resolutionStatus !== "SERVER_WINS") {
        this.eventDispatcher.dispatch("sync", "operation_resolved_and_applied", {
          queueId: syncOp.queue.id,
          operation: syncOp.queue.operation,
        });
      }
    } catch (error: unknown) {
      this.logger.error(`Failed to resolve sync operation ${syncOpId}: ${(error as any).message}`);
      await this.prisma.syncOperation.update({
        where: { id: syncOpId },
        data: { status: "CONFLICT", completedAt: new Date() },
      });
      await this.prisma.offlineQueue.update({
        where: { id: syncOp.queue.id },
        data: { status: "FAILED", errorMessage: (error as any).message },
      });
    }
  }
}
