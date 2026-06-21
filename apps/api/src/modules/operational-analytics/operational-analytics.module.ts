import { Module } from "@nestjs/common";
import { OperationalAnalyticsController } from "./operational-analytics.controller";
import { OperationalAnalyticsService } from "./operational-analytics.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [OperationalAnalyticsController],
  providers: [OperationalAnalyticsService],
  exports: [OperationalAnalyticsService],
})
export class OperationalAnalyticsModule {}
