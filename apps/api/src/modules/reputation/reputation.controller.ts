import { Controller, Get, Query, HttpStatus, Res } from "@nestjs/common";
import { ReputationService } from "./reputation.service";
import type { Response } from "express";

@Controller("api/v1/reputation")
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  @Get("scores")
  async getReputationScores(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.reputationService.getReputationScores(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }
}
