import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller";
import { NotificationListener } from "./listeners/notification.listener";
import { JobsModule } from "../jobs/jobs.module";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  imports: [AuthModule, JobsModule, RealtimeModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
