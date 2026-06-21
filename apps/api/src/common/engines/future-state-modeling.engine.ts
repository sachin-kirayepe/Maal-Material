import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * FutureStateModelingEngine — "The Probability Calculator" (Phase 4D)
 *
 * Manages FutureStateModelNodes, constantly recalculating the probability
 * of different forecasted futures as live data streams into the platform.
 */
@Injectable()
export class FutureStateModelingEngine {
  private readonly logger = new Logger(FutureStateModelingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a new forecasted future state based on current trajectories.
   */
  async forecastFutureState(
    tenantId: string,
    scenarioId: string,
    futureState: unknown,
    probability: number,
  ) {
    this.logger.debug(
      `Forecasting Future State [Scenario: ${scenarioId}] [Probability: ${probability}]`,
    );

    return this.prisma.futureStateModelNode.create({
      data: {
        tenantId,
        scenarioId,
        futureStateJson: JSON.stringify(futureState),
        occurrenceProbability: probability,
        isActive: true,
      },
    });
  }

  /**
   * Retrieves high-probability future states that require preemptive attention.
   */
  async fetchHighProbabilityFutures(tenantId: string, minProbability: number = 0.8) {
    this.logger.log(`Scanning for forecasted futures with probability >= ${minProbability}...`);

    const nodes = await this.prisma.futureStateModelNode.findMany({
      where: {
        tenantId,
        isActive: true,
        occurrenceProbability: { gte: minProbability },
      },
      orderBy: { occurrenceProbability: "desc" },
    });

    if (nodes.length > 0) {
      this.logger.log(`Found ${nodes.length} highly probable future scenarios.`);
    }

    return nodes;
  }
}
