import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FinanceService } from "./finance.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("finance")
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get("profitability")
  getProfitability(@Query("tenantId") tenantId: string) {
    return this.financeService.getProfitabilityAnalytics(tenantId || "tenant-1");
  }

  @Get("cash-flow")
  getCashFlow(@Query("tenantId") tenantId: string) {
    return this.financeService.getCashFlowInsights(tenantId || "tenant-1");
  }
}
