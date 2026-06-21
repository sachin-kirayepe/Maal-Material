import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "@database/prisma.service";
import { TenantContext } from "../../../common/context/tenant-context";
import { RealtimeGateway } from "../../realtime/realtime.gateway";

@Processor("notification-queue")
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    // SECURITY P0: Revive the Zero-Trust ALS Context from the Redis payload
    const tenantId = job.data?.__secureTenantId;

    if (!tenantId) {
      this.logger.error(
        `CRITICAL SECURITY FAILURE: Job ${job.id} executed without a tenant context.`,
      );
      throw new Error(`Tenant Isolation Bypass Detected in Worker.`);
    }

    return new Promise((resolve, reject) => {
      TenantContext.run({ tenantId }, async () => {
        try {
          this.logger.debug(
            `Processing job ${job.id} of type ${job.name} under strict Tenant Context: ${tenantId}`,
          );

          // Update status to ACTIVE
          await this.updateJobStatus(job.id!, "ACTIVE");

          switch (job.name) {
            case "send-email":
              await this.simulateDelay(2000);
              this.logger.log(`Email sent to ${job.data.email}`);
              break;
            case "send-push":
              await this.simulateDelay(1000);
              this.logger.log(`Push notification sent to ${job.data.userId}`);
              break;
            default:
              this.logger.warn(`Unknown job name: ${job.name}`);
          }

          await this.updateJobStatus(job.id!, "COMPLETED", JSON.stringify({ success: true }));

          // Emit realtime socket event if a user target exists
          if (job.data.userId) {
            this.realtimeGateway.sendToUser(job.data.userId, "notification.new", {
              id: job.id,
              title: "Job Completed",
              body: `Job ${job.name} finished successfully.`,
              type: "SYSTEM",
              isRead: false,
              createdAt: new Date().toISOString()
            });
          }

          resolve({ success: true });
        } catch (error) {
          await this.updateJobStatus(job.id!, "FAILED", undefined, JSON.stringify(error));
          reject(error);
        }
      });
    });
  }
  @OnWorkerEvent("completed")
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }

  private async updateJobStatus(jobId: string, status: string, result?: string, error?: string) {
    // Only update if the record exists in our tracking table
    const exists = await this.prisma.backgroundJob.findFirst({ where: { jobId } });
    if (exists) {
      await this.prisma.backgroundJob.update({
        where: { id: exists.id },
        data: {
          status,
          result,
          error,
          ...(status === "ACTIVE" ? { startedAt: new Date() } : {}),
          ...(status === "COMPLETED" || status === "FAILED"
            ? { finishedAt: new Date(), progress: 100 }
            : {}),
        },
      });
    }
  }

  private simulateDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
