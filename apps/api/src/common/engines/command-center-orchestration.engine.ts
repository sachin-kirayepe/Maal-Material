import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CommandCenterOrchestrationEngine — "The Overlord Console" (Phase 10)
 *
 * Serves as the aggregation layer, powering live industrial dashboards
 * with realtime telemetry and execution metrics from across the ecosystem.
 */
@Injectable()
export class CommandCenterOrchestrationEngine {
  private readonly logger = new Logger(CommandCenterOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a realtime command center session for a human operator.
   */
  async initializeSession(tenantId: string, userId: string, viewportConfig: unknown) {
    this.logger.log(
      `Initializing Command Center Session for User [${userId}] in Tenant [${tenantId}]`,
    );

    return this.prisma.industrialCommandCenterSession.create({
      data: {
        tenantId,
        activeUserId: userId,
        viewportConfig: JSON.stringify(viewportConfig),
      },
    });
  }

  /**
   * Aggregates the latest ecosystem state graph to push to the dashboard.
   */
  async fetchLiveDashboardState(tenantId: string): Promise<any> {
    this.logger.debug(`Fetching Live Execution Reality State for Tenant [${tenantId}]`);

    // In a real application, this would pull from Redis or a high-frequency bus.
    // For Phase 10, we pull the latest state from the ExecutionStateGraph.
    const liveStates = await this.prisma.executionStateGraph.findMany({
      where: { tenantId },
      orderBy: { lastObservedAt: "desc" },
      take: 100, // Top 100 active entities
    });

    return {
      activeEntities: liveStates.length,
      payloads: liveStates.map((state) => JSON.parse(state.telemetryPayload)),
    };
  }
}
