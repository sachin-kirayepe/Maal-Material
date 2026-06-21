import { Controller, Get, Query } from "@nestjs/common";
import { VendorDiscoveryService } from "./vendor-discovery.service";

@Controller("v1/vendor-discovery")
export class VendorDiscoveryController {
  constructor(private readonly discoveryService: VendorDiscoveryService) {}

  @Get("insights")
  async getInsights(@Query("tenantId") tenantId: string) {
    return this.discoveryService.getInsights(tenantId);
  }
}
