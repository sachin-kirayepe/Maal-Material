import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { AuthGuard } from "@common/guards/auth.guard";

@Controller("reports")
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("templates")
  async getTemplates(@Query("tenantId") tenantId?: string) {
    return this.reportsService.getTemplates(tenantId);
  }

  @Get()
  async getReports(@Query("tenantId") tenantId?: string) {
    return this.reportsService.getGeneratedReports(tenantId);
  }

  @Post("generate")
  async generateReport(
    @Body() dto: { templateId: string; tenantId: string },
    @Query("userId") userId?: string,
  ) {
    // In real app, userId comes from request.user as any
    return this.reportsService.generateReport(dto.templateId, dto.tenantId, userId || "system");
  }
}
