import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { TreasuryService } from "./treasury.service";

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
