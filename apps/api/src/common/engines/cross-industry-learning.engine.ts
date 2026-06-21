import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CrossIndustryLearningEngine — "The Generalizer" (Phase 3N)
 *
 * Scans memory nodes for highly successful patterns in one domain (e.g., Heavy Machinery)
 * and distills them into best practices applicable to other domains (e.g., Construction).
 */
@Injectable()
export class CrossIndustryLearningEngine {
  private readonly logger = new Logger(CrossIndustryLearningEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Distills and publishes a new cross-industry best practice based on learned memories.
   */
  async distillBestPractice(
    tenantId: string,
    sourceIndustry: string,
    targetIndustry: string,
    practiceDetails: unknown,
    confidence: number,
  ) {
    this.logger.debug(
      `Distilling Cross-Industry Practice from [${sourceIndustry}] to [${targetIndustry}]`,
    );

    return this.prisma.crossIndustryBestPractice.create({
      data: {
        tenantId,
        sourceIndustry,
        targetIndustry,
        practiceJson: JSON.stringify(practiceDetails),
        confidenceScore: confidence,
      },
    });
  }

  /**
   * Retrieves high-confidence best practices applicable to a target industry.
   */
  async getApplicablePractices(
    tenantId: string,
    targetIndustry: string,
    minConfidence: number = 0.8,
  ) {
    return this.prisma.crossIndustryBestPractice.findMany({
      where: {
        tenantId,
        targetIndustry,
        confidenceScore: { gte: minConfidence },
      },
      orderBy: { confidenceScore: "desc" },
    });
  }
}
