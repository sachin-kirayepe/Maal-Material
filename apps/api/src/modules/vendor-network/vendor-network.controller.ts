import { Controller, Get, Post, Body } from "@nestjs/common";
import { VendorNetworkService } from "./vendor-network.service";

@Controller("vendor-network")
export class VendorNetworkController {
  constructor(private readonly service: VendorNetworkService) {}

  @Post("vendors")
  createVendor(@Body() data: unknown) {
    return this.service.createVendor(data);
  }

  @Get("vendors")
  getVendors() {
    return this.service.getVendors();
  }

  @Post("ratings")
  rateVendor(@Body() data: unknown) {
    return this.service.rateVendor(data);
  }
}
