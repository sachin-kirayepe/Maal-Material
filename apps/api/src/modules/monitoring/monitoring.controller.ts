import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MonitoringService } from "./monitoring.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/monitoring")
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get("metrics")
  getMetrics(@Query("tenantId") tenantId: string) {
    return this.monitoringService.getMetrics(tenantId || "tenant-1");
  }

  @Get("nodes")
  getNodes(@Query("tenantId") tenantId: string) {
    return this.monitoringService.getNodes(tenantId || "tenant-1");
  }
}
