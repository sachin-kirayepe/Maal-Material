import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CoordinationGovernanceEngine — "The Critical-Path Guardian" (Phase 5B)
 *
 * Enforces CoordinationGovernanceCircuit constraints. Evaluates the risk profile of
 * dynamic re-routings to ensure critical-path operations are never disrupted.
 */
@Injectable()
export class CoordinationGovernanceEngine {
  private readonly logger = new Logger(CoordinationGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a governance circuit for autonomous workflow coordination.
   */
  async registerCoordinationCircuit(
    tenantId: string,
    domain: string,
    allowDynamic: boolean,
    maxLatencyMs: number,
  ) {
    this.logger.log(
      `Registering Coordination Governance Circuit: [${domain}] [Allow Dynamic Reroute: ${allowDynamic}]`,
    );

    return this.prisma.coordinationGovernanceCircuit.create({
      data: {
        tenantId,
        orchestrationDomain: domain,
        allowDynamicRerouting: allowDynamic,
        maxLatencyToleranceMs: maxLatencyMs,
      },
    });
  }

  /**
   * Validates if the autonomous orchestration engine is permitted to dynamically reroute a specific domain.
   */
  async validateDynamicRerouting(
    tenantId: string,
    domain: string,
    expectedLatencyMs: number,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Dynamic Rerouting [Domain: ${domain}] [Expected Latency: ${expectedLatencyMs}ms]`,
    );

    const circuits = await this.prisma.coordinationGovernanceCircuit.findMany({
      where: { tenantId, orchestrationDomain: domain },
    });

    if (circuits.length === 0) {
      this.logger.warn(
        `No coordination governance circuit found for ${domain}. Defaulting to STRICT reject. Dynamic rerouting BLOCKED.`,
      );
      return false; // Fail-secure. Immutable execution path.
    }

    for (const circuit of circuits) {
      if (!circuit.allowDynamicRerouting) {
        this.logger.warn(
          `Coordination Governance: Domain ${domain} is locked to its critical path. Dynamic optimization BLOCKED.`,
        );
        return false;
      }

      if (expectedLatencyMs > circuit.maxLatencyToleranceMs) {
        this.logger.error(
          `CRITICAL: Rerouting latency (${expectedLatencyMs}ms) exceeds allowed tolerance (${circuit.maxLatencyToleranceMs}ms). PREVENTING OPTIMIZATION.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Coordination Governance: Dynamic execution optimization validated and approved.`,
    );
    return true; // The AI can safely reroute the execution
  }
}
