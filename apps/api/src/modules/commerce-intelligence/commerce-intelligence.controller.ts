import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommerceIntelligenceService } from "./commerce-intelligence.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("commerce-intelligence")
export class CommerceIntelligenceController {
  constructor(private readonly service: CommerceIntelligenceService) {}

  @Get("analytics")
  getAnalytics() {
    return this.service.getAnalytics();
  }
}
