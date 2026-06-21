import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class RiskAssessmentService {
  private readonly logger = new Logger(RiskAssessmentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getRiskAssessments(tenantId: string) {
    this.logger.log(`Fetching risk assessments for ${tenantId}`);
    return this.prisma.riskAssessment.findMany({
      where: { tenantId },
      orderBy: { riskScore: "desc" },
      take: 100,
    });
  }
}
