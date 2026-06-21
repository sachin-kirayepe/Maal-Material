import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * ContinuousOptimizationEngine — "The Gradient Descender" (Phase 3C)
 *
 * Manages continuous improvement goals across industrial domains. Each goal
 * targets a specific KPI (e.g., "Reduce procurement latency by 15%"),
 * tracks progress against a baseline, and evaluates AI-proposed optimization
 * strategies over time.
 */
@Injectable()
export class ContinuousOptimizationEngine {
  private readonly logger = new Logger(ContinuousOptimizationEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Creates a new continuous optimization goal.
   */
  async createGoal(
    tenantId: string,
    goalName: string,
    targetDomain: string,
    metricName: string,
    baselineValue: number,
    targetValue: number,
    strategies?: unknown,
  ) {
    this.logger.log(
      `Optimization Goal Created: [${goalName}] — Baseline: ${baselineValue}, Target: ${targetValue}`,
    );

    return this.prisma.continuousOptimizationGoal.create({
      data: {
        tenantId,
        goalName,
        targetDomain,
        metricName,
        baselineValue,
        targetValue,
        strategiesJson: strategies ? JSON.stringify(strategies) : null,
        status: "ACTIVE",
      },
    });
  }

  /**
   * Updates the current metric value and evaluates goal progress.
   */
  async updateProgress(goalId: string, currentValue: number) {
    const goal = await this.prisma.continuousOptimizationGoal.findUnique({
      where: { id: goalId },
    });
    if (!goal || goal.status !== "ACTIVE") return null;

    const isMinimizing = goal.targetValue < goal.baselineValue;
    const achieved = isMinimizing
      ? currentValue <= goal.targetValue
      : currentValue >= goal.targetValue;

    const newStatus = achieved ? "ACHIEVED" : "ACTIVE";

    this.logger.log(
      `Goal [${goal.goalName}] Progress: ${currentValue} (Target: ${goal.targetValue}) — ${newStatus}`,
    );

    const updated = await this.prisma.continuousOptimizationGoal.update({
      where: { id: goalId },
      data: { currentValue, status: newStatus },
    });

    if (achieved) {
      this.eventDispatcher.dispatch("intelligence", "optimization_goal_achieved", {
        tenantId: goal.tenantId,
        goalId: goal.id,
        goalName: goal.goalName,
      });
    }

    return updated;
  }

  /**
   * Retrieves all active optimization goals for a domain.
   */
  async getActiveGoals(tenantId: string, targetDomain?: string) {
    return this.prisma.continuousOptimizationGoal.findMany({
      where: {
        tenantId,
        status: "ACTIVE",
        ...(targetDomain ? { targetDomain } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
