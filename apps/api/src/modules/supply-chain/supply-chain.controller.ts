import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { SupplyChainService } from "./supply-chain.service";

@Controller("v1/supply-chain")
export class SupplyChainController {
  constructor(private readonly supplyChainService: SupplyChainService) {}

  @Get("logistics")
  async getLogistics(@Query("tenantId") tenantId: string) {
    return this.supplyChainService.getLogistics(tenantId);
  }
}
