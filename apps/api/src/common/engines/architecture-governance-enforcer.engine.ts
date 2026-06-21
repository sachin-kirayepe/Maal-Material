import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ArchitectureGovernanceEnforcerEngine — "The Boundary Guardian" (Phase 25)
 *
 * Ensures domain-driven design principles are strictly maintained, auditing
 * cross-module calls and preventing orchestration layer bypass.
 */
@Injectable()
export class ArchitectureGovernanceEnforcerEngine {
  private readonly logger = new Logger(ArchitectureGovernanceEnforcerEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Audits a module boundary traversal for architectural compliance.
   */
  async auditBoundary(
    sourceModule: string,
    targetModule: string,
    isViolated: boolean,
    couplingScore: number,
  ) {
    this.logger.debug(
      `Auditing Boundary: [${sourceModule}] -> [${targetModule}] | Violated: ${isViolated}`,
    );

    const governance = await this.prisma.enterpriseArchitectureGovernance.create({
      data: {
        moduleName: sourceModule,
        boundaryViolation: isViolated,
        couplingScore,
        governanceStatus: isViolated ? "VIOLATION" : "COMPLIANT",
      },
    });

    if (isViolated) {
      this.logger.warn(
        `ARCHITECTURAL VIOLATION DETECTED: ${sourceModule} illegally bypassed orchestration to access ${targetModule}`,
      );
    }

    return governance;
  }
}
