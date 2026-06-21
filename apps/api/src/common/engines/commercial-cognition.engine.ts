import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CommercialCognitionEngine — "The Profitability Scanner" (Phase 3Y)
 *
 * Synthesizes CommercialCognitionNode insights to proactively alert the
 * enterprise to hidden profitability risks or financial optimizations.
 */
@Injectable()
export class CommercialCognitionEngine {
  private readonly logger = new Logger(CommercialCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a profitability analysis for a specific workflow or supply-chain leg.
   */
  async mapProfitabilityNode(
    tenantId: string,
    workflowId: string,
    marginRisk: number,
    opportunity: unknown,
  ) {
    this.logger.debug(
      `Mapping Commercial Cognition Node [Workflow: ${workflowId}] [Risk: ${marginRisk}]`,
    );

    return this.prisma.commercialCognitionNode.create({
      data: {
        tenantId,
        targetWorkflowId: workflowId,
        marginDeteriorationRisk: marginRisk,
        optimizationOpportunityJson: JSON.stringify(opportunity),
      },
    });
  }

  /**
   * Scans the ecosystem for workflows with critical margin deterioration.
   */
  async detectMarginBleed(tenantId: string) {
    this.logger.log(`Scanning for margin bleed across the commercial grid...`);

    const criticalNodes = await this.prisma.commercialCognitionNode.findMany({
      where: {
        tenantId,
        marginDeteriorationRisk: { gt: 0.7 },
      },
      orderBy: { marginDeteriorationRisk: "desc" },
      take: 10,
    });

    if (criticalNodes.length > 0) {
      this.logger.warn(
        `CRITICAL: Found ${criticalNodes.length} workflows experiencing severe margin deterioration!`,
      );
    }

    return criticalNodes;
  }
}
