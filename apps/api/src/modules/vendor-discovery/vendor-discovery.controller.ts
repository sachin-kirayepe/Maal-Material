import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VendorDiscoveryService } from "./vendor-discovery.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("v1/vendor-discovery")
export class VendorDiscoveryController {
  constructor(private readonly discoveryService: VendorDiscoveryService) {}

  @Get("insights")
  async getInsights(@Query("tenantId") tenantId: string) {
    return this.discoveryService.getInsights(tenantId);
  }
}
