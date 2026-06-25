import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EquipmentAvailabilityService } from "./equipment-availability.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
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
