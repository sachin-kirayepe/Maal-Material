import { Controller, Get, Query } from "@nestjs/common";
import { SourcingService } from "./sourcing.service";

@Controller("sourcing")
export class SourcingController {
  constructor(private readonly sourcingService: SourcingService) {}

  @Get("rfqs")
  getRfqs(@Query("tenantId") tenantId: string) {
    return this.sourcingService.getRfqs(tenantId || "tenant-1");
  }

  @Get("quotations")
  getQuotations(@Query("tenantId") tenantId: string) {
    return this.sourcingService.getQuotations(tenantId || "tenant-1");
  }
}
