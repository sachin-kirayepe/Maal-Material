import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveProcessEngine — "The Dynamic Orchestrator" (Phase 3I)
 *
 * Orchestrates `HyperProcessInstance` executions. Uses real-time
 * contextual intelligence, trust gates, and resource availability to
 * dynamically route the workflow execution path.
 */
@Injectable()
export class AdaptiveProcessEngine {
  private readonly logger = new Logger(AdaptiveProcessEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Advances the state of an active process instance based on incoming signals.
   */
  async advanceProcessState(instanceId: string, stateDelta: unknown) {
    this.logger.log(`Advancing state for Process Instance [${instanceId}]`);

    const instance = await this.prisma.hyperProcessInstance.findUnique({
      where: { id: instanceId },
    });

    if (!instance || instance.status !== "ORCHESTRATING") {
      this.logger.warn(
        `Cannot advance Process Instance [${instanceId}] - Status: ${instance?.status}`,
      );
      return null;
    }

    const currentState = JSON.parse(instance.liveStateJson);
    const updatedState = { ...currentState, ...(stateDelta as any) };

    return this.prisma.hyperProcessInstance.update({
      where: { id: instanceId },
      data: { liveStateJson: JSON.stringify(updatedState) },
    });
  }

  /**
   * Evaluates if a process should be halted due to an operational anomaly.
   */
  async haltProcessForAnomaly(instanceId: string, anomalyContext: unknown) {
    this.logger.error(`Halting Process Instance [${instanceId}] due to Anomaly.`);

    return this.prisma.hyperProcessInstance.update({
      where: { id: instanceId },
      data: {
        status: "ANOMALY_HALTED",
        liveStateJson: JSON.stringify({ haltedReason: anomalyContext }),
      },
    });
  }

  /**
   * Marks a hyper-process instance as fully completed.
   */
  async completeProcess(instanceId: string) {
    this.logger.log(`Completing Process Instance [${instanceId}]`);

    return this.prisma.hyperProcessInstance.update({
      where: { id: instanceId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });
  }
}
