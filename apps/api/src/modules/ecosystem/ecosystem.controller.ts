import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { EcosystemService } from "./ecosystem.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("ecosystem")
export class EcosystemController {
  constructor(private readonly service: EcosystemService) {}

  @Post("connections")
  createConnection(@Body() data: unknown) {
    return this.service.createConnection(data);
  }

  @Get("connections")
  getConnections() {
    return this.service.getConnections();
  }

  @Post("settlements")
  processSettlement(@Body() data: unknown) {
    return this.service.processSettlement(data);
  }

  @Get("settlements")
  getSettlements() {
    return this.service.getSettlements();
  }
}
