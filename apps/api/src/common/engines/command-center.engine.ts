import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CommandCenterEngine
 *
 * Aggregates live data across the entire ecosystem (Digital Twins,
 * Financial Risk, Active Alerts, Logistics) to serve comprehensive
 * command-center views for Websocket/SSE broadcast.
 */
@Injectable()
export class CommandCenterEngine {
  private readonly logger = new Logger(CommandCenterEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a real-time aggregate payload for the Command Center UI.
   * This method would typically be polled by a WebSocket gateway
   * or triggered via an event stream.
   */
  async generateLiveCommandCenterPayload(tenantId: string) {
    this.logger.log(`Aggregating live command center payload for Tenant: ${tenantId}`);

    // 1. Fetch active, degraded, or moving digital twins
    const liveTwins = await this.prisma.digitalTwinState.findMany({
      where: {
        tenantId,
        OR: [{ healthStatus: { in: ["WARNING", "CRITICAL"] } }, { currentState: "IN_TRANSIT" }],
      },
      take: 50,
      orderBy: { updatedAt: "desc" },
    });

    // 2. Fetch unresolved critical alerts
    const activeAlerts = await this.prisma.operationalAlert.findMany({
      where: {
        tenantId,
        status: "OPEN",
        severity: { in: ["HIGH", "CRITICAL"] },
      } as any,
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    // 3. Fetch latest FinOps Snapshot
    const finOpsSnapshot = await this.prisma.finOpsAnalytics.findFirst({
      where: { tenantId },
      orderBy: { snapshotDate: "desc" },
    });

    // 4. Return aggregated payload for the UI
    return {
      timestamp: new Date(),
      tenantId,
      operationalStatus: activeAlerts.length > 5 ? "DEGRADED" : "HEALTHY",
      liveAssets: liveTwins.map((t) => ({
        id: (t as any).entityId,
        type: (t as any).entityType,
        status: t.currentState,
        health: t.healthStatus,
        lat: t.latitude,
        lng: t.longitude,
      })),
      alerts: activeAlerts.map((a) => ({
        id: a.id,
        type: a.type,
        severity: a.severity,
        message: a.message,
        time: a.createdAt,
      })),
      finances: finOpsSnapshot
        ? {
            netCashflow: finOpsSnapshot.netCashflow,
            outflows: finOpsSnapshot.totalOutflow,
          }
        : null,
    };
  }

  /**
   * Saves a custom command center dashboard layout.
   */
  async saveViewConfig(
    tenantId: string,
    viewName: string,
    layoutConfig: unknown,
    isDefault: boolean = false,
  ) {
    return this.prisma.commandCenterView.create({
      data: {
        tenantId,
        viewName,
        layoutConfig: JSON.stringify(layoutConfig),
        isDefault,
      },
    });
  }
}
