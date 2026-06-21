import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * GlobalIdempotencyEngine
 *
 * Ensures strictly exactly-once processing across a distributed cloud.
 * By relying on unique constraints in the GlobalIdempotencyKey table,
 * this prevents race conditions when high-throughput webhooks or queues
 * attempt to execute the same transaction across multiple regions simultaneously.
 */
@Injectable()
export class GlobalIdempotencyEngine {
  private readonly logger = new Logger(GlobalIdempotencyEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Attempts to lock an idempotency key.
   * Throws an error if the key already exists (meaning it's being processed or done).
   */
  async acquireLock(
    idempotencyKey: string,
    originService: string,
    operationName: string,
    ttlSeconds: number = 3600,
  ): Promise<boolean> {
    this.logger.debug(`Attempting to acquire idempotency lock: ${idempotencyKey}`);

    try {
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + ttlSeconds);

      await this.prisma.globalIdempotencyKey.create({
        data: {
          idempotencyKey,
          originService,
          operationName,
          status: "LOCKED",
          expiresAt,
        },
      });

      return true; // Successfully acquired lock
    } catch (error) {
      // Prisma P2002 error code implies unique constraint violation (key exists)
      this.logger.warn(`Idempotency key collision for ${idempotencyKey}. Operation ignored.`);
      return false;
    }
  }

  /**
   * Marks a locked idempotency key as COMPLETED, optionally saving the result
   * so subsequent duplicate requests can receive the same cached response.
   */
  async markCompleted(idempotencyKey: string, resultJson: unknown = null) {
    await this.prisma.globalIdempotencyKey.update({
      where: { idempotencyKey },
      data: {
        status: "COMPLETED",
        resultJson: resultJson ? JSON.stringify(resultJson) : null,
      },
    });
  }
}
