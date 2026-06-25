import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SupplyChainService } from "./supply-chain.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("v1/supply-chain")
export class SupplyChainController {
  constructor(private readonly supplyChainService: SupplyChainService) {}

  @Get("logistics")
  async getLogistics(@Query("tenantId") tenantId: string) {
    return this.supplyChainService.getLogistics(tenantId);
  }
}
