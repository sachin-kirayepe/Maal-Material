import { Controller, Get, Post, Body, Query, Res, HttpStatus } from "@nestjs/common";
import { ReconciliationService } from "./reconciliation.service";
import type { Response } from "express";

@Controller("api/v1/reconciliation")
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Get("conflicts")
  async getConflicts(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "tenantId is required",
        });
      }

      const conflicts = await this.reconciliationService.getUnresolvedConflicts(tenantId);

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: conflicts,
      });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: (error as any).message || "Error fetching conflicts",
      });
    }
  }

  @Post("resolve")
  async resolveConflict(@Body() body: unknown, @Res() res: Response) {
    try {
      const { tenantId, conflictId, resolutionStrategy, resolvedState, userId } = body as any;

      if (!tenantId || !conflictId || !resolutionStrategy || !userId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Missing required parameters for conflict resolution",
        });
      }

      const resolution = await this.reconciliationService.resolveConflict(
        tenantId,
        conflictId,
        resolutionStrategy,
        resolvedState,
        userId,
      );

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: resolution,
      });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: (error as any).message || "Error resolving conflict",
      });
    }
  }
}
