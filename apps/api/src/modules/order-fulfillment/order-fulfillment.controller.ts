import { Controller, Post, Body, Patch, Param, UseGuards, Request } from "@nestjs/common";
import { OrderFulfillmentService } from "./order-fulfillment.service";
import { CreateFulfillmentDto } from "./dto/order-fulfillment.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("order-fulfillment")
export class OrderFulfillmentController {
  constructor(private readonly fulfillmentService: OrderFulfillmentService) {}

  @Post()
  createFulfillment(@Body() createFulfillmentDto: CreateFulfillmentDto, @Request() req: unknown) {
    return this.fulfillmentService.createFulfillment(createFulfillmentDto, (req as any).user!.id);
  }

  @Patch(":id/shipped")
  markAsShipped(@Param("id") id: string) {
    return this.fulfillmentService.markAsShipped(id);
  }

  @Patch(":id/delivered")
  markAsDelivered(@Param("id") id: string) {
    return this.fulfillmentService.markAsDelivered(id);
  }
}
