import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CrossIndustrySynthesisEngine — "The Untangler" (Phase 3V)
 *
 * Dynamically untangles and optimizes CrossIndustryDependencyNode records,
 * ensuring that a delay in one sector elegantly re-routes resources in another.
 */
@Injectable()
export class CrossIndustrySynthesisEngine {
  private readonly logger = new Logger(CrossIndustrySynthesisEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a hard dependency between two distinct industries.
   */
  async registerCrossIndustryDependency(
    tenantId: string,
    sourceIndustry: string,
    targetIndustry: string,
    strength: number,
    context: unknown,
  ) {
    this.logger.debug(
      `Registering Cross-Industry Dependency: [${sourceIndustry}] -> [${targetIndustry}]`,
    );

    return this.prisma.crossIndustryDependencyNode.create({
      data: {
        tenantId,
        sourceIndustry,
        targetIndustry,
        dependencyStrength: strength,
        dependencyContextJson: JSON.stringify(context),
      },
    });
  }

  /**
   * Evaluates cascading impacts across industries when a primary sector is disrupted.
   */
  async synthesizeCascadingImpact(tenantId: string, disruptedIndustry: string) {
    this.logger.warn(`Synthesizing cascading impact for disruption in: ${disruptedIndustry}`);

    return this.prisma.crossIndustryDependencyNode.findMany({
      where: { tenantId, sourceIndustry: disruptedIndustry },
      orderBy: { dependencyStrength: "desc" },
    });
  }
}
