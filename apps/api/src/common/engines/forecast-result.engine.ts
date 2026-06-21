import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ForecastResultEngine — "The Oracle's Output"
 *
 * Stores, retrieves, and compares forecast result sets across multiple
 * simulation runs for A/B analysis and strategic decision support.
 */
@Injectable()
export class ForecastResultEngine {
  private readonly logger = new Logger(ForecastResultEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Stores a forecast result set produced by a simulation execution run.
   */
  async storeResult(
    tenantId: string,
    executionRunId: string,
    predictedKPIs: Record<string, any>,
    resourceImpacts: unknown[],
    confidenceScore: number,
    costDelta?: number,
    timelineShiftDays?: number,
  ) {
    this.logger.log(`Storing Forecast Result for Run [${executionRunId}]`);

    const result = await this.prisma.forecastResultSet.create({
      data: {
        tenantId,
        executionRunId,
        predictedKPIs: JSON.stringify(predictedKPIs),
        resourceImpacts: JSON.stringify(resourceImpacts),
        confidenceScore,
        costDelta,
        timelineShiftDays,
      },
    });

    // Link result back to the execution run
    await this.prisma.scenarioExecutionRun.update({
      where: { id: executionRunId },
      data: { resultSetId: result.id },
    });

    return result;
  }

  /**
   * Compares two forecast result sets side-by-side for A/B scenario analysis.
   */
  async compareResults(resultIdA: string, resultIdB: string) {
    const [a, b] = await Promise.all([
      this.prisma.forecastResultSet.findUnique({ where: { id: resultIdA } }),
      this.prisma.forecastResultSet.findUnique({ where: { id: resultIdB } }),
    ]);

    if (!a || !b) throw new Error("One or both result sets not found.");

    const kpisA = JSON.parse(a.predictedKPIs);
    const kpisB = JSON.parse(b.predictedKPIs);

    const comparison: Record<string, { scenarioA: unknown; scenarioB: unknown }> = {};
    for (const key of new Set([...Object.keys(kpisA), ...Object.keys(kpisB)])) {
      comparison[key] = { scenarioA: kpisA[key], scenarioB: kpisB[key] };
    }

    this.logger.log(`Compared ${Object.keys(comparison).length} KPIs across two scenarios.`);
    return {
      kpiComparison: comparison,
      costDeltaA: a.costDelta,
      costDeltaB: b.costDelta,
      timelineShiftA: a.timelineShiftDays,
      timelineShiftB: b.timelineShiftDays,
    };
  }
}
