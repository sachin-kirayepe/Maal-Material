import { Module } from "@nestjs/common";
import { ConstructionLaborController } from "./construction-labor.controller";
import { ConstructionLaborService } from "./construction-labor.service";

@Module({
  controllers: [ConstructionLaborController],
  providers: [ConstructionLaborService],
})
export class ConstructionLaborModule {}
