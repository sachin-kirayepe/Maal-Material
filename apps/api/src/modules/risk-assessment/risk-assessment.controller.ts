import { Controller, Get, Query, HttpStatus, Res } from "@nestjs/common";
import { RiskAssessmentService } from "./risk-assessment.service";
import type { Response } from "express";

@Controller("api/v1/risk-assessment")
export class RiskAssessmentController {
  constructor(private readonly riskAssessmentService: RiskAssessmentService) {}

  @Get("risks")
  async getRiskAssessments(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.riskAssessmentService.getRiskAssessments(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }
}
