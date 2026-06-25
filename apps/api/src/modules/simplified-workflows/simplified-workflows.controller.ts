import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SimplifiedWorkflowsService } from "./simplified-workflows.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("simplified-workflows")
export class SimplifiedWorkflowsController {
  constructor(private readonly simplifiedWorkflowsService: SimplifiedWorkflowsService) {}

  @Post("quick-bill")
  async createQuickBill(
    @Body()
    payload: {
      tenantId: string;
      shopId: string;
      userId: string;
      customerId?: string;
      items: { productId: string; quantity: number; unitPrice: number }[];
      amountPaid: number;
      paymentMode: string;
      gstIn?: string;
    },
  ) {
    return await this.simplifiedWorkflowsService.createQuickBill(payload);
  }
}
