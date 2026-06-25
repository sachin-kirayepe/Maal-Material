import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { RiskAnalysisService } from "./risk-analysis.service";
import type { Response } from "express";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/risk-analysis")
export class RiskAnalysisController {
  constructor(private readonly riskService: RiskAnalysisService) {}

  @Get("customer")
  async getCustomerRisks(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.riskService.getCustomerRisks(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }

  @Get("vendor")
  async getVendorIntelligence(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.riskService.getVendorIntelligence(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }
}
