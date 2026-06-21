import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { PurchasePaymentsService } from "./purchase-payments.service";
import { CreateSupplierPaymentDto, CreatePurchaseInvoiceDto } from "./dto/purchase-payments.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@ApiTags("Procurement - Payments")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("purchase-payments")
export class PurchasePaymentsController {
  constructor(private readonly service: PurchasePaymentsService) {}

  @Post("invoices")
  @Permissions("purchases:create")
  @ApiOperation({ summary: "Record a purchase invoice from supplier" })
  async createInvoice(@Body() dto: CreatePurchaseInvoiceDto, @Request() req: any) {
    const result = await this.service.createPurchaseInvoice(dto, req.user!.sub);
    return createApiResponse(true, result, "Purchase invoice recorded");
  }

  @Get("invoices")
  @Permissions("purchases:read")
  @ApiOperation({ summary: "List purchase invoices" })
  async findAllInvoices(@Query() query: unknown) {
    const result = await this.service.findAllPurchaseInvoices(query);
    return createApiResponse(true, result);
  }

  @Post("payments")
  @Permissions("purchases:create")
  @ApiOperation({ summary: "Process supplier payment" })
  async processPayment(@Body() dto: CreateSupplierPaymentDto, @Request() req: any) {
    const result = await this.service.processSupplierPayment(dto, req.user!.sub);
    return createApiResponse(true, result, "Supplier payment processed");
  }

  @Get("payments/supplier/:supplierId")
  @Permissions("purchases:read")
  @ApiOperation({ summary: "Get supplier payment history" })
  async getSupplierPayments(@Param("supplierId") supplierId: string) {
    const result = await this.service.findSupplierPayments(supplierId);
    return createApiResponse(true, result);
  }

  @Get("ledger/:supplierId")
  @Permissions("purchases:read")
  @ApiOperation({ summary: "Get supplier ledger with entries" })
  async getSupplierLedger(@Param("supplierId") supplierId: string) {
    const result = await this.service.getSupplierLedger(supplierId);
    return createApiResponse(true, result);
  }
}
