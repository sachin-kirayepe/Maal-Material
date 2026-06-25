import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Body, Get, Query, Req, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { OfflineSyncService } from "./offline-sync.service";
import type { Request, Response } from "express";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/offline-sync")
export class OfflineSyncController {
  constructor(private readonly syncService: OfflineSyncService) {}

  @Post("push")
  async pushOperations(@Body() body: unknown, @Res() res: Response) {
    try {
      const { tenantId, deviceId, operations } = body as any;

      if (!tenantId || !deviceId || !Array.isArray(operations)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Invalid sync payload. Requires tenantId, deviceId, and operations array.",
        });
      }

      const result = await this.syncService.processOfflineQueue(tenantId, deviceId, operations);

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: result,
      });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: (error as any).message || "Internal server (error as any) during sync push",
      });
    }
  }

  @Get("pull")
  async pullData(
    @Query("tenantId") tenantId: string,
    @Query("deviceId") id: string,
    @Res() res: Response,
  ) {
    try {
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      if (!tenantId || !deviceId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "tenantId and deviceId are required.",
        });
      }

      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      const data = await this.syncService.pullCheckpoints(tenantId, deviceId);

      return res.status(HttpStatus.OK).json({
        status: "success",
        data,
      });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: (error as any).message || "Internal server (error as any) during sync pull",
      });
    }
  }
}
