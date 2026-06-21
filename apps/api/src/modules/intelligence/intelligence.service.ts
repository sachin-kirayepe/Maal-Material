import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class IntelligenceService {
  private readonly logger = new Logger(IntelligenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getSummary(tenantId: string) {
    this.logger.log(`Fetching intelligence summary for ${tenantId}`);

    // Aggregate key risk scores and pending recommendations
    const pendingRecommendations = await this.prisma.operationalRecommendation.count({
      where: { tenantId, status: "PENDING" },
    });

    const highRiskCustomers = await this.prisma.customerRiskProfile.count({
      where: { tenantId, recoveryPriority: "HIGH" },
    });

    const deadStockRisks = await this.prisma.inventoryPrediction.count({
      where: { tenantId, deadStockProb: { gt: 0.7 } },
    });

    return {
      pendingRecommendations,
      highRiskCustomers,
      deadStockRisks,
      systemStatus: "OPTIMAL",
    };
  }
}
