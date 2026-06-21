import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * PlatformSelfAnalysisEngine — "The Introspective Architect" (Phase 13)
 *
 * Continuously analyzes the platform's macro architecture for optimization,
 * logging PlatformEvolutionInsights for structural resilience.
 */
@Injectable()
export class PlatformSelfAnalysisEngine {
  private readonly logger = new Logger(PlatformSelfAnalysisEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs an insight regarding macro-level platform architecture.
   */
  async logEvolutionInsight(
    tenantId: string,
    category: string,
    detail: unknown,
    change: unknown,
    severity: string = "LOW",
  ) {
    this.logger.log(
      `Logging Platform Evolution Insight [Category: ${category}] [Severity: ${severity}]`,
    );

    return this.prisma.platformEvolutionInsight.create({
      data: {
        tenantId,
        insightCategory: category,
        technicalDetail: JSON.stringify(detail),
        proposedChange: JSON.stringify(change),
        severity,
      },
    });
  }
}
