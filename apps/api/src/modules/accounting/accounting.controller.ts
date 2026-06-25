import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AccountingService } from "./accounting.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("accounting")
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get("chart-of-accounts")
  getChartOfAccounts(@Query("tenantId") tenantId: string) {
    return this.accountingService.getChartOfAccounts(tenantId || "tenant-1");
  }

  @Get("ledgers")
  getLedgerAccounts(@Query("tenantId") tenantId: string) {
    return this.accountingService.getLedgerAccounts(tenantId || "tenant-1");
  }

  @Get("journals")
  getJournalEntries(
    @Query("tenantId") tenantId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    return this.accountingService.getJournalEntries(tenantId || "tenant-1", Number(page), Number(limit));
  }

  @Post("journals")
  createJournalEntry(@Body() body: unknown) {
    return this.accountingService.createJournalEntry(
      (body as any).tenantId || "tenant-1",
      body as any,
    );
  }
}
