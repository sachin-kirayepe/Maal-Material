import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ConnectionPoolTelemetryEngine — "The DB Guardian" (Phase 21)
 *
 * Monitors Prisma connection health and query execution latency, tracking
 * telemetry to prevent database exhaustion.
 */
@Injectable()
export class ConnectionPoolTelemetryEngine {
  private readonly logger = new Logger(ConnectionPoolTelemetryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a snapshot of connection pool health.
   */
  async recordTelemetry(
    tenantId: string,
    activeConnections: number,
    idleConnections: number,
    waitingQueries: number,
    averageLatencyMs: number,
  ) {
    this.logger.debug(
      `Recording Connection Pool Telemetry for Tenant [${tenantId}] - Latency: ${averageLatencyMs}ms`,
    );

    const telemetry = await this.prisma.connectionPoolTelemetry.create({
      data: {
        tenantId,
        activeConnections,
        idleConnections,
        waitingQueries,
        averageLatencyMs,
      },
    });

    return telemetry;
  }
}
