import { Controller, Get, Query, Param } from "@nestjs/common";
import { VendorsService } from "./vendors.service";

@Controller("vendors")
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  getVendors(@Query("tenantId") tenantId: string) {
    return this.vendorsService.getVendors(tenantId || "tenant-1");
  }

  @Get(":id/scores")
  getVendorScores(@Param("id") id: string) {
    return this.vendorsService.getVendorScores(id);
  }
}
