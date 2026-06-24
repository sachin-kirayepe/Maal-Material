import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ProcurementService } from "./procurement.service";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { TenantGuard } from "@common/guards/tenant.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { TenantId } from "@common/decorators/tenant-id.decorator";
import { CreateRequisitionDto } from "./dto/create-requisition.dto";

@Controller("procurement")
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get("requisitions")
  @Permissions("procurement:read")
  getRequisitions(@TenantId() tenantId: string) {
    return this.procurementService.getRequisitions(tenantId);
  }

  @Get("orders")
  @Permissions("procurement:read")
  getPurchaseOrders(@TenantId() tenantId: string) {
    return this.procurementService.getPurchaseOrders(tenantId);
  }

  @Get("receipts")
  @Permissions("procurement:read")
  getGoodsReceipts(@TenantId() tenantId: string) {
    return this.procurementService.getGoodsReceipts(tenantId);
  }

  @Post("requisitions")
  @Permissions("procurement:write")
  createRequisition(@TenantId() tenantId: string, @Body() data: CreateRequisitionDto) {
    return this.procurementService.createRequisition(tenantId, data);
  }
}
