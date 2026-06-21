import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * HistoricalCognitionEngine — "The Pattern Extractor" (Phase 4C)
 *
 * Manages HistoricalCognitionNodes, extracting reusable structural wisdom
 * from vast sets of past operational successes and failures.
 */
@Injectable()
export class HistoricalCognitionEngine {
  private readonly logger = new Logger(HistoricalCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Parses a historical event to extract a codified strategic pattern (wisdom).
   */
  async codifyHistoricalWisdom(
    tenantId: string,
    eventId: string,
    codifiedWisdom: unknown,
    confidence: number,
  ) {
    this.logger.debug(
      `Codifying historical wisdom [Event: ${eventId}] [Confidence: ${confidence}]`,
    );

    return this.prisma.historicalCognitionNode.create({
      data: {
        tenantId,
        historicalEventId: eventId,
        codifiedWisdomJson: JSON.stringify(codifiedWisdom),
        confidenceScore: confidence,
        isActive: true,
      },
    });
  }

  /**
   * Retrieves high-confidence historical lessons for active reasoning nodes.
   */
  async fetchHighConfidenceWisdom(tenantId: string, minConfidence: number = 0.85) {
    this.logger.log(
      `Scanning for historical cognition nodes with confidence >= ${minConfidence}...`,
    );

    const nodes = await this.prisma.historicalCognitionNode.findMany({
      where: {
        tenantId,
        isActive: true,
        confidenceScore: { gte: minConfidence },
      },
      orderBy: { confidenceScore: "desc" },
    });

    if (nodes.length > 0) {
      this.logger.log(`Found ${nodes.length} historical lessons ready for application.`);
    }

    return nodes;
  }
}
