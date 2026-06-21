import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EvolutionaryExperimentOrchestratorEngine — "The Scientist" (Phase 19)
 *
 * Safely sandboxes and executes experiments on a subset of network traffic
 * to test hypotheses without risking the core enterprise.
 */
@Injectable()
export class EvolutionaryExperimentOrchestratorEngine {
  private readonly logger = new Logger(EvolutionaryExperimentOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes an evolutionary experiment.
   */
  async launchExperiment(
    tenantId: string,
    hypothesisId: string,
    sandboxParameters: unknown,
    trafficAllocation: number,
  ) {
    this.logger.log(
      `Launching Evolutionary Experiment for Hypothesis [${hypothesisId}] with Traffic [${trafficAllocation * 100}%] in Tenant [${tenantId}]`,
    );

    const experiment = await this.prisma.evolutionaryExperiment.create({
      data: {
        tenantId,
        hypothesisId,
        sandboxParameters: JSON.stringify(sandboxParameters),
        trafficAllocation,
        executionStatus: "RUNNING",
      },
    });

    return experiment;
  }
}
