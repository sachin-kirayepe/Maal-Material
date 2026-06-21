import { Controller, Get, Post, Body, Request, Param, UseGuards, Query } from "@nestjs/common";
import { LedgerService } from "./ledger.service";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@Controller("ledger")
@UseGuards(AuthGuard, RolesGuard)
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post("entries")
  @Permissions("ledger:write")
  async createEntry(@Body() body: any, @Request() req: any) {
    const userId = req.user?.sub || req.user?.id || "system";
    const entry = await this.ledgerService.recordTransaction({
      ...body,
      createdBy: userId,
    });
    return createApiResponse(true, entry, "Journal entry recorded successfully");
  }

  @Get("entries")
  @Permissions("ledger:read")
  async getEntries(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const result = await this.ledgerService.getAllEntries(Number(page), Number(limit));
    return createApiResponse(true, result, "Entries fetched successfully");
  }

  @Get("customer/:customerId")
  @Permissions("ledger:read")
  async getCustomerLedger(@Param("customerId") customerId: string) {
    const ledger = await this.ledgerService.getCustomerLedger(customerId);
    return createApiResponse(true, ledger, "Ledger fetched successfully");
  }

  @Get("account/:accountId")
  @Permissions("ledger:read")
  async getAccountBalance(@Param("accountId") accountId: string) {
    const account = await this.ledgerService.getAccountBalance(accountId);
    return createApiResponse(true, account, "Account fetched successfully");
  }
}
