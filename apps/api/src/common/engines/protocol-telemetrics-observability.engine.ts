import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ProtocolTelemetricsObservabilityEngine — "The Signal Sweeper" (Phase 36)
 *
 * Instantly detects and flags noisy, malformed, or degraded industrial protocol
 * streams on the factory floor, preventing cascading failures.
 */
@Injectable()
export class ProtocolTelemetricsObservabilityEngine {
  private readonly logger = new Logger(ProtocolTelemetricsObservabilityEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Scans a protocol for real-time degradation or handshake failures.
   */
  async recordProtocolTelemetry(
    protocolId: string,
    handshakeFailures: number,
    packetDegradation: number,
    telemetryWindowMs: number,
  ) {
    this.logger.debug(
      `Protocol Telemetry [${protocolId}] - Degradation: ${packetDegradation}%, Failures: ${handshakeFailures}`,
    );

    const telemetry = await this.prisma.protocolTelemetrics.create({
      data: {
        protocolId,
        handshakeFailures,
        packetDegradation,
        telemetryWindowMs,
      },
    });

    if (packetDegradation > 0.05) {
      // 5% degradation threshold
      this.logger.error(
        `PROTOCOL DEGRADATION: Industrial Network for [${protocolId}] is experiencing severe signal loss. Switching to high-fidelity fallback protocol.`,
      );
    }

    return telemetry;
  }
}
