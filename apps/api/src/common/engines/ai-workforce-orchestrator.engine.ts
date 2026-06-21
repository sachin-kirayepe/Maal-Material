import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AIWorkforceOrchestratorEngine — "The AI HR Director" (Phase 30)
 *
 * Manages the lifecycle, provisioning, and operational state of digital
 * autonomous agents operating within the enterprise.
 */
@Injectable()
export class AIWorkforceOrchestratorEngine {
  private readonly logger = new Logger(AIWorkforceOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Provisions a new AI agent with specific enterprise skills.
   */
  async provisionAgent(tenantId: string, agentClass: string, skills: string[]) {
    this.logger.log(`Provisioning new [${agentClass}] agent for Tenant [${tenantId}]`);

    const agent = await this.prisma.aIWorkforceAgent.create({
      data: {
        tenantId,
        agentClass,
        skillsJson: JSON.stringify(skills),
        operationalStatus: "IDLE",
      },
    });

    this.logger.debug(
      `Agent [${agent.id}] provisioned successfully and ready for task delegation.`,
    );
    return agent;
  }
}
