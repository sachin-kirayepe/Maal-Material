import { Controller, Get, Patch, Param, Body, UseGuards, Request } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("gateway")
@UseGuards(TenantGuard)
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get("policies")
  async getPolicies(@Request() req: unknown) {
    return this.gatewayService.getPolicies((req as any).tenantId);
  }

  @Patch("policies/:id/toggle")
  async togglePolicy(
    @Param("id") id: string,
    @Body("isActive") isActive: boolean,
    @Request() req: unknown,
  ) {
    await this.gatewayService.togglePolicy((req as any).tenantId, id, isActive);
    return { success: true };
  }
}
