import { Injectable, Logger } from "@nestjs/common";

/**
 * IdempotencyGuardService — "The Ghost Executor Preventer" (Phase 8A)
 *
 * Ensures that distributed events, multi-agent messages, and orchestration payloads
 * are never double-processed, maintaining strict transactional consistency.
 */
@Injectable()
export class IdempotencyGuardService {
  private readonly logger = new Logger(IdempotencyGuardService.name);

  // In a distributed production deployment, this would be backed by Redis TTL keys.
  private readonly processedKeys = new Set<string>();

  /**
   * Checks and locks an idempotency key.
   * Returns true if the key is new and locks it. Returns false if already processed.
   */
  async lockExecutionKey(idempotencyKey: string): Promise<boolean> {
    if (this.processedKeys.has(idempotencyKey)) {
      this.logger.warn(
        `Idempotency Guard: Execution key [${idempotencyKey}] already processed. Blocking duplicate execution.`,
      );
      return false; // Execution was already processed
    }

    this.logger.debug(`Idempotency Guard: Locking execution key [${idempotencyKey}].`);
    this.processedKeys.add(idempotencyKey);
    return true; // Safe to execute
  }

  /**
   * Clears a key if execution failed and needs to be allowed to retry.
   */
  async releaseExecutionKey(idempotencyKey: string) {
    this.logger.debug(`Idempotency Guard: Releasing execution key [${idempotencyKey}] for retry.`);
    this.processedKeys.delete(idempotencyKey);
  }
}
