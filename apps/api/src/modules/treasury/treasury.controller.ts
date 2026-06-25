import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { TreasuryService } from "./treasury.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("treasury")
export class TreasuryController {
  constructor(private readonly treasuryService: TreasuryService) {}

  @Get("bank-accounts")
  getBankAccounts(@Query("tenantId") tenantId: string) {
    return this.treasuryService.getBankAccounts(tenantId || "tenant-1");
  }

  @Get("balance")
  getTreasuryBalance(@Query("tenantId") tenantId: string) {
    return this.treasuryService.getTreasuryBalance(tenantId || "tenant-1");
  }

  @Post("bank-accounts")
  createBankAccount(@Body() body: unknown) {
    return this.treasuryService.createBankAccount((body as any).tenantId || "tenant-1", body);
  }
}
