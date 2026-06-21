import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { PlatformService } from "./platform.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("platform")
@UseGuards(TenantGuard)
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get("services")
  async getServices(@Request() req: unknown) {
    return this.platformService.getPlatformServices((req as any).tenantId);
  }

  @Get("extensions")
  async getExtensions(@Request() req: unknown) {
    return this.platformService.getPlatformExtensions((req as any).tenantId);
  }
}
