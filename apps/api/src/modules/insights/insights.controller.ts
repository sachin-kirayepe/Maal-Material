import { Controller, Get, Param, Patch, UseGuards, Request } from "@nestjs/common";
import { InsightsService } from "./insights.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("insights")
@UseGuards(AuthGuard, TenantGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get("ai-insights")
  getAiInsights(@Request() req: any) {
    return this.insightsService.getAiInsights(req.user!.tenantId);
  }

  @Patch("ai-insights/:id/read")
  markInsightRead(@Request() req: any, @Param("id") id: string) {
    return this.insightsService.markInsightRead(req.user!.tenantId, id);
  }

  @Get("alerts")
  getAlerts(@Request() req: any) {
    return this.insightsService.getOperationalAlerts(req.user!.tenantId);
  }

  @Patch("alerts/:id/resolve")
  resolveAlert(@Request() req: any, @Param("id") id: string) {
    return this.insightsService.resolveAlert(req.user!.tenantId, id, req.user!.id);
  }
}
