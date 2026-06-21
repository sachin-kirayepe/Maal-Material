import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { InventorySharingService } from "./inventory-sharing.service";

@Controller("v1/inventory-sharing")
export class InventorySharingController {
  constructor(private readonly inventoryService: InventorySharingService) {}

  @Get("transfers")
  async getTransfers(@Query("tenantId") tenantId: string) {
    return this.inventoryService.getTransfers(tenantId);
  }
}
