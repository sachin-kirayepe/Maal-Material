import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PurchaseIntelligenceService } from "./purchase-intelligence.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("purchase-intelligence")
export class PurchaseIntelligenceController {
  constructor(private readonly purchaseIntelligenceService: PurchaseIntelligenceService) {}

  @Get("analytics")
  getAnalytics(@Query("tenantId") tenantId: string) {
    return this.purchaseIntelligenceService.getAnalytics(tenantId || "tenant-1");
  }
}
