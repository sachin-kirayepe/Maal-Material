import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AgentCollaborationEngine — "The Negotiation Protocol" (Phase 7A)
 *
 * Manages AgentCollaborationEdges. Facilitates inter-agent reasoning, allowing
 * them to negotiate constraints and resolve operational conflicts collaboratively.
 */
@Injectable()
export class AgentCollaborationEngine {
  private readonly logger = new Logger(AgentCollaborationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initiates a negotiation session between two distinct autonomous agents.
   */
  async initiateAgentNegotiation(
    tenantId: string,
    sourceAgentId: string,
    targetAgentId: string,
    domain: string,
  ) {
    this.logger.debug(
      `Initiating Agent Negotiation: [${sourceAgentId}] <-> [${targetAgentId}] (Domain: ${domain})`,
    );

    return this.prisma.agentCollaborationEdge.create({
      data: {
        tenantId,
        sourceAgentId,
        targetAgentId,
        collaborationDomain: domain,
        negotiationStatus: "INITIATED",
      },
    });
  }

  /**
   * Updates the status of an ongoing inter-agent negotiation.
   */
  async resolveNegotiation(collaborationId: string, finalStatus: string) {
    this.logger.log(
      `Resolving Agent Negotiation [ID: ${collaborationId}] to status: ${finalStatus}`,
    );

    return this.prisma.agentCollaborationEdge.update({
      where: { id: collaborationId },
      data: { negotiationStatus: finalStatus },
    });
  }
}
