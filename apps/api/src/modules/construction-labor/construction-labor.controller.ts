import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ConstructionLaborService } from "./construction-labor.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("construction/labor")
export class ConstructionLaborController {
  constructor(private readonly service: ConstructionLaborService) {}

  @Post("attendance")
  logAttendance(@Body() data: unknown) {
    return this.service.logAttendance(data);
  }

  @Get("attendance")
  getAttendance(@Query("projectId") projectId: string) {
    return this.service.getAttendance(projectId);
  }

  @Get("productivity")
  getProductivity(@Query("projectId") projectId: string) {
    return this.service.getProductivity(projectId);
  }
}
