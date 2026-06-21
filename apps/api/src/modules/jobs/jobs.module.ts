import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { BullModule } from "@nestjs/bullmq";
import { JobsService } from "./jobs.service";
import { NotificationProcessor } from "./processors/notification.processor";
import { JobsController } from "./jobs.controller";

@Module({
  imports: [
    AuthModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379") || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        tls: process.env.REDIS_HOST?.includes('upstash') ? {} : undefined,
      },
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false, // Leave failed jobs for DLQ
      },
    }),
    BullModule.registerQueue({ name: "notification-queue" }),
    BullModule.registerQueue({ name: "analytics-queue" }),
  ],
  controllers: [JobsController],
  providers: [JobsService, NotificationProcessor],
  exports: [JobsService, BullModule],
})
export class JobsModule {}
