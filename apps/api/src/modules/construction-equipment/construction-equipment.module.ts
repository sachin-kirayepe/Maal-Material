import { Module } from "@nestjs/common";
import { ConstructionEquipmentController } from "./construction-equipment.controller";
import { ConstructionEquipmentService } from "./construction-equipment.service";

@Module({
  controllers: [ConstructionEquipmentController],
  providers: [ConstructionEquipmentService],
})
export class ConstructionEquipmentModule {}
