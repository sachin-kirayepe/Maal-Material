import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { TaxService } from "./tax.service";

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
