import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * ResilientGovernanceEngine — "The Fail-Safe Orchestrator" (Phase 3H)
 *
 * Automatically deploys `ResilientGovernanceProtocol` logic to isolate compromised systems,
 * downgrade autonomous permissions, or halt operations gracefully when trust boundaries
 * are breached or fatal anomalies occur.
 */
@Injectable()
export class ResilientGovernanceEngine {
  private readonly logger = new Logger(ResilientGovernanceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Registers a new resilient governance protocol.
   */
  async registerProtocol(
    tenantId: string,
    protocolName: string,
    triggerAnomaly: string,
    fallbackAction: unknown,
  ) {
    this.logger.log(
      `Registering Governance Protocol: [${protocolName}] Trigger: ${triggerAnomaly}`,
    );

    return this.prisma.resilientGovernanceProtocol.create({
      data: {
        tenantId,
        protocolName,
        triggerAnomaly,
        fallbackAction: JSON.stringify(fallbackAction),
        isActive: true,
      },
    });
  }

  /**
   * Evaluates an anomaly event and triggers any matching active governance protocols.
   */
  async triggerGovernanceProtocols(tenantId: string, anomalyType: string, anomalyEventId: string) {
    const protocols = await this.prisma.resilientGovernanceProtocol.findMany({
      where: {
        tenantId,
        triggerAnomaly: anomalyType,
        isActive: true,
      },
    });

    if (protocols.length === 0) {
      this.logger.debug(`No active governance protocols for Anomaly [${anomalyType}]`);
      return;
    }

    this.logger.error(
      `Critical Governance Action: Deploying ${protocols.length} resilient protocols for Anomaly [${anomalyType}]`,
    );

    for (const protocol of protocols) {
      this.logger.warn(`Executing Fallback: [${protocol.protocolName}]`);

      // Dispatching a high-priority system event to enforce the fallback action across the grid
      this.eventDispatcher.dispatch("governance", "resilience_protocol_activated", {
        tenantId,
        protocolId: protocol.id,
        anomalyEventId,
        fallbackAction: JSON.parse(protocol.fallbackAction),
      });
    }
  }
}
