import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * StrategicPlanEngine — "The Decision Recorder"
 *
 * Records which strategic plan/scenario was ultimately chosen by human operators,
 * linking simulation evidence to the real-world decision for full audit traceability.
 */
@Injectable()
export class StrategicPlanEngine {
  private readonly logger = new Logger(StrategicPlanEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a strategic decision, linking it to the chosen scenario and rejected alternatives.
   */
  async recordDecision(
    tenantId: string,
    decisionTitle: string,
    chosenScenarioId: string,
    alternativeIds: string[],
    justification: string,
    decidedBy: string,
  ) {
    this.logger.log(
      `Recording Strategic Decision: [${decisionTitle}] — Chosen Scenario: [${chosenScenarioId}]`,
    );

    return this.prisma.strategicPlanDecision.create({
      data: {
        tenantId,
        decisionTitle,
        chosenScenarioId,
        alternativeIds: JSON.stringify(alternativeIds),
        justification,
        decidedBy,
      },
    });
  }

  /**
   * Retrieves the decision history for a tenant, ordered by most recent.
   */
  async getDecisionHistory(tenantId: string, limit: number = 20) {
    return this.prisma.strategicPlanDecision.findMany({
      where: { tenantId },
      orderBy: { decidedAt: "desc" },
      take: limit,
    });
  }

  /**
   * Retrieves the full decision context: the chosen scenario, alternatives, and justification.
   */
  async getDecisionContext(decisionId: string) {
    const decision = await this.prisma.strategicPlanDecision.findUnique({
      where: { id: decisionId },
    });
    if (!decision) throw new Error("Decision not found.");

    const chosenScenario = await this.prisma.simulationScenario.findUnique({
      where: { id: decision.chosenScenarioId },
    });

    const alternativeIds: string[] = JSON.parse(decision.alternativeIds);
    const alternatives = await this.prisma.simulationScenario.findMany({
      where: { id: { in: alternativeIds } },
    });

    return {
      decision,
      chosenScenario,
      alternatives,
    };
  }
}
