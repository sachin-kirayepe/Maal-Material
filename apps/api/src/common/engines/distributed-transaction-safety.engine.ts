import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DistributedTransactionSafetyEngine — "The Arbiter" (Phase 17)
 *
 * Manages the DistributedExecutionLock to guarantee atomic operations
 * across isolated tenants executing a shared workflow over the network.
 */
@Injectable()
export class DistributedTransactionSafetyEngine {
  private readonly logger = new Logger(DistributedTransactionSafetyEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Acquires a distributed lock for a cross-tenant workflow.
   */
  async acquireLock(
    workflowId: string,
    lockedByTenantId: string,
    lockContext: unknown,
    expirationMs: number = 30000,
  ) {
    this.logger.log(
      `Acquiring Distributed Lock for Workflow [${workflowId}] by Tenant [${lockedByTenantId}]`,
    );

    const expiresAt = new Date(Date.now() + expirationMs);

    // Note: In a production clustered environment, this would use Redis or
    // a distributed consensus algorithm (Raft/Paxos). For this SQLite
    // architecture, we rely on atomic DB inserts with unique constraints.
    try {
      const lock = await this.prisma.distributedExecutionLock.create({
        data: {
          workflowId,
          lockedByTenantId,
          lockContext: JSON.stringify(lockContext),
          expiresAt,
        },
      });
      return lock;
    } catch (error) {
      this.logger.error(`Failed to acquire lock for Workflow [${workflowId}]. Deadlock prevented.`);
      throw new Error(`Distributed Lock Acquisition Failed for Workflow: ${workflowId}`);
    }
  }

  /**
   * Safely releases a distributed lock.
   */
  async releaseLock(workflowId: string, lockedByTenantId: string) {
    this.logger.log(
      `Releasing Distributed Lock for Workflow [${workflowId}] by Tenant [${lockedByTenantId}]`,
    );
    await this.prisma.distributedExecutionLock.deleteMany({
      where: {
        workflowId,
        lockedByTenantId,
      },
    });
  }
}
