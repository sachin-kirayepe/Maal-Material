import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class OperationalAnalyticsService {
  private readonly logger = new Logger(OperationalAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getContractorAnalytics(tenantId: string) {
    this.logger.log(`Fetching contractor analytics for ${tenantId}`);
    return this.prisma.contractorAnalytics.findMany({
      where: { tenantId },
      orderBy: { churnRisk: "desc" },
      take: 50,
    });
  }

  async getAIWorkflows(tenantId: string) {
    return this.prisma.aIWorkflow.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
  }
}
