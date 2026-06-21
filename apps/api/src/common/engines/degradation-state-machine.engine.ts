import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DegradationStateMachineEngine — "The Health Tracker"
 *
 * Manages the lifecycle of OperationalDegradationState records, transitioning services
 * through NOMINAL → DEGRADED → CRITICAL → RECOVERY states based on incoming fault telemetry.
 */
@Injectable()
export class DegradationStateMachineEngine {
  private readonly logger = new Logger(DegradationStateMachineEngine.name);

  private static readonly STATE_TRANSITIONS: Record<string, string[]> = {
    NOMINAL: ["DEGRADED"],
    DEGRADED: ["CRITICAL", "NOMINAL"],
    CRITICAL: ["RECOVERY"],
    RECOVERY: ["NOMINAL", "DEGRADED"],
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a fault against a service and transitions its degradation state if needed.
   */
  async recordFaultAndTransition(tenantId: string, serviceName: string) {
    this.logger.debug(`Recording fault for service [${serviceName}] in Tenant [${tenantId}]`);

    // Upsert the degradation state record
    let state = await this.prisma.operationalDegradationState.findUnique({
      where: { tenantId_serviceName: { tenantId, serviceName } },
    });

    if (!state) {
      state = await this.prisma.operationalDegradationState.create({
        data: { tenantId, serviceName, currentState: "NOMINAL", faultCount: 0 },
      });
    }

    const newFaultCount = state.faultCount + 1;
    let nextState = state.currentState;

    // Threshold-based state transitions
    if (state.currentState === "NOMINAL" && newFaultCount >= 3) {
      nextState = "DEGRADED";
    } else if (state.currentState === "DEGRADED" && newFaultCount >= 10) {
      nextState = "CRITICAL";
    }

    if (nextState !== state.currentState) {
      this.logger.warn(
        `SERVICE STATE TRANSITION: [${serviceName}] ${state.currentState} → ${nextState}`,
      );
    }

    return this.prisma.operationalDegradationState.update({
      where: { id: state.id },
      data: {
        faultCount: newFaultCount,
        currentState: nextState,
        lastTransitionAt: nextState !== state.currentState ? new Date() : state.lastTransitionAt,
      },
    });
  }

  /**
   * Marks a service as entering RECOVERY after a playbook executes.
   */
  async markRecovery(tenantId: string, serviceName: string) {
    this.logger.log(`Service [${serviceName}] entering RECOVERY state.`);
    return this.prisma.operationalDegradationState.update({
      where: { tenantId_serviceName: { tenantId, serviceName } },
      data: { currentState: "RECOVERY", lastTransitionAt: new Date() },
    });
  }

  /**
   * Resets a service back to NOMINAL after successful recovery.
   */
  async markNominal(tenantId: string, serviceName: string) {
    this.logger.log(`Service [${serviceName}] restored to NOMINAL.`);
    return this.prisma.operationalDegradationState.update({
      where: { tenantId_serviceName: { tenantId, serviceName } },
      data: { currentState: "NOMINAL", faultCount: 0, lastTransitionAt: new Date() },
    });
  }
}
