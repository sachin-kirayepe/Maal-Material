import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { AuthGuard } from "@common/guards/auth.guard";

@Controller("analytics")
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("overview")
  async getOverview(@Query("tenantId") tenantId?: string) {
    return this.analyticsService.getDashboardOverview(tenantId);
  }

  @Get("trends")
  async getTrends(
    @Query("module") module: string,
    @Query("days") days?: string,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.analyticsService.getTrends(module, days ? parseInt(days, 10) : 30, tenantId);
  }
}
