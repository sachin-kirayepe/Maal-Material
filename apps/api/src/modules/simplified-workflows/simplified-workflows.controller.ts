import { Controller, Post, Body } from "@nestjs/common";
import { SimplifiedWorkflowsService } from "./simplified-workflows.service";

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
