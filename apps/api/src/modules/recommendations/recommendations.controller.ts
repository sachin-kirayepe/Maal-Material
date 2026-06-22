import { Controller, Get, Post, Body, Query, HttpStatus, Res } from "@nestjs/common";
import { RecommendationsService } from "./recommendations.service";
import type { Response } from "express";

@Controller("api/v1/recommendations")
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  async getRecommendations(
    @Query("tenantId") tenantId: string,
    @Query("module") module: string,
    @Res() res: Response,
  ) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.recommendationsService.getRecommendations(tenantId, module);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }

  @Post("action")
  async actionRecommendation(@Body() body: unknown, @Res() res: Response) {
    try {
      const { tenantId, recommendationId, actionTaken, userId, feedback } = body as any;
      if (!tenantId || !recommendationId || !actionTaken || !userId) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Missing required fields" });
      }
      const data = await this.recommendationsService.actionRecommendation(
        tenantId,
        recommendationId,
        actionTaken,
        userId,
        feedback,
      );
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }
}
