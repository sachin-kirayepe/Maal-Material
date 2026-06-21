import { Module } from "@nestjs/common";
import { OfflineEngineController } from "./offline-engine.controller";
import { OfflineEngineService } from "./offline-engine.service";

@Module({
  controllers: [OfflineEngineController],
  providers: [OfflineEngineService],
})
export class OfflineEngineModule {}
