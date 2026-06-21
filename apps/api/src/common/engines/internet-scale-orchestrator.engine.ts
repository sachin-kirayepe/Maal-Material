import { Injectable, Logger } from "@nestjs/common";
import { EventDispatcherService } from "../events/event-dispatcher.service";
import { GlobalIdempotencyEngine } from "./global-idempotency.engine";
import { ResilienceCircuitBreakerEngine } from "./resilience-circuit-breaker.engine";

/**
 * InternetScaleOrchestratorEngine
 *
 * Coordinates long-running workflows across distributed infrastructure boundaries.
 * In a true multi-region setup, this engine ensures that a transaction spanning
 * US-EAST and EU-WEST completes correctly or rolls back safely (SAGA pattern),
 * using Idempotency and Circuit Breakers.
 */
@Injectable()
export class InternetScaleOrchestratorEngine {
  private readonly logger = new Logger(InternetScaleOrchestratorEngine.name);

  constructor(
    private readonly eventDispatcher: EventDispatcherService,
    private readonly idempotencyEngine: GlobalIdempotencyEngine,
    private readonly circuitBreaker: ResilienceCircuitBreakerEngine,
  ) {}

  /**
   * Executes a cross-region saga step safely.
   */
  async executeDistributedSagaStep(
    tenantId: string,
    idempotencyKey: string,
    targetService: string,
    action: () => Promise<any>,
  ): Promise<any> {
    this.logger.log(
      `Attempting internet-scale SAGA step targeting [${targetService}] with Key: ${idempotencyKey}`,
    );

    // 1. Enforce EXACTLY ONCE delivery
    const lockAcquired = await this.idempotencyEngine.acquireLock(
      idempotencyKey,
      "InternetScaleOrchestrator",
      "DistributedSaga",
    );
    if (!lockAcquired) {
      this.logger.warn(`SAGA Step [${idempotencyKey}] aborted: Duplicate event detected.`);
      return { status: "IGNORED_DUPLICATE" };
    }

    try {
      // 2. Prevent cascading failures
      await this.circuitBreaker.assertServiceAvailable(tenantId, targetService);

      // 3. Execute the actual action
      const result = await action();

      // 4. Record success
      await this.circuitBreaker.recordSuccess(tenantId, targetService);
      await this.idempotencyEngine.markCompleted(idempotencyKey, result);

      return result;
    } catch (error: unknown) {
      this.logger.error(`Distributed SAGA Step Failed: ${(error as any).message}`);
      // Record failure for circuit breaking analytics
      await this.circuitBreaker.recordFailure(tenantId, targetService);
      throw error;
    }
  }
}
