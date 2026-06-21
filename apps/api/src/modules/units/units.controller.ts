import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { UnitsService } from "./units.service";
import { CreateUnitDto, UpdateUnitDto } from "./dto/units.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@ApiTags("Inventory - Units")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("units")
export class UnitsController {
  constructor(private readonly service: UnitsService) {}

  @Post()
  @Permissions("inventory:create")
  @ApiOperation({ summary: "Create a measurement unit" })
  async create(@Body() dto: CreateUnitDto) {
    return createApiResponse(true, await this.service.create(dto), "Unit created");
  }

  @Get()
  @Permissions("inventory:read")
  @ApiOperation({ summary: "List all measurement units" })
  async findAll() {
    return createApiResponse(true, await this.service.findAll());
  }

  @Get(":id")
  @Permissions("inventory:read")
  async findOne(@Param("id") id: string) {
    return createApiResponse(true, await this.service.findById(id));
  }

  @Patch(":id")
  @Permissions("inventory:update")
  async update(@Param("id") id: string, @Body() dto: UpdateUnitDto) {
    return createApiResponse(true, await this.service.update(id, dto), "Unit updated");
  }

  @Delete(":id")
  @Permissions("inventory:delete")
  async remove(@Param("id") id: string) {
    return createApiResponse(true, await this.service.remove(id));
  }
}
