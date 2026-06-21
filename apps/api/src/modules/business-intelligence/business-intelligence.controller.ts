import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { BusinessIntelligenceService } from "./business-intelligence.service";
import { AuthGuard } from "@common/guards/auth.guard";

@Controller("business-intelligence")
@UseGuards(AuthGuard)
export class BusinessIntelligenceController {
  constructor(private readonly biService: BusinessIntelligenceService) {}

  @Get("insights")
  async getInsights(@Query("tenantId") tenantId?: string) {
    return this.biService.getInsights(tenantId);
  }

  @Get("anomalies")
  async getAnomalies(@Query("tenantId") tenantId?: string) {
    return this.biService.getAnomalies(tenantId);
  }
}
