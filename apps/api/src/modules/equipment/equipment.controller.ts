import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, UseGuards, Request, Param } from '@nestjs/common';
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

  @Get(":id")
  async getEquipmentById(
    @Param("id") id: string
  ) {
    return this.equipmentService.getEquipmentById(id);
  }

  @Post(":id/verify-gate-pass")
  async verifyGatePass(
    @Param("id") id: string
  ) {
    return this.equipmentService.verifyGatePass(id);
  }

  @Post()
  async createEquipment(
    @Request() req: any,
    @Body() payload: any
  ) {
    // In actual auth, tenantId and userId come from req.user
    const tenantId = req.user?.tenantId || "tenant-1";
    const ownerId = req.user?.id || "user-1";
    return this.equipmentService.createEquipment(tenantId, ownerId, payload);
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
