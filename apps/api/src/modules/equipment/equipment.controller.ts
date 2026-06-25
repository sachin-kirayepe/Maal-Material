import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EquipmentService } from "./equipment.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/equipment")
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  async getEquipment(
    @Query("tenantId") tenantId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    return this.equipmentService.getEquipment(tenantId || "tenant-1", Number(page), Number(limit));
  }

  @Get("available")
  async getAvailableEquipment(
    @Query("tenantId") tenantId: string,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
  ) {
    return this.equipmentService.getAvailableEquipment(
      tenantId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
