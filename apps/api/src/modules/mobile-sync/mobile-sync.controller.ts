import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { MobileSyncService } from "./mobile-sync.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("mobile-sync")
@UseGuards(TenantGuard)
export class MobileSyncController {
  constructor(private readonly mobileSyncService: MobileSyncService) {}

  @Get("queues")
  async getSyncQueues(@Request() req: unknown) {
    return this.mobileSyncService.getSyncQueues((req as any).tenantId);
  }

  @Get("audit-logs")
  async getAuditLogs(@Request() req: unknown) {
    return this.mobileSyncService.getAuditLogs((req as any).tenantId);
  }
}
