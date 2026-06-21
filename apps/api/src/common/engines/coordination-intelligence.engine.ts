import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CoordinationIntelligenceEngine — "The Workflow Orchestrator" (Phase 3R)
 *
 * Analyzes complex WorkflowDependencyNode records to dynamically untangle
 * and re-sequence highly coupled industrial workflows when disruptions occur.
 */
@Injectable()
export class CoordinationIntelligenceEngine {
  private readonly logger = new Logger(CoordinationIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a cross-tenant workflow dependency.
   */
  async registerDependency(
    tenantId: string,
    gridId: string,
    workflowId: string,
    blockedByNodeId: string,
    type: string,
  ) {
    this.logger.log(`Registering Execution Dependency for Workflow: ${workflowId}`);

    return this.prisma.workflowDependencyNode.create({
      data: {
        tenantId,
        gridId,
        workflowId,
        blockedByNodeId,
        dependencyType: type,
        dependencyStatus: "BLOCKED",
      },
    });
  }

  /**
   * Evaluates if a workflow is ready to proceed by checking its dependency graph.
   */
  async evaluateWorkflowReadiness(tenantId: string, workflowId: string): Promise<boolean> {
    this.logger.debug(`Evaluating Readiness for Workflow: ${workflowId}`);

    const blockers = await this.prisma.workflowDependencyNode.findMany({
      where: { tenantId, workflowId, dependencyStatus: "BLOCKED" },
    });

    if (blockers.length > 0) {
      this.logger.warn(`Workflow ${workflowId} is BLOCKED by ${blockers.length} dependencies.`);
      return false;
    }

    return true;
  }
}
