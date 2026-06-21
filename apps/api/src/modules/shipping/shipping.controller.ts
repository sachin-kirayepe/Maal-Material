import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common";
import { ShippingService } from "./shipping.service";
import { CreateShippingZoneDto, UpdateShippingZoneDto } from "./dto/shipping.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("shipping")
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  create(@Body() dto: CreateShippingZoneDto) {
    return this.shippingService.create(dto);
  }

  @Get()
  findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    return this.shippingService.findAll(Number(page), Number(limit));
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.shippingService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateShippingZoneDto) {
    return this.shippingService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shippingService.remove(id);
  }
}
