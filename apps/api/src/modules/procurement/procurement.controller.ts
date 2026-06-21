import { Controller, Get, Post, Body, Query, Param } from "@nestjs/common";
import { ProcurementService } from "./procurement.service";

@Controller("procurement")
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get("requisitions")
  getRequisitions(@Query("tenantId") tenantId: string) {
    return this.procurementService.getRequisitions(tenantId || "tenant-1");
  }

  @Get("orders")
  getPurchaseOrders(@Query("tenantId") tenantId: string) {
    return this.procurementService.getPurchaseOrders(tenantId || "tenant-1");
  }

  @Get("receipts")
  getGoodsReceipts(@Query("tenantId") tenantId: string) {
    return this.procurementService.getGoodsReceipts(tenantId || "tenant-1");
  }

  @Post("requisitions")
  createRequisition(@Body() data: unknown, @Query("tenantId") tenantId: string) {
    return this.procurementService.createRequisition(tenantId || "tenant-1", data);
  }
}
