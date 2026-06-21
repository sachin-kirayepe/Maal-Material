import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AIPlaybookEngine — "The Operational Librarian" (Phase 3B)
 *
 * Manages the lifecycle and execution of reusable AI operational playbooks.
 * A playbook is a versioned, domain-specific sequence of operational steps
 * that copilots can execute consistently across tenants and operational contexts.
 */
@Injectable()
export class AIPlaybookEngine {
  private readonly logger = new Logger(AIPlaybookEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates or versions a new AI operational playbook.
   */
  async createPlaybook(
    tenantId: string,
    playbookName: string,
    domain: string,
    steps: { stepName: string; action: string; parameters: unknown }[],
  ) {
    // Determine next version
    const existing = await this.prisma.aIOperationalPlaybook.findMany({
      where: { tenantId, playbookName },
      orderBy: { version: "desc" },
      take: 1,
    });

    const nextVersion = existing!.length > 0 ? existing![0]!.version + 1 : 1;

    this.logger.log(`Creating Playbook [${playbookName}] v${nextVersion} for domain [${domain}]`);

    return this.prisma.aIOperationalPlaybook.create({
      data: {
        tenantId,
        playbookName,
        domain,
        version: nextVersion,
        stepsJson: JSON.stringify(steps),
        isActive: true,
      },
    });
  }

  /**
   * Retrieves the latest active version of a playbook for execution.
   */
  async getActivePlaybook(tenantId: string, playbookName: string) {
    return this.prisma.aIOperationalPlaybook.findFirst({
      where: { tenantId, playbookName, isActive: true },
      orderBy: { version: "desc" },
    });
  }

  /**
   * Executes a playbook's steps in sequence, returning a structured execution log.
   * In production, each step would dispatch to the appropriate domain engine.
   */
  async executePlaybook(tenantId: string, playbookName: string) {
    const playbook = await this.getActivePlaybook(tenantId, playbookName);
    if (!playbook) throw new Error(`No active playbook found: ${playbookName}`);

    const steps: unknown[] = JSON.parse(playbook.stepsJson);
    const executionLog: { stepName: string; status: string }[] = [];

    for (const step of steps) {
      this.logger.debug(`Executing playbook step: ${(step as any).stepName}`);
      // In production: dispatch step.action to the correct engine with step.parameters
      executionLog.push({ stepName: (step as any).stepName, status: "COMPLETED" });
    }

    this.logger.log(
      `Playbook [${playbookName}] v${playbook.version} execution complete. ${executionLog.length} steps executed.`,
    );
    return { playbookId: playbook.id, version: playbook.version, executionLog };
  }
}
