import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ResilienceCircuitBreakerEngine
 *
 * Implements the Circuit Breaker pattern for internet-scale infrastructure.
 * If an external integration or an internal microservice degrades (e.g. timeout spikes),
 * this engine flips the circuit to 'OPEN', instantly failing fast instead of
 * hanging the entire distributed network with queued pending requests.
 */
@Injectable()
export class ResilienceCircuitBreakerEngine {
  private readonly logger = new Logger(ResilienceCircuitBreakerEngine.name);

  // Hardcoded thresholds for this simulated phase.
  private readonly MAX_FAILURES = 5;
  private readonly RETRY_TIMEOUT_SECONDS = 30;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Checks if a service is safe to call.
   * Throws an exception if the circuit is OPEN, failing fast.
   */
  async assertServiceAvailable(tenantId: string, serviceName: string): Promise<void> {
    const circuit = await this.prisma.circuitBreakerState.findUnique({
      where: { unique_tenant_service: { tenantId, serviceName } },
    });

    if (circuit && circuit.state === "OPEN") {
      if (circuit.nextRetryAt && new Date() >= circuit.nextRetryAt) {
        // Transition to HALF_OPEN to test if it's recovered
        await this.prisma.circuitBreakerState.update({
          where: { id: circuit.id },
          data: { state: "HALF_OPEN" },
        });
        this.logger.log(`Circuit [${serviceName}] transitioning to HALF_OPEN for testing.`);
        return; // Allow 1 request through
      } else {
        throw new Error(
          `Circuit Breaker OPEN: Service [${serviceName}] is currently degraded. Failing fast.`,
        );
      }
    }
  }

  /**
   * Records a failure for a specific service. If the threshold is breached, opens the circuit.
   */
  async recordFailure(tenantId: string, serviceName: string): Promise<void> {
    const circuit = await this.prisma.circuitBreakerState.upsert({
      where: { unique_tenant_service: { tenantId, serviceName } },
      create: { tenantId, serviceName, failureCount: 1, lastFailureAt: new Date() },
      update: { failureCount: { increment: 1 }, lastFailureAt: new Date() },
    });

    if (circuit.state !== "OPEN" && circuit.failureCount >= this.MAX_FAILURES) {
      const nextRetryAt = new Date();
      nextRetryAt.setSeconds(nextRetryAt.getSeconds() + this.RETRY_TIMEOUT_SECONDS);

      await this.prisma.circuitBreakerState.update({
        where: { id: circuit.id },
        data: { state: "OPEN", nextRetryAt },
      });

      this.logger.warn(`Circuit Breaker Tripped! Service [${serviceName}] is now OPEN.`);
    }
  }

  /**
   * Records a success, resetting the failure count and closing the circuit.
   */
  async recordSuccess(tenantId: string, serviceName: string): Promise<void> {
    await this.prisma.circuitBreakerState.upsert({
      where: { unique_tenant_service: { tenantId, serviceName } },
      create: { tenantId, serviceName, state: "CLOSED", failureCount: 0 },
      update: { state: "CLOSED", failureCount: 0, nextRetryAt: null },
    });
  }
}
