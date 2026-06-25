import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FleetService } from "./fleet.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("fleet")
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Get("operations")
  async getFleetOperations(@Query("tenantId") tenantId: string) {
    return this.fleetService.getFleetOperations(tenantId);
  }

  @Get("analytics")
  async getAnalytics(@Query("tenantId") tenantId: string) {
    return this.fleetService.getAnalytics(tenantId);
  }
}
