import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { OemPollingService } from "./oem-polling.service";
import { TelemetryProcessor } from "./telemetry.processor";
import { FraudDetectionModule } from "../fraud-detection/fraud-detection.module";

@Module({
  imports: [FraudDetectionModule],
  controllers: [WebhookController],
  providers: [OemPollingService, TelemetryProcessor],
  exports: [TelemetryProcessor],
})
export class IotTelemetryModule {}
