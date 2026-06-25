import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, HttpStatus, Res, Put, Body, Param, UseGuards } from '@nestjs/common';
import { DisputesService } from "./disputes.service";
import type { Response } from "express";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/disputes")
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get("cases")
  async getDisputeCases(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "tenantId is required" });
      const data = await this.disputesService.getDisputeCases(tenantId);
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }

  @Put("cases/:id")
  async updateDisputeStatus(
    @Param("id") id: string,
    @Body() body: { tenantId: string; status: string; resolution?: string },
    @Res() res: Response,
  ) {
    try {
      const data = await this.disputesService.updateDisputeStatus(
        body.tenantId,
        id,
        body.status,
        body.resolution,
      );
      return res.status(HttpStatus.OK).json({ status: "success", data });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as any).message });
    }
  }
}
