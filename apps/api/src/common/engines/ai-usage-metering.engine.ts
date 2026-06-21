import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AIUsageMeteringEngine — "The Compute Teller" (Phase 22)
 *
 * Calculates the precise financial cost of planetary AI orchestrations
 * and robotic workflows, logging them to the accounting ledger.
 */
@Injectable()
export class AIUsageMeteringEngine {
  private readonly logger = new Logger(AIUsageMeteringEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Meters an AI execution event and calculates financial cost.
   */
  async meterUsage(
    tenantId: string,
    engineName: string,
    computeTokens: number,
    executionTimeMs: number,
  ) {
    this.logger.debug(
      `Metering AI Usage [${engineName}] for Tenant [${tenantId}] - Tokens: ${computeTokens}`,
    );

    // Simple pricing model simulation ($0.0001 per token, $0.001 per ms)
    const tokenCost = computeTokens * 0.0001;
    const computeCost = executionTimeMs * 0.001;
    const billedCost = tokenCost + computeCost;

    const ledgerEntry = await this.prisma.aIUsageAccountingLedger.create({
      data: {
        tenantId,
        engineName,
        computeTokens,
        executionTimeMs,
        billedCost,
      },
    });

    return ledgerEntry;
  }
}
