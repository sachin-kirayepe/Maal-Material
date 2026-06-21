import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MasterConsciousnessEngine — "The Apex Mind" (Phase 3Z)
 *
 * Orchestrates the MasterConsciousnessCore, synthesizing intelligence from
 * all 199 underlying engines to maintain a single, cohesive picture of enterprise reality.
 */
@Injectable()
export class MasterConsciousnessEngine {
  private readonly logger = new Logger(MasterConsciousnessEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synchronizes the absolute apex-level state of the enterprise.
   */
  async synchronizeMasterState(
    tenantId: string,
    systemicHealthIndex: number,
    globalCognitiveState: unknown,
  ) {
    this.logger.log(
      `Synchronizing Master Consciousness State. Systemic Health: ${systemicHealthIndex}`,
    );

    const core = await this.prisma.masterConsciousnessCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.masterConsciousnessCore.update({
        where: { id: core.id },
        data: {
          globalCognitiveStateJson: JSON.stringify(globalCognitiveState),
          systemicHealthIndex,
          lastSynchronizedAt: new Date(),
        },
      });
    } else {
      return this.prisma.masterConsciousnessCore.create({
        data: {
          tenantId,
          globalCognitiveStateJson: JSON.stringify(globalCognitiveState),
          systemicHealthIndex,
        },
      });
    }
  }

  /**
   * Evaluates if the civilization-scale enterprise is healthy enough to proceed with global shifts.
   */
  async evaluateGlobalReadiness(tenantId: string): Promise<boolean> {
    const core = await this.prisma.masterConsciousnessCore.findFirst({
      where: { tenantId },
    });

    if (!core) return false;

    if (core.systemicHealthIndex < 0.3) {
      this.logger.error(
        `CRITICAL: Enterprise Systemic Health is failing (${core.systemicHealthIndex}). Master Control HALTS all massive operational shifts.`,
      );
      return false;
    }

    return true;
  }
}
