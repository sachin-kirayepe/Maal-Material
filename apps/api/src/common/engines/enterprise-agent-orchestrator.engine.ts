import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseAgentOrchestratorEngine
 *
 * Manages the deployment and task routing of specialized AI agents
 * (e.g., ProcurementBot, LogisticsBot) within a tenant's workspace.
 */
@Injectable()
export class EnterpriseAgentOrchestratorEngine {
  private readonly logger = new Logger(EnterpriseAgentOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Deploys a new specialized AI agent into a tenant's workforce.
   */
  async deployAgent(
    tenantId: string,
    agentName: string,
    specialization: string,
    configuration: unknown,
  ) {
    this.logger.log(
      `Deploying AI Agent [${agentName}] specializing in [${specialization}] for Tenant [${tenantId}]`,
    );

    return this.prisma.enterpriseAIAgent.create({
      data: {
        tenantId,
        agentName,
        specialization,
        configuration: JSON.stringify(configuration),
        status: "IDLE",
      },
    });
  }

  /**
   * Routes an operational task to the most appropriate active agent.
   */
  async routeTask(tenantId: string, domain: string, taskPayload: unknown) {
    this.logger.debug(`Routing task for domain ${domain} to an available AI agent.`);

    const availableAgent = await this.prisma.enterpriseAIAgent.findFirst({
      where: { tenantId, specialization: domain, status: "IDLE" },
    });

    if (!availableAgent) {
      this.logger.warn(`No IDLE agent found for domain ${domain}. Escalating to human queue.`);
      return null;
    }

    // Mark agent as working
    await this.prisma.enterpriseAIAgent.update({
      where: { id: availableAgent.id },
      data: { status: "WORKING" },
    });

    return availableAgent;
  }
}
