import { Controller, Get, Query, HttpStatus, Res } from "@nestjs/common";
import { OperationalAnalyticsService } from "./operational-analytics.service";
import type { Response } from "express";

@Controller("api/v1/operational-analytics")
export class OperationalAnalyticsController {
  constructor(private readonly analyticsService: OperationalAnalyticsService) {}

  @Get("contractors")
  async getContractorAnalytics(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.analyticsService.getContractorAnalytics(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }

  @Get("workflows")
  async getAIWorkflows(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.analyticsService.getAIWorkflows(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }
}
