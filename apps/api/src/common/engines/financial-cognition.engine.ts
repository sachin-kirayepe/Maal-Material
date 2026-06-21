import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * FinancialCognitionEngine — "The Market Reader" (Phase 7B)
 *
 * Evaluates FinancialCognitionEdges. Translates external market signals (e.g. steel index)
 * into actionable internal financial execution paths (e.g. raising machine rental rates).
 */
@Injectable()
export class FinancialCognitionEngine {
  private readonly logger = new Logger(FinancialCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a macro-economic signal and maps it to a localized optimization algorithm.
   */
  async injectMacroSignal(
    tenantId: string,
    signalSource: string,
    optimizationNodeId: string,
    pricingAdjustmentFactor: number,
  ) {
    this.logger.log(
      `Injecting Macro Signal [Source: ${signalSource}] applying factor [${pricingAdjustmentFactor}x] to Node [${optimizationNodeId}]`,
    );

    return this.prisma.financialCognitionEdge.create({
      data: {
        tenantId,
        macroSignalSource: signalSource,
        targetOptimizationNodeId: optimizationNodeId,
        adjustedPricingFactor: pricingAdjustmentFactor,
        cognitionStatus: "EVALUATING",
      },
    });
  }

  /**
   * Approves or rejects the injected financial cognition edge.
   */
  async resolveCognitionSignal(edgeId: string, finalStatus: string) {
    this.logger.debug(`Resolving Financial Cognition Signal [${edgeId}] to ${finalStatus}`);

    return this.prisma.financialCognitionEdge.update({
      where: { id: edgeId },
      data: { cognitionStatus: finalStatus },
    });
  }
}
