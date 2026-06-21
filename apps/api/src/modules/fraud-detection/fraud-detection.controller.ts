import { Controller, Get, Query, HttpStatus, Res, Put, Body, Param } from "@nestjs/common";
import { FraudDetectionService } from "./fraud-detection.service";
import { Response } from "express";

@Controller("api/v1/fraud-detection")
export class FraudDetectionController {
  constructor(private readonly fraudService: FraudDetectionService) {}

  @Get("signals")
  async getFraudSignals(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.fraudService.getFraudSignals(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }

  @Put("signals/:id")
  async updateSignalStatus(
    @Param("id") id: string,
    @Body() body: { tenantId: string; status: string },
    @Res() res: Response,
  ) {
    try {
      const data = await this.fraudService.updateSignalStatus(body.tenantId, id, body.status);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }
}
