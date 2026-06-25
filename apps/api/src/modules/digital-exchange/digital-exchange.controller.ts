import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DigitalExchangeService } from "./digital-exchange.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("digital-exchange")
export class DigitalExchangeController {
  constructor(private readonly service: DigitalExchangeService) {}

  @Post("rfqs")
  createRfq(@Body() data: unknown) {
    return this.service.createRfq(data);
  }

  @Get("rfqs")
  getRfqs() {
    return this.service.getRfqs();
  }

  @Post("quotations")
  submitQuotation(@Body() data: unknown) {
    return this.service.submitQuotation(data);
  }
}
