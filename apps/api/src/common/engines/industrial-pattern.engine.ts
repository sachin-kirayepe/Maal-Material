import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * IndustrialPatternEngine — "The Pattern Hunter" (Phase 3C)
 *
 * Detects, records, and reinforces recurring operational patterns across
 * industrial domains. When a pattern (e.g., "Friday procurement spikes" or
 * "monsoon supplier delays") is observed repeatedly, confidence increases
 * and the platform can preemptively adapt.
 */
@Injectable()
export class IndustrialPatternEngine {
  private readonly logger = new Logger(IndustrialPatternEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Registers a new pattern or reinforces an existing one.
   */
  async registerOrReinforcePattern(
    tenantId: string,
    patternName: string,
    patternDomain: string,
    signatureData: unknown,
    confidence: number,
  ) {
    // Check if pattern already exists
    const existing = await this.prisma.industrialPatternSignature.findFirst({
      where: { tenantId, patternName, patternDomain },
    });

    if (existing) {
      // Reinforce: increase frequency, update confidence via moving average
      const newFrequency = existing!.frequency + 1;
      const newConfidence =
        (existing!.confidence * existing!.frequency + confidence) / newFrequency;

      this.logger.log(
        `Reinforcing Pattern [${patternName}] — Frequency: ${newFrequency}, Confidence: ${newConfidence.toFixed(3)}`,
      );

      const updated = await this.prisma.industrialPatternSignature.update({
        where: { id: existing!.id },
        data: {
          frequency: newFrequency,
          confidence: newConfidence,
          signatureJson: JSON.stringify(signatureData),
          lastObservedAt: new Date(),
        },
      });

      if (newConfidence > 0.85 && existing!.confidence <= 0.85) {
        this.eventDispatcher.dispatch("intelligence", "pattern_high_confidence", {
          tenantId,
          patternName,
          confidence: newConfidence,
        });
      }

      return updated;
    }

    // New pattern
    this.logger.log(`New Pattern Discovered: [${patternName}] in [${patternDomain}]`);

    return this.prisma.industrialPatternSignature.create({
      data: {
        tenantId,
        patternName,
        patternDomain,
        signatureJson: JSON.stringify(signatureData),
        confidence,
      },
    });
  }

  /**
   * Retrieves high-confidence patterns for a domain to drive preemptive actions.
   */
  async getActivePatterns(tenantId: string, patternDomain: string, minConfidence: number = 0.5) {
    return this.prisma.industrialPatternSignature.findMany({
      where: {
        tenantId,
        patternDomain,
        isActive: true,
        confidence: { gte: minConfidence },
      },
      orderBy: { confidence: "desc" },
    });
  }
}
