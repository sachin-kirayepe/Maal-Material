import { Controller, Get, Query } from "@nestjs/common";
import { PurchaseIntelligenceService } from "./purchase-intelligence.service";

@Controller("purchase-intelligence")
export class PurchaseIntelligenceController {
  constructor(private readonly purchaseIntelligenceService: PurchaseIntelligenceService) {}

  @Get("analytics")
  getAnalytics(@Query("tenantId") tenantId: string) {
    return this.purchaseIntelligenceService.getAnalytics(tenantId || "tenant-1");
  }
}
