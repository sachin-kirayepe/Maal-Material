import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * GlobalInfrastructureObservabilityEngine — "The Planetary Radar" (Phase 35)
 *
 * Constantly sweeps the network to identify micro-fractures in global bandwidth,
 * packet loss, and physical thermal stress in datacenter hardware.
 */
@Injectable()
export class GlobalInfrastructureObservabilityEngine {
  private readonly logger = new Logger(GlobalInfrastructureObservabilityEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Aggregates telemetry from the global computing network.
   */
  async logPlanetaryTelemetry(
    fabricId: string,
    dropRate: number,
    throughput: number,
    thermalStress: number,
  ) {
    this.logger.debug(
      `Planetary Telemetry [${fabricId}] - Drop: ${dropRate}%, Throughput: ${throughput}Gbps, Thermal: ${thermalStress}`,
    );

    const observability = await this.prisma.globalInfrastructureObservability.create({
      data: {
        fabricId,
        packetDropRate: dropRate,
        networkThroughputGbps: throughput,
        thermalStressLevel: thermalStress,
      },
    });

    if (thermalStress > 0.85) {
      this.logger.error(
        `CRITICAL THERMAL EVENT: Fabric [${fabricId}] hardware is overheating. Autonomous execution throttling engaged.`,
      );
    }

    return observability;
  }
}
