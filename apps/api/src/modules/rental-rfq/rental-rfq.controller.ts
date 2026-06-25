import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, UseGuards, Param, Request } from '@nestjs/common';
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

  @Get(":id")
  async getRfqById(@Param("id") id: string) {
    return this.rfqService.getRfqById(id);
  }

  @Get(":id/quotes")
  async getQuotesForRfq(@Param("id") id: string) {
    return this.rfqService.getQuotesForRfq(id);
  }

  @Post(":id/quotes")
  async submitQuote(
    @Param("id") id: string,
    @Body() payload: { quoteAmount: number, terms: string },
    @Request() req: any
  ) {
    const vendorId = req.user?.id || "vendor-1";
    return this.rfqService.submitQuote(id, vendorId, payload.quoteAmount, payload.terms);
  }
}
