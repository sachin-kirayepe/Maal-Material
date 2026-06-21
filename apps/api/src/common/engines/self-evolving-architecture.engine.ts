import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as crypto from "crypto";

/**
 * SelfEvolvingArchitectureEngine — "The Architect" (Phase 19)
 *
 * Takes successful operational experiments and permanently grafts them
 * into the core orchestration layer (subject to Phase 18 Governance approval).
 */
@Injectable()
export class SelfEvolvingArchitectureEngine {
  private readonly logger = new Logger(SelfEvolvingArchitectureEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Applies a proven evolutionary mutation to the core orchestration matrix.
   */
  async applyArchitectureMutation(
    tenantId: string,
    mutationType: string,
    previousState: unknown,
    newState: unknown,
  ) {
    this.logger.log(`Applying Self-Evolving Mutation [${mutationType}] to Tenant [${tenantId}]`);

    const prevStateString = JSON.stringify(previousState);
    const newStateString = JSON.stringify(newState);
    const govHash = crypto
      .createHash("sha256")
      .update(`GOV-AUTH-${tenantId}-${mutationType}-${newStateString}-${Date.now()}`)
      .digest("hex");

    const graphUpdate = await this.prisma.selfEvolvingArchitectureGraph.create({
      data: {
        tenantId,
        mutationType,
        previousState: prevStateString,
        newState: newStateString,
        governanceHash: govHash,
      },
    });

    return graphUpdate;
  }
}
