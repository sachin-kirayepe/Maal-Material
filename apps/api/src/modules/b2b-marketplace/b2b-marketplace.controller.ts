import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { B2bMarketplaceService } from "./b2b-marketplace.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("b2b-marketplace")
export class B2bMarketplaceController {
  constructor(private readonly service: B2bMarketplaceService) {}

  @Post("storefronts")
  createStorefront(@Body() data: unknown) {
    return this.service.createStorefront(data);
  }

  @Get("storefronts")
  getStorefronts() {
    return this.service.getStorefronts();
  }

  @Post("orders")
  createOrder(@Body() data: unknown) {
    return this.service.createOrder(data);
  }

  @Get("orders")
  getOrders() {
    return this.service.getOrders();
  }
}
