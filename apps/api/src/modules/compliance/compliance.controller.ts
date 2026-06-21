import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import { ComplianceService } from "./compliance.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("compliance")
@UseGuards(TenantGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get("records")
  async getRecords(@Req() req: any) {
    return this.complianceService.getRecords(req.tenantId);
  }

  @Post("generate")
  async generateReport(@Req() req: any, @Body("reportType") reportType: string) {
    return this.complianceService.generateReport(req.tenantId, req.user?.id, reportType);
  }
}
