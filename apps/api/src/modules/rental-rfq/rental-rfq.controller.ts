import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { RentalRfqService } from "./rental-rfq.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/rental-rfq")
export class RentalRfqController {
  constructor(private readonly rfqService: RentalRfqService) {}

  @Get()
  async getRfqs(@Query("tenantId") tenantId: string) {
    return this.rfqService.getRfqs(tenantId);
  }

  @Post()
  async createRfq(@Body() data: unknown) {
    return this.rfqService.createRfq({
      ...(data as any),
      requiredFrom: new Date((data as any).requiredFrom),
      requiredUntil: new Date((data as any).requiredUntil),
    });
  }
}
