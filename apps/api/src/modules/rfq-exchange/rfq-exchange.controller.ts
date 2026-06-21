import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { RfqExchangeService } from "./rfq-exchange.service";

@Controller("v1/rfq-exchange")
export class RfqExchangeController {
  constructor(private readonly rfqService: RfqExchangeService) {}

  @Get()
  async getRfqs(
    @Query("tenantId") tenantId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    return this.rfqService.getAllRfqs(tenantId || "tenant-1", Number(page), Number(limit));
  }

  @Post(":id/bid")
  async submitBid(@Param("id") rfqId: string, @Body() body: { amount: number, notes?: string }) {
    return this.rfqService.submitBid(rfqId, body);
  }
}
