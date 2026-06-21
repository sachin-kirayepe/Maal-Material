import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * UniversalOperationalIntelligenceEngine — "The Omniscient Graph" (Phase 20)
 *
 * Continuously maps the state of all global assets, synthesizing raw telemetry,
 * AI hypotheses, and execution states into a unified civilization view.
 */
@Injectable()
export class UniversalOperationalIntelligenceEngine {
  private readonly logger = new Logger(UniversalOperationalIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synthesizes and stores the global state of a domain sector.
   */
  async synthesizeGlobalState(
    tenantId: string,
    domainSector: string,
    stateGraph: unknown,
    confidenceIndex: number,
  ) {
    this.logger.log(
      `Synthesizing Universal State for Domain [${domainSector}] with Confidence [${confidenceIndex}] in Tenant [${tenantId}]`,
    );

    const intelligence = await this.prisma.universalOperationalIntelligence.create({
      data: {
        tenantId,
        domainSector,
        stateGraph: JSON.stringify(stateGraph),
        confidenceIndex,
      },
    });

    return intelligence;
  }
}
