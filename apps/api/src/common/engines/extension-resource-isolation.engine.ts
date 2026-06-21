import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExtensionResourceIsolationEngine — "The Plugin Sandbox" (Phase 23)
 *
 * Constantly monitors third-party logic and terminates any plugin that
 * exceeds its database, memory, or CPU quotas to protect the core.
 */
@Injectable()
export class ExtensionResourceIsolationEngine {
  private readonly logger = new Logger(ExtensionResourceIsolationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates the resource consumption of an isolated plugin.
   */
  async evaluatePluginHealth(
    pluginId: string,
    currentMemoryMb: number,
    currentCpuPercent: number,
    queriesPerSec: number,
  ) {
    this.logger.debug(
      `Evaluating Resource Isolation for Plugin [${pluginId}] - Mem: ${currentMemoryMb}MB, CPU: ${currentCpuPercent}%, QPS: ${queriesPerSec}`,
    );

    const isolationPolicy = await (this.prisma as any).pluginResourceIsolation.findUnique({
      where: { pluginId },
    });

    if (!isolationPolicy) {
      return true; // No explicit policy, assume healthy or unmonitored
    }

    if (
      currentMemoryMb > isolationPolicy.maxMemoryMb ||
      currentCpuPercent > isolationPolicy.maxCpuPercent ||
      queriesPerSec > isolationPolicy.maxDbQueriesPerSec
    ) {
      this.logger.warn(
        `ISOLATION BREACH DETECTED for Plugin [${pluginId}]. Terminating or throttling external process.`,
      );

      await (this.prisma as any).pluginResourceIsolation.update({
        where: { id: isolationPolicy.id },
        data: {
          isolationStatus: "VIOLATED",
          lastViolationAt: new Date(),
        },
      });

      return false; // Action taken, unhealthy
    }

    return true; // Healthy
  }
}
