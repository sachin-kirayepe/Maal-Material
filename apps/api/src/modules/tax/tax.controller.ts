import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { TaxService } from "./tax.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("tax")
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get("rules")
  getTaxRules(@Query("tenantId") tenantId: string) {
    return this.taxService.getTaxRules(tenantId || "tenant-1");
  }

  @Get("records")
  getTaxRecords(
    @Query("tenantId") tenantId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    return this.taxService.getTaxRecords(tenantId || "tenant-1", Number(page), Number(limit));
  }

  @Post("records")
  createTaxRecord(@Body() body: unknown) {
    return this.taxService.createTaxRecord((body as any).tenantId || "tenant-1", body as any);
  }
}
