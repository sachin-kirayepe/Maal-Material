import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SourcingService } from "./sourcing.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("sourcing")
export class SourcingController {
  constructor(private readonly sourcingService: SourcingService) {}

  @Get("rfqs")
  getRfqs(@Query("tenantId") tenantId: string) {
    return this.sourcingService.getRfqs(tenantId || "tenant-1");
  }

  @Get("quotations")
  getQuotations(@Query("tenantId") tenantId: string) {
    return this.sourcingService.getQuotations(tenantId || "tenant-1");
  }
}
