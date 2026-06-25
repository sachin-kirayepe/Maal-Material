import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CommerceNetworkService } from "./commerce-network.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("v1/commerce-network")
export class CommerceNetworkController {
  constructor(private readonly networkService: CommerceNetworkService) {}

  @Get("graph")
  async getGraph(@Query("tenantId") tenantId: string) {
    return this.networkService.getNetworkGraph(tenantId);
  }
}
