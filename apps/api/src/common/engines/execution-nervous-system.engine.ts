import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExecutionNervousSystemEngine — "The Execution Mind" (Phase 3R)
 *
 * Ingests immense volumes of cross-tenant task states to continuously render
 * the UniversalExecutionGrid—the macro-level nervous system of the platform.
 */
@Injectable()
export class ExecutionNervousSystemEngine {
  private readonly logger = new Logger(ExecutionNervousSystemEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synchronizes active workflow states into a macro-level grid.
   */
  async synchronizeExecutionGrid(tenantId: string, gridRegion: string, stateUpdate: unknown) {
    this.logger.log(`Synchronizing Execution Grid [Region: ${gridRegion}]`);

    const existingGrid = await this.prisma.universalExecutionGrid.findFirst({
      where: { tenantId, gridRegion },
    });

    if (existingGrid) {
      return this.prisma.universalExecutionGrid.update({
        where: { id: existingGrid.id },
        data: {
          stateGraphJson: JSON.stringify(stateUpdate),
          activeWorkflows: (stateUpdate as any).activeCount || existingGrid.activeWorkflows,
          systemicHealth: this.calculateSystemicHealth(stateUpdate),
        },
      });
    } else {
      return this.prisma.universalExecutionGrid.create({
        data: {
          tenantId,
          gridRegion,
          stateGraphJson: JSON.stringify(stateUpdate),
          activeWorkflows: (stateUpdate as any).activeCount || 0,
        },
      });
    }
  }

  private calculateSystemicHealth(stateUpdate: unknown): number {
    // Placeholder for complex systemic health calculation
    return (stateUpdate as any).errorCount
      ? Math.max(0.1, 1.0 - (stateUpdate as any).errorCount * 0.05)
      : 1.0;
  }
}
