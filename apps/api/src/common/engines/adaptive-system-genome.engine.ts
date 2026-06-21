import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveSystemGenomeEngine — "The Digital DNA Sequencer" (Phase 33)
 *
 * Manages the versioning and safe mutation of enterprise logic configurations.
 * Allows the platform to "evolve" structurally without human redeployment.
 */
@Injectable()
export class AdaptiveSystemGenomeEngine {
  private readonly logger = new Logger(AdaptiveSystemGenomeEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Commits a new evolutionary generation of the enterprise architecture genome.
   */
  async evolveGenome(tenantId: string, generationNumber: number, dnaPayload: unknown) {
    this.logger.log(
      `Evolving Architecture Genome for Tenant [${tenantId}] -> Generation [${generationNumber}]`,
    );

    const genome = await this.prisma.adaptiveSystemGenome.create({
      data: {
        tenantId,
        generation: generationNumber,
        orchestrationDna: JSON.stringify(dnaPayload),
        evolutionStatus: "STABLE",
      },
    });

    this.logger.debug(`Genome Generation [${generationNumber}] successfully committed.`);
    return genome;
  }
}
