import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SupplierEcosystemIntelligenceEngine — "The Capacity Forecaster" (Phase 31)
 *
 * Allows a company to intelligently query if its upstream suppliers on the
 * network have the physical capacity to handle a massive surge.
 */
@Injectable()
export class SupplierEcosystemIntelligenceEngine {
  private readonly logger = new Logger(SupplierEcosystemIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates the supply chain risk and physical capacity of a supplier tenant!.
   */
  async evaluateSupplierCapacity(
    buyerTenantId: string,
    supplierTenantId: string,
    riskScore: number,
    isExhausted: boolean,
  ) {
    this.logger.debug(
      `Evaluating Supplier [${supplierTenantId}] for Buyer [${buyerTenantId}] - Risk: ${riskScore}`,
    );

    const intelligence = await this.prisma.supplierEcosystemIntelligence.create({
      data: {
        buyerTenantId,
        supplierTenantId,
        supplyRiskScore: riskScore,
        capacityStatus: isExhausted ? "EXHAUSTED" : "AVAILABLE",
      },
    });

    if (isExhausted) {
      this.logger.error(
        `SUPPLY CHAIN BLOCK: Supplier [${supplierTenantId}] is physically EXHAUSTED. AI Orchestrators will begin diverting automated procurement to secondary verified suppliers.`,
      );
    }

    return intelligence;
  }
}
