import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("audit")
@UseGuards(TenantGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get("trails")
  async getTrails(@Req() req: any) {
    return this.auditService.getTrails(req.tenantId);
  }
}
