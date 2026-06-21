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
import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDto, UpdateSupplierDto } from "./dto/suppliers.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@ApiTags("Procurement - Suppliers")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("suppliers")
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Post()
  @Permissions("suppliers:create")
  @ApiOperation({ summary: "Register a new supplier" })
  async create(@Body() dto: CreateSupplierDto) {
    const result = await this.service.create(dto);
    return createApiResponse(true, result, "Supplier registered successfully");
  }

  @Get()
  @Permissions("suppliers:read")
  @ApiOperation({ summary: "List all suppliers with search & pagination" })
  async findAll(@Query() query: unknown) {
    const result = await this.service.findAll(query);
    return createApiResponse(true, result);
  }

  @Get("dashboard/stats")
  @Permissions("suppliers:read")
  @ApiOperation({ summary: "Get supplier dashboard statistics" })
  async getStats() {
    const result = await this.service.getDashboardStats();
    return createApiResponse(true, result);
  }

  @Get(":id")
  @Permissions("suppliers:read")
  @ApiOperation({ summary: "Get supplier by ID" })
  async findOne(@Param("id") id: string) {
    const result = await this.service.findById(id);
    return createApiResponse(true, result);
  }

  @Patch(":id")
  @Permissions("suppliers:update")
  @ApiOperation({ summary: "Update supplier" })
  async update(@Param("id") id: string, @Body() dto: UpdateSupplierDto) {
    const result = await this.service.update(id, dto);
    return createApiResponse(true, result, "Supplier updated");
  }

  @Delete(":id")
  @Permissions("suppliers:delete")
  @ApiOperation({ summary: "Soft delete supplier" })
  async remove(@Param("id") id: string) {
    const result = await this.service.softDelete(id);
    return createApiResponse(true, result, "Supplier deactivated");
  }
}
