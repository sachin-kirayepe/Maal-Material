import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { CommerceNetworkService } from "./commerce-network.service";

@Controller("v1/commerce-network")
export class CommerceNetworkController {
  constructor(private readonly networkService: CommerceNetworkService) {}

  @Get("graph")
  async getGraph(@Query("tenantId") tenantId: string) {
    return this.networkService.getNetworkGraph(tenantId);
  }
}
