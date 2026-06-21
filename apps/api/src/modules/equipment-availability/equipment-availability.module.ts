import { Module } from "@nestjs/common";
import { EquipmentAvailabilityController } from "./equipment-availability.controller";
import { EquipmentAvailabilityService } from "./equipment-availability.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [EquipmentAvailabilityController],
  providers: [EquipmentAvailabilityService],
  exports: [EquipmentAvailabilityService],
})
export class EquipmentAvailabilityModule {}
