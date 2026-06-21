import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto } from "./dto/products.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@ApiTags("Inventory - Products")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("products")
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  @Permissions("inventory:create")
  @ApiOperation({ summary: "Create a product" })
  async create(@Body() dto: CreateProductDto) {
    return createApiResponse(true, await this.service.create(dto), "Product created");
  }

  @Get()
  @Permissions("inventory:read")
  @ApiOperation({ summary: "List products with search, filter, pagination" })
  async findAll(@Query() query: unknown) {
    const result = await this.service.findAll(query);
    return createApiResponse(true, result);
  }

  @Get("dashboard")
  @Permissions("inventory:read")
  @ApiOperation({ summary: "Get inventory dashboard statistics" })
  async dashboard() {
    return createApiResponse(true, await this.service.getDashboardStats());
  }

  @Get("sku/:sku")
  @Permissions("inventory:read")
  @ApiOperation({ summary: "Find product by SKU" })
  async findBySku(@Param("sku") sku: string) {
    return createApiResponse(true, await this.service.findBySku(sku));
  }

  @Get("barcode/:barcode")
  @Permissions("inventory:read")
  @ApiOperation({ summary: "Find product by barcode" })
  async findByBarcode(@Param("barcode") barcode: string) {
    return createApiResponse(true, await this.service.findByBarcode(barcode));
  }

  @Get(":id")
  @Permissions("inventory:read")
  @ApiOperation({ summary: "Get product details" })
  async findOne(@Param("id") id: string) {
    return createApiResponse(true, await this.service.findById(id));
  }

  @Patch(":id")
  @Permissions("inventory:update")
  @ApiOperation({ summary: "Update product" })
  async update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return createApiResponse(true, await this.service.update(id, dto), "Product updated");
  }

  @Delete(":id")
  @Permissions("inventory:delete")
  @ApiOperation({ summary: "Soft delete product" })
  async remove(@Param("id") id: string) {
    return createApiResponse(true, await this.service.remove(id));
  }
}
