import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CivilizationOperatingEngine — "The Macro Observer" (Phase 3V)
 *
 * Ingests CivilizationOperatingSignals to trigger massive, coordinated
 * preemptive shifts across the entire multi-industry grid.
 */
@Injectable()
export class CivilizationOperatingEngine {
  private readonly logger = new Logger(CivilizationOperatingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Broadcasts a civilization-scale operational shift across the ecosystem.
   */
  async broadcastMacroSignal(
    tenantId: string,
    origin: string,
    payload: unknown,
    urgency: number,
    impactedSectors: string[],
  ) {
    this.logger.error(
      `CIVILIZATION OPERATING SIGNAL DETECTED [Origin: ${origin}] [Urgency: ${urgency}]`,
    );

    return this.prisma.civilizationOperatingSignal.create({
      data: {
        tenantId,
        signalOrigin: origin,
        signalPayloadJson: JSON.stringify(payload),
        urgencyLevel: urgency,
        impactedSectorsJson: JSON.stringify(impactedSectors),
      },
    });
  }

  /**
   * Retrieves high-urgency macro signals for cross-industry mitigation.
   */
  async getActiveMacroSignals(tenantId: string) {
    this.logger.log(`Scanning for active Civilization-scale operating signals...`);

    return this.prisma.civilizationOperatingSignal.findMany({
      where: { tenantId, urgencyLevel: { gte: 0.8 } },
      orderBy: { createdAt: "desc" },
    });
  }
}
