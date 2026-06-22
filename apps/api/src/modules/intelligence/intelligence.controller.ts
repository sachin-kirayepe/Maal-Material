import { Controller, Get, Query, HttpStatus, Res, Post, Body } from "@nestjs/common";
import { IntelligenceService } from "./intelligence.service";
import type { Response } from "express";

@Controller("api/v1/intelligence")
export class IntelligenceController {
  constructor(private readonly intelligenceService: IntelligenceService) {}

  @Get("summary")
  async getIntelligenceSummary(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.intelligenceService.getSummary(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }
}
