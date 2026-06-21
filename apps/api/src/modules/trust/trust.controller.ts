import { Controller, Get, Query, HttpStatus, Res } from "@nestjs/common";
import { TrustService } from "./trust.service";
import { Response } from "express";

@Controller("api/v1/trust")
export class TrustController {
  constructor(private readonly trustService: TrustService) {}

  @Get("profiles")
  async getTrustProfiles(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.trustService.getTrustProfiles(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }

  @Get("metrics")
  async getTrustMetrics(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.trustService.getTrustMetrics(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }
}
