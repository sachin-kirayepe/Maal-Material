import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OperationalBottleneckEngine
 *
 * Connects infrastructure performance with business workflow SLAs.
 * If a Procurement workflow usually takes 2 seconds but is now taking 15,
 * this engine traces the exact node or external gateway causing the bottleneck.
 */
@Injectable()
export class OperationalBottleneckEngine {
  private readonly logger = new Logger(OperationalBottleneckEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates the duration of a workflow step against its historical SLA.
   */
  async traceWorkflowLatency(
    tenantId: string,
    workflowType: string,
    workflowInstance: string,
    bottleneckNode: string,
    latencyMs: number,
  ) {
    this.logger.debug(`Tracing workflow latency for [${workflowType}]: ${latencyMs}ms`);

    // Simulated SLA logic: Assume standard SLA is 500ms
    const SLA_MS = 500;

    if (latencyMs > SLA_MS * 4) {
      // e.g. > 2000ms
      this.logger.warn(`Severe bottleneck detected in ${workflowType} at node ${bottleneckNode}`);

      await this.prisma.operationalBottleneckTrace.create({
        data: {
          tenantId,
          workflowType,
          workflowInstance,
          bottleneckNode,
          latencyMs,
          isResolved: false,
        },
      });

      // We could optionally emit an anomaly event here to trigger self-healing (like scaling the node).
    }
  }
}
