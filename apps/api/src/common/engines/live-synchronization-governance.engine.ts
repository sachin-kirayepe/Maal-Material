import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * LiveSynchronizationGovernanceEngine — "The Reality Sentinel" (Phase 6C)
 *
 * Enforces LiveSynchronizationCircuit constraints. The ultimate safety net that ensures
 * the intelligent digital twin cannot execute unauthorized, unsafe autonomous actions against physical assets.
 */
@Injectable()
export class LiveSynchronizationGovernanceEngine {
  private readonly logger = new Logger(LiveSynchronizationGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Defines the physical safety boundaries for a domain within the digital twin.
   */
  async registerPhysicalSafetyCircuit(
    tenantId: string,
    domain: string,
    allowAutonomous: boolean,
    maxLatency: number,
  ) {
    this.logger.log(
      `Registering Live Synchronization Circuit: [${domain}] [Autonomous OK: ${allowAutonomous}] [Max Latency: ${maxLatency}ms]`,
    );

    return this.prisma.liveSynchronizationCircuit.create({
      data: {
        tenantId,
        physicalDomain: domain,
        allowAutonomousActuation: allowAutonomous,
        maxLatencyToleranceMs: maxLatency,
      },
    });
  }

  /**
   * Validates if the digital twin is safely allowed to actuate a physical real-world asset.
   */
  async validatePhysicalActuationSafety(
    tenantId: string,
    domain: string,
    currentTwinLatencyMs: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Physical Actuation [Domain: ${domain}] [Twin Latency: ${currentTwinLatencyMs}ms]`,
    );

    const circuits = await this.prisma.liveSynchronizationCircuit.findMany({
      where: { tenantId, physicalDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No live synchronization circuit found for ${domain}. Defaulting to STRICT reject. Physical actuation BLOCKED.`,
      );
      return false; // Fail-secure. No physical actuation without explicit boundaries.
    }

    for (const circuit of circuits) {
      if (!circuit.allowAutonomousActuation) {
        this.logger.warn(
          `Reality Governance: Domain ${domain} does not permit autonomous physical actuation. Execution BLOCKED.`,
        );
        return false;
      }

      if (currentTwinLatencyMs > circuit.maxLatencyToleranceMs) {
        this.logger.error(
          `CRITICAL: Digital Twin latency (${currentTwinLatencyMs}ms) exceeds the safety threshold for domain ${domain} (${circuit.maxLatencyToleranceMs}ms). The twin is too detached from reality to safely actuate physical assets.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Reality Governance: Physical actuation approved. The Digital Twin is safely synchronized with reality.`,
    );
    return true; // The AI can safely command the physical machine/asset
  }
}
