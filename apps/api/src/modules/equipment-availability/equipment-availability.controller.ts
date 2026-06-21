import { Controller, Get, Query } from "@nestjs/common";
import { EquipmentAvailabilityService } from "./equipment-availability.service";

@Controller("api/v1/equipment-availability")
export class EquipmentAvailabilityController {
  constructor(private readonly availabilityService: EquipmentAvailabilityService) {}

  @Get()
  async getAvailability(
    @Query("tenantId") tenantId: string,
    @Query("equipmentId") equipmentId: string,
  ) {
    return this.availabilityService.getAvailability(tenantId, equipmentId);
  }
}
