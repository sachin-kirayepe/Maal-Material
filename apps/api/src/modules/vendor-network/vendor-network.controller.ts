import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { VendorNetworkService } from "./vendor-network.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("vendor-network")
export class VendorNetworkController {
  constructor(private readonly service: VendorNetworkService) {}

  @Post("vendors")
  createVendor(@Body() data: unknown) {
    return this.service.createVendor(data);
  }

  @Get("vendors")
  getVendors() {
    return this.service.getVendors();
  }

  @Post("ratings")
  rateVendor(@Body() data: unknown) {
    return this.service.rateVendor(data);
  }
}
