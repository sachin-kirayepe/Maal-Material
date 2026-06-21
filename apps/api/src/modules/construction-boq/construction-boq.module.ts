import { Module } from "@nestjs/common";
import { ConstructionBoqController } from "./construction-boq.controller";
import { ConstructionBoqService } from "./construction-boq.service";

@Module({
  controllers: [ConstructionBoqController],
  providers: [ConstructionBoqService],
})
export class ConstructionBoqModule {}
