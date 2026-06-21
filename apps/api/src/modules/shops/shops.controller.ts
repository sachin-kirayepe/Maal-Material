import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ShopsService } from "./shops.service";
import { CreateShopDto } from "./dto/create-shop.dto";
import { UpdateShopDto, UpdateShopAddressDto, UpdateShopSettingsDto } from "./dto/update-shop.dto";
import { QueryShopDto } from "./dto/query-shop.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { TenantGuard } from "@common/guards/tenant.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { TenantId } from "@common/decorators/tenant-id.decorator";

@Controller("shops")
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @Permissions("shops:create")
  create(@TenantId() tenantId: string, @Body() dto: CreateShopDto) {
    return this.shopsService.create(tenantId, dto);
  }

  @Get()
  @Permissions("shops:read")
  findAll(@TenantId() tenantId: string, @Query() query: QueryShopDto) {
    return this.shopsService.findAllByTenant(tenantId, query);
  }

  @Get(":id")
  @Permissions("shops:read")
  findOne(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.shopsService.findOne(id, tenantId);
  }

  @Patch(":id")
  @Permissions("shops:manage")
  update(@Param("id") id: string, @TenantId() tenantId: string, @Body() dto: UpdateShopDto) {
    return this.shopsService.update(id, tenantId, dto);
  }

  @Delete(":id")
  @Permissions("shops:manage")
  remove(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.shopsService.softDelete(id, tenantId);
  }

  @Put(":id/address")
  @Permissions("shops:manage")
  updateAddress(
    @Param("id") id: string,
    @TenantId() tenantId: string,
    @Body() dto: UpdateShopAddressDto,
  ) {
    return this.shopsService.updateAddress(id, tenantId, dto);
  }

  @Put(":id/settings")
  @Permissions("shops:manage")
  updateSettings(
    @Param("id") id: string,
    @TenantId() tenantId: string,
    @Body() dto: UpdateShopSettingsDto,
  ) {
    return this.shopsService.updateSettings(id, tenantId, dto);
  }

  @Get(":id/analytics")
  @Permissions("shops:read")
  getAnalytics(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.shopsService.getShopAnalytics(id, tenantId);
  }
}
