import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("security")
@UseGuards(TenantGuard)
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get("events")
  async getEvents(@Req() req: any) {
    return this.securityService.getEvents(req.tenantId);
  }

  @Post("block-ip")
  async blockIp(@Req() req: any, @Body("ipAddress") ipAddress: string) {
    return this.securityService.blockIp(req.tenantId, ipAddress);
  }
}
