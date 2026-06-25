import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { VendorsService } from "./vendors.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("vendors")
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  getVendors(@Query("tenantId") tenantId: string) {
    return this.vendorsService.getVendors(tenantId || "tenant-1");
  }

  @Get(":id/scores")
  getVendorScores(@Param("id") id: string) {
    return this.vendorsService.getVendorScores(id);
  }
}
