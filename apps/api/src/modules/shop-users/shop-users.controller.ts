import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from "@nestjs/common";
import { ShopUsersService } from "./shop-users.service";
import { CreateShopUserDto } from "./dto/create-shop-user.dto";
import { UpdateShopUserDto } from "./dto/update-shop-user.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { TenantGuard } from "@common/guards/tenant.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { TenantId } from "@common/decorators/tenant-id.decorator";

@Controller("shop-users")
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
export class ShopUsersController {
  constructor(private readonly shopUsersService: ShopUsersService) {}

  @Post(":shopId")
  @Permissions("shop-users:manage")
  create(
    @Param("shopId") shopId: string,
    @TenantId() tenantId: string,
    @Body() dto: CreateShopUserDto,
  ) {
    return this.shopUsersService.addUserToShop(shopId, tenantId, dto);
  }

  @Get("shop/:shopId")
  @Permissions("shops:read")
  findAll(@Param("shopId") shopId: string, @TenantId() tenantId: string) {
    return this.shopUsersService.findAllByShop(shopId, tenantId);
  }

  @Patch(":id")
  @Permissions("shop-users:manage")
  update(@Param("id") id: string, @TenantId() tenantId: string, @Body() dto: UpdateShopUserDto) {
    return this.shopUsersService.updateRole(id, tenantId, dto);
  }

  @Delete(":id")
  @Permissions("shop-users:manage")
  remove(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.shopUsersService.removeFromShop(id, tenantId);
  }
}
