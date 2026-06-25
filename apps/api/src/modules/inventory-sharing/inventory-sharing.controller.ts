import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InventorySharingService } from "./inventory-sharing.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("v1/inventory-sharing")
export class InventorySharingController {
  constructor(private readonly inventoryService: InventorySharingService) {}

  @Get("transfers")
  async getTransfers(@Query("tenantId") tenantId: string) {
    return this.inventoryService.getTransfers(tenantId);
  }
}
