import { Controller, Get, Query } from "@nestjs/common";
import { FinanceService } from "./finance.service";

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
