import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * UniversalSuperintelligenceEngine — "The Macro Cognition Core" (Phase 7C)
 *
 * Orchestrates UniversalSuperintelligenceCore. Calculates the enterprise IQ
 * and drives system-wide macro-awareness across all operational domains.
 */
@Injectable()
export class UniversalSuperintelligenceEngine {
  private readonly logger = new Logger(UniversalSuperintelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates and syncs the absolute civilization cognition index across the enterprise.
   */
  async calculateCivilizationCognition(tenantId: string, iqIndex: number, synthesisCount: number) {
    this.logger.log(
      `Syncing Universal Superintelligence [IQ Index: ${iqIndex}] [Total Syntheses: ${synthesisCount}]`,
    );

    const core = await this.prisma.universalSuperintelligenceCore.findFirst({
      where: { tenantId },
    });

    if (core) {
      return this.prisma.universalSuperintelligenceCore.update({
        where: { id: core.id },
        data: {
          civilizationCognitionIndex: iqIndex,
          totalCrossDomainSyntheses: synthesisCount,
          lastCognitionSyncAt: new Date(),
        },
      });
    } else {
      return this.prisma.universalSuperintelligenceCore.create({
        data: {
          tenantId,
          civilizationCognitionIndex: iqIndex,
          totalCrossDomainSyntheses: synthesisCount,
        },
      });
    }
  }
}
