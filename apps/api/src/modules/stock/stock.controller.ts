import { Controller, Post, Get, Body, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { StockService } from "./stock.service";
import {
  StockInDto,
  StockOutDto,
  StockTransferDto,
  StockAdjustmentDto,
  StockReservationDto,
} from "./dto/stock.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { CurrentUser } from "@common/decorators/current-user.decorator";
import { JwtPayload } from "@constructos/types";
import { createApiResponse } from "@constructos/utils";

@ApiTags("Inventory - Stock Engine")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("stock")
export class StockController {
  constructor(private readonly service: StockService) {}

  @Post("in")
  @Permissions("inventory:create")
  @ApiOperation({ summary: "Add stock to warehouse" })
  async stockIn(@Body() dto: StockInDto, @CurrentUser() user: JwtPayload) {
    return createApiResponse(true, await this.service.stockIn(dto, user!.sub), "Stock received");
  }

  @Post("out")
  @Permissions("inventory:update")
  @ApiOperation({ summary: "Remove stock from warehouse" })
  async stockOut(@Body() dto: StockOutDto, @CurrentUser() user: JwtPayload) {
    return createApiResponse(true, await this.service.stockOut(dto, user!.sub), "Stock dispatched");
  }

  @Post("transfer")
  @Permissions("inventory:update")
  @ApiOperation({ summary: "Transfer stock between warehouses" })
  async transfer(@Body() dto: StockTransferDto, @CurrentUser() user: JwtPayload) {
    return createApiResponse(
      true,
      await this.service.transfer(dto, user!.sub),
      "Stock transferred",
    );
  }

  @Post("adjust")
  @Permissions("inventory:update")
  @ApiOperation({ summary: "Adjust stock count" })
  async adjust(@Body() dto: StockAdjustmentDto, @CurrentUser() user: JwtPayload) {
    return createApiResponse(true, await this.service.adjust(dto, user!.sub), "Stock adjusted");
  }

  @Post("reserve")
  @Permissions("inventory:update")
  @ApiOperation({ summary: "Reserve stock for order" })
  async reserve(@Body() dto: StockReservationDto, @CurrentUser() user: JwtPayload) {
    return createApiResponse(true, await this.service.reserve(dto, user!.sub), "Stock reserved");
  }

  @Get("movements")
  @Permissions("inventory:read")
  @ApiOperation({ summary: "Get stock movement history" })
  async movements(@Query() query: unknown) {
    return createApiResponse(true, await this.service.getMovements(query));
  }

  @Get("overview")
  @Permissions("inventory:read")
  @ApiOperation({ summary: "Get stock overview across warehouses" })
  async overview() {
    return createApiResponse(true, await this.service.getStockOverview());
  }
}
