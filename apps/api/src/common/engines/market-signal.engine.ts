import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * MarketSignalEngine — "The Economic Radar" (Phase 3E)
 *
 * Ingests external macroeconomic data, price indexes, or internal supply-chain disruptions
 * and translates them into high-confidence `IndustrialMarketSignal` records.
 * Dispatches alerts when severe market volatility is detected.
 */
@Injectable()
export class MarketSignalEngine {
  private readonly logger = new Logger(MarketSignalEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Registers a new detected market signal.
   */
  async registerSignal(
    signalType: string,
    domain: string,
    regionCode: string,
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    confidence: number,
    signalData: unknown,
    tenantId?: string,
  ) {
    this.logger.log(
      `Registering Market Signal: [${severity}] ${signalType} in ${domain} (${regionCode}) - Confidence: ${confidence}`,
    );

    const signal = await this.prisma.industrialMarketSignal.create({
      data: {
        tenantId,
        signalType,
        domain,
        regionCode,
        severity,
        confidence,
        signalDataJson: JSON.stringify(signalData),
        isActive: true,
      },
    });

    if (severity === "CRITICAL" && confidence > 0.8) {
      this.logger.warn(
        `CRITICAL Market Signal detected in ${domain}. Dispatching ecosystem-wide alert.`,
      );
      this.eventDispatcher.dispatch("economics", "critical_market_signal", {
        signalId: signal.id,
        domain,
        regionCode,
      });
    }

    return signal;
  }

  /**
   * Retrieves active market signals for a specific domain/region.
   */
  async getActiveSignals(domain: string, regionCode: string) {
    return this.prisma.industrialMarketSignal.findMany({
      where: {
        domain,
        regionCode,
        isActive: true,
      },
      orderBy: { detectedAt: "desc" },
    });
  }

  /**
   * Resolves a signal once the market volatility has stabilized.
   */
  async resolveSignal(signalId: string) {
    this.logger.log(`Resolving Market Signal [${signalId}]. Market stabilized.`);
    return this.prisma.industrialMarketSignal.update({
      where: { id: signalId },
      data: { isActive: false },
    });
  }
}
