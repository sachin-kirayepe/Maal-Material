import { Controller, Get, Post, Body, Query, UseGuards, Request } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@Controller("v1/payments")
@UseGuards(AuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Permissions("payments:create")
  async create(@Body() createPaymentDto: CreatePaymentDto, @Request() req: unknown) {
    const userId = (req as any).user!.id;
    const payment = await this.paymentsService.create(createPaymentDto, userId);
    return createApiResponse(true, payment, "Payment recorded successfully");
  }

  @Get()
  @Permissions("payments:read")
  async findAll(
    @Query("skip") skip?: number,
    @Query("take") take?: number,
    @Query("invoiceId") invoiceId?: string,
    @Query("customerId") customerId?: string,
  ) {
    const data = await this.paymentsService.findAll({ skip, take, invoiceId, customerId });
    return createApiResponse(true, data, "Payments retrieved successfully");
  }
}
