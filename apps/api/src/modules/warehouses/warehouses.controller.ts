import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { WarehousesService } from "./warehouses.service";
import { CreateWarehouseDto, UpdateWarehouseDto } from "./dto/warehouses.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@ApiTags("Inventory - Warehouses")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("warehouses")
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  @Post()
  @Permissions("inventory:create")
  @ApiOperation({ summary: "Create a warehouse" })
  async create(@Body() dto: CreateWarehouseDto) {
    return createApiResponse(true, await this.service.create(dto), "Warehouse created");
  }

  @Get()
  @Permissions("inventory:read")
  @ApiOperation({ summary: "List all warehouses" })
  async findAll() {
    return createApiResponse(true, await this.service.findAll());
  }

  @Get(":id")
  @Permissions("inventory:read")
  @ApiOperation({ summary: "Get warehouse with stock" })
  async findOne(@Param("id") id: string) {
    return createApiResponse(true, await this.service.findById(id));
  }

  @Patch(":id")
  @Permissions("inventory:update")
  async update(@Param("id") id: string, @Body() dto: UpdateWarehouseDto) {
    return createApiResponse(true, await this.service.update(id, dto), "Warehouse updated");
  }

  @Delete(":id")
  @Permissions("inventory:delete")
  async remove(@Param("id") id: string) {
    return createApiResponse(true, await this.service.remove(id));
  }
}
