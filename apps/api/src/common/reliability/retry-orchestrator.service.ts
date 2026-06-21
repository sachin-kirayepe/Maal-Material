import { Injectable, Logger } from "@nestjs/common";

/**
 * RetryOrchestratorService — "The Transient Healer" (Phase 8A)
 *
 * Implements advanced exponential backoff with jitter to gracefully retry
 * transient orchestration failures (e.g., DB locks, temporary microservice timeouts)
 * without storming the connection pools.
 */
@Injectable()
export class RetryOrchestratorService {
  private readonly logger = new Logger(RetryOrchestratorService.name);

  /**
   * Executes an asynchronous task with exponential backoff and jitter.
   */
  async executeWithRetry<T>(
    taskName: string,
    maxAttempts: number,
    baseDelayMs: number,
    operation: () => Promise<T>,
  ): Promise<T> {
    let attempt = 1;

    while (attempt <= maxAttempts) {
      try {
        return await operation();
      } catch (error: unknown) {
        if (attempt === maxAttempts) {
          this.logger.error(
            `Retry Orchestrator: Task [${taskName}] FAILED after ${maxAttempts} attempts. Propagating error.`,
          );
          throw error;
        }

        // Exponential backoff: baseDelay * 2^(attempt-1)
        const delay = baseDelayMs * Math.pow(2, attempt - 1);

        // Jitter: randomize delay by +/- 20% to avoid thundering herd problem
        const jitter = delay * 0.2;
        const finalDelay = delay + (Math.random() * jitter * 2 - jitter);

        this.logger.warn(
          `Retry Orchestrator: Task [${taskName}] attempt ${attempt} failed. Retrying in ${Math.round(finalDelay)}ms...`,
        );
        await new Promise((res) => setTimeout(res, finalDelay));
        attempt++;
      }
    }

    throw new Error("Unreachable code in retry orchestrator");
  }
}
