import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AgentGovernanceEngine — "The Zero-Trust Enforcer" (Phase 7A)
 *
 * Enforces AgentGovernanceCircuit constraints. The absolute safety net ensuring
 * no agent or swarm can execute cross-domain operations beyond their strict enterprise authorization.
 */
@Injectable()
export class AgentGovernanceEngine {
  private readonly logger = new Logger(AgentGovernanceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Provisions a legal operating boundary for a specific class of agent.
   */
  async provisionAgentBoundaries(
    tenantId: string,
    roleDomain: string,
    allowedDomains: string[],
    requireEscalation: boolean,
  ) {
    this.logger.log(
      `Provisioning Agent Governance Circuit: [${roleDomain}] [Allowed Domains: ${allowedDomains.join(", ")}]`,
    );

    return this.prisma.agentGovernanceCircuit.create({
      data: {
        tenantId,
        agentRoleDomain: roleDomain,
        allowedCollaborationDomainsJson: JSON.stringify(allowedDomains),
        requiresHumanEscalationOnFail: requireEscalation,
      },
    });
  }

  /**
   * Validates if a specific agent is legally allowed to negotiate or act within a target domain.
   */
  async validateAgentAuthority(
    tenantId: string,
    roleDomain: string,
    targetDomain: string,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Agent Authority: [Role: ${roleDomain}] attempting to access [Domain: ${targetDomain}]`,
    );

    const circuits = await this.prisma.agentGovernanceCircuit.findMany({
      where: { tenantId, agentRoleDomain: roleDomain },
    });

    if (circuits.length === 0) {
      this.logger.error(
        `CRITICAL: No governance circuit found for Agent Role ${roleDomain}. Defaulting to STRICT reject. Agent action BLOCKED.`,
      );
      return false; // Fail-secure. Unregistered agents cannot execute anything.
    }

    for (const circuit of circuits) {
      const allowedDomains = JSON.parse(circuit.allowedCollaborationDomainsJson) as string[];
      if (!allowedDomains.includes(targetDomain) && !allowedDomains.includes("*")) {
        this.logger.warn(
          `Agent Governance: Role ${roleDomain} is NOT authorized to operate within ${targetDomain}. Execution BLOCKED.`,
        );
        return false;
      }
    }

    this.logger.log(
      `Agent Governance: Authority validated. Agent ${roleDomain} is cleared to operate in ${targetDomain}.`,
    );
    return true; // The agent is acting within its legal bounds
  }
}
