import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * UniversalWorkflowEngine — "The Hyper-Automation Library" (Phase 3I)
 *
 * Manages the lifecycle, versioning, and structural composition of
 * `HyperAutomationTemplate` records across all industrial domains.
 */
@Injectable()
export class UniversalWorkflowEngine {
  private readonly logger = new Logger(UniversalWorkflowEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new hyper-automation template.
   */
  async registerWorkflowTemplate(
    tenantId: string,
    workflowName: string,
    domain: string,
    executionGraph: unknown,
  ) {
    this.logger.log(`Registering Hyper-Automation Template: [${domain}] ${workflowName}`);

    return this.prisma.hyperAutomationTemplate.create({
      data: {
        tenantId,
        workflowName,
        domain,
        executionGraph: JSON.stringify(executionGraph),
        version: 1,
      },
    });
  }

  /**
   * Spawns a running instance from a workflow template.
   */
  async instantiateProcess(tenantId: string, templateId: string, initialContext: unknown) {
    this.logger.log(`Instantiating Adaptive Process from Template [${templateId}]`);

    return this.prisma.hyperProcessInstance.create({
      data: {
        tenantId,
        templateId,
        status: "ORCHESTRATING",
        liveStateJson: JSON.stringify(initialContext),
      },
    });
  }

  /**
   * Retrieves active automation templates for a specific enterprise domain.
   */
  async getActiveTemplates(tenantId: string, domain: string) {
    return this.prisma.hyperAutomationTemplate.findMany({
      where: { tenantId, domain, isActive: true },
      orderBy: { version: "desc" },
    });
  }
}
