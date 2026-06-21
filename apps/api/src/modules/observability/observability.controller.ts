import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ObservabilityService } from "./observability.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("observability")
@UseGuards(TenantGuard)
export class ObservabilityController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  @Get("metrics")
  async getMetrics(@Req() req: any) {
    return this.observabilityService.getMetrics(req.tenantId);
  }
}
