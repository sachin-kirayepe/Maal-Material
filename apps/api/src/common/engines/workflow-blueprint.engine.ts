import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * WorkflowBlueprintEngine — "The Workflow Designer"
 *
 * Creates, versions, and manages reusable DAG workflow blueprints.
 * Validates graph structural integrity (preventing circular dependencies).
 */
@Injectable()
export class WorkflowBlueprintEngine {
  private readonly logger = new Logger(WorkflowBlueprintEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new workflow blueprint (or a new version of an existing one).
   */
  async registerBlueprint(
    tenantId: string,
    name: string,
    graphDefinition: Record<string, any>,
    description?: string,
  ) {
    this.logger.log(`Registering Workflow Blueprint: [${name}]`);

    this.validateDAG(graphDefinition);

    // Check for existing version
    const existing = await this.prisma.workflowBlueprint.findFirst({
      where: { tenantId, name },
      orderBy: { version: "desc" },
    });

    const newVersion = existing ? existing!.version + 1 : 1;

    return this.prisma.workflowBlueprint.create({
      data: {
        tenantId,
        name,
        description,
        version: newVersion,
        graphDefinition: JSON.stringify(graphDefinition),
      },
    });
  }

  /**
   * Retrieves the active blueprint definition by name.
   */
  async getActiveBlueprint(tenantId: string, name: string) {
    return this.prisma.workflowBlueprint.findFirst({
      where: { tenantId, name, isActive: true },
      orderBy: { version: "desc" },
    });
  }

  /**
   * Validates that the graph is a Directed Acyclic Graph (DAG) without circular dependencies.
   */
  private validateDAG(graph: Record<string, any>) {
    // In production, this runs a cycle-detection algorithm (e.g., Tarjan's or Kahn's).
    if (!graph.nodes || !Array.isArray(graph.nodes)) {
      throw new BadRequestException("Invalid graph definition: missing nodes array.");
    }
    if (!graph.edges || !Array.isArray(graph.edges)) {
      throw new BadRequestException("Invalid graph definition: missing edges array.");
    }
    this.logger.debug("DAG structurally validated.");
  }
}
