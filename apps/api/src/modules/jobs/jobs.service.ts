import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PrismaService } from "@database/prisma.service";
import { TenantContext } from "../../common/context/tenant-context";

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectQueue("notification-queue") private readonly notificationQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async enqueueNotification(jobName: string, data: any) {
    const context = TenantContext.getStore();

    // SECURITY P0: BullMQ context hydration
    // Forcefully attach the tenant context to the payload so the worker can revive it
    const secureData = {
      ...(data as any),
      __secureTenantId: context?.tenantId,
    };

    const job = await this.notificationQueue.add(jobName, secureData, {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: true,
    });

    // Track it in DB
    await this.prisma.backgroundJob.create({
      data: {
        jobId: job.id!,
        jobName,
        queueName: "notification-queue",
        status: "WAITING",
      },
    });

    this.logger.debug(`Enqueued notification job: ${job.id}`);
    return job;
  }
}
