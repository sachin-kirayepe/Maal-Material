import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { PurchasesService } from "./purchases.service";
import {
  CreatePurchaseOrderDto,
  CreateGoodsReceiptDto,
  CreatePurchaseReturnDto,
} from "./dto/purchases.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@ApiTags("Procurement - Purchases")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("purchases")
export class PurchasesController {
  constructor(private readonly service: PurchasesService) {}

  // ========= PURCHASE ORDERS =========

  @Post("orders")
  @Permissions("purchases:create")
  @ApiOperation({ summary: "Create a new purchase order" })
  async createPO(@Body() dto: CreatePurchaseOrderDto, @Request() req: any) {
    const result = await this.service.createPurchaseOrder(dto, req.user!.sub);
    return createApiResponse(true, result, "Purchase order created");
  }

  @Get("orders")
  @Permissions("purchases:read")
  @ApiOperation({ summary: "List purchase orders" })
  async findAllPOs(@Query() query: unknown) {
    const result = await this.service.findAllPurchaseOrders(query);
    return createApiResponse(true, result);
  }

  @Get("orders/stats")
  @Permissions("purchases:read")
  @ApiOperation({ summary: "Purchase dashboard stats" })
  async getStats() {
    const result = await this.service.getDashboardStats();
    return createApiResponse(true, result);
  }

  @Get("orders/:id")
  @Permissions("purchases:read")
  @ApiOperation({ summary: "Get purchase order by ID" })
  async findOnePO(@Param("id") id: string) {
    const result = await this.service.findPurchaseOrderById(id);
    return createApiResponse(true, result);
  }

  @Patch("orders/:id/approve")
  @Permissions("purchases:approve")
  @ApiOperation({ summary: "Approve a purchase order" })
  async approvePO(@Param("id") id: string, @Request() req: any) {
    const result = await this.service.approvePurchaseOrder(id, req.user!.sub);
    return createApiResponse(true, result, "Purchase order approved");
  }

  @Patch("orders/:id/cancel")
  @Permissions("purchases:update")
  @ApiOperation({ summary: "Cancel a purchase order" })
  async cancelPO(@Param("id") id: string) {
    const result = await this.service.cancelPurchaseOrder(id);
    return createApiResponse(true, result, "Purchase order cancelled");
  }

  // ========= GOODS RECEIPT NOTES =========

  @Post("grn")
  @Permissions("grn:create")
  @ApiOperation({ summary: "Record goods receipt (auto-updates inventory)" })
  async createGRN(@Body() dto: CreateGoodsReceiptDto, @Request() req: any) {
    const result = await this.service.createGoodsReceipt(dto, req.user!.sub);
    return createApiResponse(true, result, "Goods received and stock updated");
  }

  @Get("grn")
  @Permissions("grn:read")
  @ApiOperation({ summary: "List all GRNs" })
  async findAllGRNs(@Query() query: unknown) {
    const result = await this.service.findAllGRNs(query);
    return createApiResponse(true, result);
  }

  @Get("grn/:id")
  @Permissions("grn:read")
  @ApiOperation({ summary: "Get GRN by ID" })
  async findOneGRN(@Param("id") id: string) {
    const result = await this.service.findGRNById(id);
    return createApiResponse(true, result);
  }

  // ========= PURCHASE RETURNS =========

  @Post("returns")
  @Permissions("purchases:create")
  @ApiOperation({ summary: "Create purchase return (auto-decrements stock)" })
  async createReturn(@Body() dto: CreatePurchaseReturnDto, @Request() req: any) {
    const result = await this.service.createPurchaseReturn(dto, req.user!.sub);
    return createApiResponse(true, result, "Purchase return processed");
  }
}
