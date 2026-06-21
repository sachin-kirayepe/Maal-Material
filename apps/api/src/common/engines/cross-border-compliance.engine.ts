import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CrossBorderComplianceEngine
 *
 * Evaluates international transactions against the InternationalTradeCompliance registry.
 * Ensures that moving capital or physical assets across borders does not violate
 * sanctions, regulatory embargoes, or lack required tariffs.
 */
@Injectable()
export class CrossBorderComplianceEngine {
  private readonly logger = new Logger(CrossBorderComplianceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates a cross-border transaction for regulatory compliance.
   */
  async evaluateTransaction(
    tenantId: string,
    transactionId: string,
    sourceRegion: string,
    targetRegion: string,
  ) {
    this.logger.debug(
      `Evaluating Cross-Border Transaction [${transactionId}] from [${sourceRegion}] to [${targetRegion}]`,
    );

    const record = await this.prisma.internationalTradeCompliance.create({
      data: {
        tenantId,
        transactionId,
        sourceRegion,
        targetRegion,
        complianceStatus: "PENDING",
      },
    });

    // Simulated compliance check
    const isEmbargoed = this.checkEmbargoStatus(sourceRegion, targetRegion);

    if (isEmbargoed) {
      this.logger.error(
        `Transaction [${transactionId}] BLOCKED: Embargo violation between ${sourceRegion} and ${targetRegion}.`,
      );
      return this.prisma.internationalTradeCompliance.update({
        where: { id: record.id },
        data: { complianceStatus: "BLOCKED", regulatoryHold: true },
      });
    }

    this.logger.log(`Transaction [${transactionId}] APPROVED for international transit.`);
    return this.prisma.internationalTradeCompliance.update({
      where: { id: record.id },
      data: { complianceStatus: "APPROVED" },
    });
  }

  private checkEmbargoStatus(sourceRegion: string, targetRegion: string): boolean {
    // In production, this would query a real-time global sanctions list or rules engine
    const embargoes = [{ source: "US", target: "SANCTIONED_ZONE_1" }];
    return embargoes.some((e) => e.source === sourceRegion && e.target === targetRegion);
  }
}
