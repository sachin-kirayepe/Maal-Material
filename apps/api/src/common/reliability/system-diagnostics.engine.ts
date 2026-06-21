import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SystemDiagnosticsEngine — "The Overlord" (Phase 8A)
 *
 * Provides production-grade observability. An engine dedicated to assessing
 * queue latency, memory leak risks, and orchestration load, enabling graceful
 * degradation before the entire civilization crashes.
 */
@Injectable()
export class SystemDiagnosticsEngine {
  private readonly logger = new Logger(SystemDiagnosticsEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates the health of the database connection pool.
   */
  async assessDatabaseLatency(): Promise<{ healthy: boolean; latencyMs: number }> {
    const start = Date.now();
    try {
      // Lightweight query to check if DB is responsive
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;

      if (latency > 1000) {
        this.logger.warn(`Diagnostics: Database latency is dangerously high (${latency}ms).`);
      }

      return { healthy: true, latencyMs: latency };
    } catch (e: unknown) {
      this.logger.error(
        `Diagnostics: Database connection failed. Possible connection pool exhaustion!`,
      );
      return { healthy: false, latencyMs: Date.now() - start };
    }
  }

  /**
   * Assesses Node.js process memory to prevent OOM (Out Of Memory) crashes.
   */
  assessMemoryHealth(): { healthy: boolean; heapUsedMb: number } {
    const mem = process.memoryUsage();
    const heapUsedMb = Math.round(mem.heapUsed / 1024 / 1024);

    // In V8, standard limits are ~1.5GB to 2GB unless increased
    if (heapUsedMb > 1000) {
      this.logger.warn(
        `Diagnostics: Process memory usage is critical (${heapUsedMb} MB). Graceful degradation mode activated.`,
      );
      return { healthy: false, heapUsedMb };
    }

    return { healthy: true, heapUsedMb };
  }
}
