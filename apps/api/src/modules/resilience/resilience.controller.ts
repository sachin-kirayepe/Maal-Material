import { Controller, Get, Post, Param, Req, UseGuards } from "@nestjs/common";
import { ResilienceService } from "./resilience.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("resilience")
@UseGuards(TenantGuard)
export class ResilienceController {
  constructor(private readonly resilienceService: ResilienceService) {}

  @Get("failures")
  async getFailures(@Req() req: any) {
    return this.resilienceService.getFailures(req.tenantId);
  }

  @Get("retries")
  async getRetries(@Req() req: any) {
    return this.resilienceService.getRetries(req.tenantId);
  }

  @Post("failures/:id/resolve")
  async resolveFailure(@Req() req: any, @Param("id") id: string) {
    return this.resilienceService.resolveFailure(req.tenantId, id);
  }
}
