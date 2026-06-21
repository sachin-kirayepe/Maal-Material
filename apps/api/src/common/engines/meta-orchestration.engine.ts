import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MetaOrchestrationEngine — "The Executive Brain" (Phase 3K)
 *
 * Sits above all other orchestration systems. Issues self-architecting
 * directives (`MetaOrchestrationDirective`) to dynamically route traffic,
 * isolate struggling nodes, or scale specific workflow capacities.
 */
@Injectable()
export class MetaOrchestrationEngine {
  private readonly logger = new Logger(MetaOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Issues a high-level self-architecting directive to the infrastructure.
   */
  async issueMetaDirective(
    tenantId: string,
    directiveType: string,
    targetDomain: string,
    parameters: unknown,
  ) {
    this.logger.log(
      `Issuing Meta-Orchestration Directive: [${directiveType}] targeting [${targetDomain}]`,
    );

    return this.prisma.metaOrchestrationDirective.create({
      data: {
        tenantId,
        directiveType,
        targetDomain,
        parametersJson: JSON.stringify(parameters),
        status: "PENDING",
      },
    });
  }

  /**
   * Acknowledges that a meta-directive has been executed by the infrastructure.
   */
  async markDirectiveExecuted(directiveId: string) {
    this.logger.debug(`Meta-Directive [${directiveId}] marked EXECUTED.`);

    return this.prisma.metaOrchestrationDirective.update({
      where: { id: directiveId },
      data: {
        status: "EXECUTED",
        completedAt: new Date(),
      },
    });
  }

  /**
   * Marks a directive as failed if the infrastructure was unable to safely execute it.
   */
  async markDirectiveFailed(directiveId: string) {
    this.logger.error(`Meta-Directive [${directiveId}] FAILED.`);

    return this.prisma.metaOrchestrationDirective.update({
      where: { id: directiveId },
      data: { status: "FAILED" },
    });
  }
}
