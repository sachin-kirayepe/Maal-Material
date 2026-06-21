import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class RiskAnalysisService {
  private readonly logger = new Logger(RiskAnalysisService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCustomerRisks(tenantId: string) {
    this.logger.log(`Fetching customer risk profiles for ${tenantId}`);
    return this.prisma.customerRiskProfile.findMany({
      where: { tenantId },
      orderBy: { outstandingRisk: "desc" },
      take: 50,
    });
  }

  async getVendorIntelligence(tenantId: string) {
    return this.prisma.vendorIntelligence.findMany({
      where: { tenantId },
      orderBy: { reliabilityScore: "asc" }, // Prioritize those with lower scores for visibility
      take: 50,
    });
  }
}
