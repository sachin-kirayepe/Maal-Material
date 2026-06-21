import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExternalIntegrationOrchestrationEngine — "The Converter" (Phase 15)
 *
 * Orchestrates workflows that route external data (e.g., IoT, legacy ERPs)
 * directly into the Maal-Material nervous system.
 */
@Injectable()
export class ExternalIntegrationOrchestrationEngine {
  private readonly logger = new Logger(ExternalIntegrationOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Stitches an external data source into an internal orchestration graph.
   */
  async bridgeExternalSource(
    tenantId: string,
    integrationName: string,
    externalSource: string,
    translationLogic: unknown,
  ) {
    this.logger.log(
      `Bridging External Source [${externalSource}] into Tenant [${tenantId}] Graph [${integrationName}]`,
    );

    const graph = await this.prisma.ecosystemIntegrationGraph.create({
      data: {
        tenantId,
        integrationName,
        externalSource,
        translationLogic: JSON.stringify(translationLogic),
        status: "ACTIVE",
      },
    });

    this.logger.debug(`External Integration Graph [${graph.id}] is now live and routing data.`);
    return graph;
  }
}
