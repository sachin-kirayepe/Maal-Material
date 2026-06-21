import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { InfrastructureService } from "./infrastructure.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("infrastructure")
@UseGuards(TenantGuard)
export class InfrastructureController {
  constructor(private readonly infrastructureService: InfrastructureService) {}

  @Get("nodes")
  async getNodes(@Request() req: unknown) {
    return this.infrastructureService.getNodes((req as any).tenantId);
  }

  @Get("regions")
  async getRegions(@Request() req: unknown) {
    return this.infrastructureService.getRegions((req as any).tenantId);
  }
}
