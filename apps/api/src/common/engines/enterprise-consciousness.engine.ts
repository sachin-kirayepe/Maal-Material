import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseConsciousnessEngine — "The Global Synapse" (Phase 3Z)
 *
 * Synthesizes and routes EnterpriseConsciousnessSignals, orchestrating
 * massive, coordinated responses to civilization-scale industrial events.
 */
@Injectable()
export class EnterpriseConsciousnessEngine {
  private readonly logger = new Logger(EnterpriseConsciousnessEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Emits a civilization-scale consciousness signal (e.g., catastrophic shifts or macro opportunities).
   */
  async triggerConsciousnessSignal(tenantId: string, signalType: string, payload: unknown) {
    this.logger.warn(`Triggering Enterprise Consciousness Signal: [${signalType}]`);

    return this.prisma.enterpriseConsciousnessSignal.create({
      data: {
        tenantId,
        signalType,
        signalPayloadJson: JSON.stringify(payload),
        isAcknowledged: false,
      },
    });
  }

  /**
   * Resolves/acknowledges a global signal once the enterprise has adaptively realigned.
   */
  async acknowledgeSignal(signalId: string) {
    this.logger.log(`Acknowledging Enterprise Consciousness Signal [ID: ${signalId}]`);

    return this.prisma.enterpriseConsciousnessSignal.update({
      where: { id: signalId },
      data: { isAcknowledged: true },
    });
  }
}
