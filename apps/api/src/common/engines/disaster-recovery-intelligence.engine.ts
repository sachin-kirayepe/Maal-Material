import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DisasterRecoveryIntelligenceEngine — "The Resilience Architect" (Phase 27)
 *
 * Continuously runs chaos engineering simulations to validate automated
 * disaster playbooks and pre-calculate recovery scenarios.
 */
@Injectable()
export class DisasterRecoveryIntelligenceEngine {
  private readonly logger = new Logger(DisasterRecoveryIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records the outcome of an AI-simulated disaster scenario.
   */
  async simulateDisasterScenario(
    name: string,
    impactJson: unknown,
    playbookJson: unknown,
    isSuccess: boolean,
  ) {
    this.logger.log(`Simulating Disaster Recovery Scenario: [${name}] | Success: ${isSuccess}`);

    const intelligence = await this.prisma.disasterRecoveryIntelligence.create({
      data: {
        scenarioName: name,
        simulatedImpact: JSON.stringify(impactJson),
        recoveryPlaybook: JSON.stringify(playbookJson),
        simulationSuccess: isSuccess,
        lastTestedAt: new Date(),
      },
    });

    if (!isSuccess) {
      this.logger.error(
        `DISASTER SIMULATION FAILED: The current playbook for [${name}] cannot successfully recover the system. Immediate human review required.`,
      );
    }

    return intelligence;
  }
}
