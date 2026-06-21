import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

export abstract class BaseQueueProcessor<T> extends WorkerHost {
  protected abstract readonly logger: Logger;
  protected abstract readonly queueName: string;

  constructor(@InjectRedis() protected readonly redis: Redis) {
    super();
  }

  async process(job: Job<T, any, string>): Promise<any> {
    const idempotencyKey = `bullmq:idempotency:${this.queueName}:${job.id}`;

    const isProcessed = await this.redis.get(idempotencyKey);
    if (isProcessed) {
      this.logger.warn(`Job ${job.id} on queue ${this.queueName} was already processed. Skipping.`);
      return;
    }

    try {
      this.logger.log(`Processing job ${job.id} on queue ${this.queueName}...`);

      const result = await this.handle(job);

      // Store success idempotency key (expire in 7 days)
      await this.redis.set(idempotencyKey, "true", "EX", 60 * 60 * 24 * 7);

      this.logger.log(`Successfully processed job ${job.id}`);
      return result;
    } catch (error: unknown) {
      this.logger.error(
        `Failed to process job ${job.id}: ${(error as any).message}`,
        (error as any).stack,
      );

      // If it's the final attempt, send to DLQ
      if (job.attemptsMade >= (job.opts.attempts || 3)) {
        await this.handleDLQ(job, error as any);
      }

      throw error;
    }
  }

  protected abstract handle(job: Job<T, any, string>): Promise<any>;

  protected async handleDLQ(job: Job<T, any, string>, error: Error): Promise<void> {
    this.logger.error(`Job ${job.id} permanently failed. Pushing to DLQ...`);
    // Example: push to a centralized DLQ queue or save to database for manual review
    // await this.redis.lpush('dlq:central', JSON.stringify({ queue: this.queueName, jobId: job.id, payload: job.data, error: error.}));
  }
}
