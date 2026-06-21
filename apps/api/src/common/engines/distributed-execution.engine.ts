import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DistributedExecutionEngine — "The Ecosystem Conductor" (Phase 3O)
 *
 * Orchestrates multi-tenant tasks, ensuring distributed execution consensus
 * is achieved before finalizing transactions across the network boundaries.
 */
@Injectable()
export class DistributedExecutionEngine {
  private readonly logger = new Logger(DistributedExecutionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a distributed execution task across a collaboration node.
   */
  async dispatchSharedTask(
    tenantId: string,
    collaborationNodeId: string,
    taskDomain: string,
    payload: unknown,
  ) {
    this.logger.log(
      `Dispatching Distributed Task [${taskDomain}] over Node: ${collaborationNodeId}`,
    );

    return this.prisma.distributedExecutionTask.create({
      data: {
        tenantId,
        collaborationNodeId,
        taskDomain,
        status: "PENDING",
        payloadJson: JSON.stringify(payload),
        consensusState: "AWAITING",
      },
    });
  }

  /**
   * Records consensus from the partner tenant, advancing the workflow.
   */
  async recordConsensus(taskId: string, agreed: boolean) {
    this.logger.debug(`Recording Consensus for Task: ${taskId} | Agreed: ${agreed}`);

    return this.prisma.distributedExecutionTask.update({
      where: { id: taskId },
      data: {
        consensusState: agreed ? "ACHIEVED" : "REJECTED",
        status: agreed ? "IN_PROGRESS" : "FAILED",
      },
    });
  }
}
