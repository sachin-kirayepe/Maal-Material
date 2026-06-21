import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SimulationScenarioEngine — "The Scenario Designer"
 *
 * Creates, validates, and manages reusable "what-if" simulation scenario templates
 * with variable overrides against specific operational domains.
 */
@Injectable()
export class SimulationScenarioEngine {
  private readonly logger = new Logger(SimulationScenarioEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new simulation scenario template.
   */
  async createScenario(
    tenantId: string,
    scenarioName: string,
    targetDomain: string,
    variableOverrides: Record<string, any>,
    description?: string,
    baselineSnapshotId?: string,
  ) {
    this.logger.log(`Creating Simulation Scenario [${scenarioName}] for domain [${targetDomain}]`);

    return this.prisma.simulationScenario.create({
      data: {
        tenantId,
        scenarioName,
        targetDomain,
        variableOverrides: JSON.stringify(variableOverrides),
        baselineSnapshotId,
        description,
      },
    });
  }

  /**
   * Retrieves all active scenarios for a domain.
   */
  async getScenariosByDomain(tenantId: string, targetDomain: string) {
    return this.prisma.simulationScenario.findMany({
      where: { tenantId, targetDomain, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Deactivates a scenario template (soft delete).
   */
  async deactivateScenario(scenarioId: string) {
    this.logger.debug(`Deactivating scenario [${scenarioId}]`);
    return this.prisma.simulationScenario.update({
      where: { id: scenarioId },
      data: { isActive: false },
    });
  }
}
