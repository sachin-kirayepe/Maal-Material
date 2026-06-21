import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ModuleDependencyIntelligenceEngine — "The Refactoring Oracle" (Phase 25)
 *
 * Maintains a live, highly detailed graph of dependencies between the hundreds
 * of internal Maal-Material engines to ensure safe, localized refactoring.
 */
@Injectable()
export class ModuleDependencyIntelligenceEngine {
  private readonly logger = new Logger(ModuleDependencyIntelligenceEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs an active runtime dependency between two enterprise components.
   */
  async registerDependency(source: string, target: string, type: string, criticality: string) {
    this.logger.debug(`Registering Architecture Dependency: [${source}] -> [${target}]`);

    const dependency = await this.prisma.moduleDependencyIntelligence.create({
      data: {
        sourceEngine: source,
        targetEngine: target,
        dependencyType: type,
        criticality,
      },
    });

    return dependency;
  }
}
