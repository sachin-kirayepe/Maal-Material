import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ConstructionEquipmentService } from "./construction-equipment.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("construction/equipment")
export class ConstructionEquipmentController {
  constructor(private readonly service: ConstructionEquipmentService) {}

  @Post("assignments")
  assignEquipment(@Body() data: unknown) {
    return this.service.assignEquipment(data);
  }

  @Get("assignments")
  getAssignments(@Query("projectId") projectId: string) {
    return this.service.getAssignments(projectId);
  }
}
