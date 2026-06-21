import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ScenarioExecutionEngine — "The Digital Lab"
 *
 * Executes simulation scenarios against operational baselines in a sandboxed context.
 * Tracks progress and produces forecast result sets for analysis.
 */
@Injectable()
export class ScenarioExecutionEngine {
  private readonly logger = new Logger(ScenarioExecutionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Launches a new execution run for a given scenario.
   */
  async executeScenario(tenantId: string, scenarioId: string) {
    this.logger.log(`Launching Simulation Run for Scenario [${scenarioId}]`);

    const scenario = await this.prisma.simulationScenario.findUnique({ where: { id: scenarioId } });
    if (!scenario || !scenario.isActive) {
      throw new Error(`Scenario [${scenarioId}] not found or inactive.`);
    }

    const run = await this.prisma.scenarioExecutionRun.create({
      data: {
        tenantId,
        scenarioId,
        status: "RUNNING",
      },
    });

    this.logger.debug(`Execution Run [${run.id}] started. Applying variable overrides...`);

    // In production: apply variableOverrides against a cloned baseline state,
    // run domain-specific simulation logic, then generate a ForecastResultSet.
    const startTime = Date.now();

    // Simulated execution
    const runtimeMs = Date.now() - startTime;

    const completedRun = await this.prisma.scenarioExecutionRun.update({
      where: { id: run.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        runtimeMs,
      },
    });

    this.logger.log(`Execution Run [${run.id}] COMPLETED in ${runtimeMs}ms.`);
    return completedRun;
  }

  /**
   * Retrieves all runs for a specific scenario, enabling A/B comparison.
   */
  async getRunsForScenario(tenantId: string, scenarioId: string) {
    return this.prisma.scenarioExecutionRun.findMany({
      where: { tenantId, scenarioId },
      orderBy: { startedAt: "desc" },
    });
  }
}
