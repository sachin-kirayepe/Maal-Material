import { createApiResponse } from "@constructos/utils";
import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto/orders.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req: unknown) {
    const result = await this.ordersService.create(createOrderDto, (req as any).user!.id);
    return createApiResponse(true, result, "Order created");
  }

  @Get()
  async findAll(
    @Query("skip") skip?: number,
    @Query("take") take?: number,
  ) {
    const result = await this.ordersService.findAll({ skip, take });
    return createApiResponse(true, result);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const result = await this.ordersService.findOne(id);
    return createApiResponse(true, result);
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Request() req: unknown,
  ) {
    const result = await this.ordersService.updateStatus(
      id,
      updateOrderStatusDto,
      (req as any).user!.id,
    );
    return createApiResponse(true, result, "Order status updated");
  }
}
