import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ActivityService } from "./activity.service";
import { ActivityController } from "./activity.controller";
import { ActivityListener } from "./listeners/activity.listener";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  imports: [AuthModule, RealtimeModule],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityListener],
  exports: [ActivityService],
})
export class ActivityModule {}
