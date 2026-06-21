import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { KpiService } from "./kpi.service";
import { AuthGuard } from "@common/guards/auth.guard";

@Controller("kpis")
@UseGuards(AuthGuard)
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get()
  async getKpis(@Query("tenantId") tenantId?: string) {
    return this.kpiService.getKpis(tenantId);
  }
}
