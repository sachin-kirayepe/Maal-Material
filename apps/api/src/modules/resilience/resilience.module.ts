import { Module } from "@nestjs/common";
import { ResilienceController } from "./resilience.controller";
import { ResilienceService } from "./resilience.service";

@Module({
  controllers: [ResilienceController],
  providers: [ResilienceService],
})
export class ResilienceModule {}
