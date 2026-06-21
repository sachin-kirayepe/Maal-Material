import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EventualConsistencyEngine
 *
 * Manages side-effects and background distributed sagas generated from
 * offline-first synchronization once connectivity is restored.
 */
@Injectable()
export class EventualConsistencyEngine {
  private readonly logger = new Logger(EventualConsistencyEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Queues an eventual consistency side-effect based on a successful offline operation.
   * Example: A field worker marks attendance offline; this queues the payroll deduction calculation.
   */
  async queueConsistencyTask(tenantId: string, sourceOperation: string, payload: unknown) {
    this.logger.debug(
      `Queueing eventual consistency task for ${sourceOperation} (Tenant: ${tenantId})`,
    );

    // In a real system, this would write to a specialized EventualQueue or Kafka topic.
    // We utilize the existing DistributedOperation model for saga tracking.
    const distributedOp = await this.prisma.distributedOperation.create({
      data: {
        tenantId,
        sagaId: `EC-${Date.now()}`,
        step: `RECONCILE_${sourceOperation}`,
        payload: JSON.stringify(payload),
        status: "STARTED",
      },
    });

    // Fire off async processing...
    this.processConsistencyTask(distributedOp.id).catch((err) => {
      this.logger.error(`Background processing failed for task ${distributedOp.id}:`, err);
    });

    return distributedOp;
  }

  /**
   * Processes the queued side-effect asynchronously to ensure no blocking on sync.
   */
  private async processConsistencyTask(operationId: string) {
    const operation = await this.prisma.distributedOperation.findUnique({
      where: { id: operationId },
    });

    if (!operation || operation.status !== "STARTED") return;

    try {
      // Execute domain-specific logic based on step type...
      this.logger.log(`Executing side effects for distributed step: ${operation.step}`);

      // Mark as completed
      await this.prisma.distributedOperation.update({
        where: { id: operationId },
        data: { status: "COMPLETED" },
      });
    } catch (error: unknown) {
      this.logger.error(`Eventual consistency failure: ${(error as any).message}`);
      // In a real system, trigger compensation logic here.
    }
  }
}
