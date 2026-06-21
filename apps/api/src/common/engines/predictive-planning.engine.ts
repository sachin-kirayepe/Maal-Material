import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * PredictivePlanningEngine — "The Strategist" (Phase 3M)
 *
 * Consumes forecasts and economic models to autonomously generate actionable
 * strategic blueprints (`PredictiveStrategicPlan`) for the enterprise.
 */
@Injectable()
export class PredictivePlanningEngine {
  private readonly logger = new Logger(PredictivePlanningEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a new strategic plan based on a given forecast or economic condition.
   */
  async generateStrategicPlan(tenantId: string, planName: string, actions: unknown) {
    this.logger.log(`Generating Predictive Strategic Plan: [${planName}]`);

    return this.prisma.predictiveStrategicPlan.create({
      data: {
        tenantId,
        planName,
        strategicActionJson: JSON.stringify(actions),
        status: "DRAFT", // Plans must be audited by governance before execution
      },
    });
  }

  /**
   * Promotes a strategic plan from Draft to Approved.
   */
  async approvePlan(planId: string) {
    this.logger.warn(`Strategic Plan Approved: [${planId}]`);

    return this.prisma.predictiveStrategicPlan.update({
      where: { id: planId },
      data: { status: "APPROVED" },
    });
  }

  /**
   * Retrieves all approved plans ready for active execution.
   */
  async getExecutablePlans(tenantId: string) {
    return this.prisma.predictiveStrategicPlan.findMany({
      where: { tenantId, status: "APPROVED" },
      orderBy: { generatedAt: "asc" },
    });
  }
}
