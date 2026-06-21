import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CrossIndustryOrchestratorEngine — "The Ecosystem Bridge"
 *
 * Orchestrates multi-domain operations. Resolves dependencies when a
 * workflow requires participants from strictly different industry silos.
 */
@Injectable()
export class CrossIndustryOrchestratorEngine {
  private readonly logger = new Logger(CrossIndustryOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a workflow that spans multiple industry domains.
   */
  async defineCrossIndustryWorkflow(
    tenantId: string,
    workflowName: string,
    requiredDomains: string[],
    orchestrationLogic: Record<string, any>,
  ) {
    this.logger.log(
      `Defining Cross-Industry Workflow: [${workflowName}] bridging domains: ${requiredDomains.join(", ")}`,
    );

    return this.prisma.crossIndustryWorkflow.create({
      data: {
        tenantId,
        workflowName,
        requiredDomains: JSON.stringify(requiredDomains),
        orchestrationLogic: JSON.stringify(orchestrationLogic),
        status: "ACTIVE",
      },
    });
  }

  /**
   * Validates if the participants for a cross-industry operation satisfy
   * all the required industry domains.
   */
  async validateParticipantCoverage(
    tenantId: string,
    workflowId: string,
    participantIds: string[],
  ): Promise<boolean> {
    const workflow = await this.prisma.crossIndustryWorkflow.findUnique({
      where: { id: workflowId },
    });
    if (!workflow) throw new Error("Workflow not found");

    const requiredDomains: string[] = JSON.parse(workflow.requiredDomains);
    const participants = await this.prisma.megaEcosystemParticipant.findMany({
      where: { tenantId, id: { in: participantIds } },
    });

    const coveredDomains = new Set<string>();

    for (const participant of participants) {
      const activeDomains: string[] = JSON.parse(participant.activeDomains);
      activeDomains.forEach((d) => coveredDomains.add(d));
    }

    const isFullyCovered = requiredDomains.every((domain) => coveredDomains.has(domain));

    if (!isFullyCovered) {
      this.logger.warn(
        `Participant coverage incomplete for workflow [${workflow.workflowName}]. Missing domains.`,
      );
      return false;
    }

    this.logger.log(`All required domains [${requiredDomains.join(", ")}] are covered.`);
    return true;
  }
}
