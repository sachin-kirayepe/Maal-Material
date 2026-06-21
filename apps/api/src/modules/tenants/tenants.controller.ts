import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { TenantsService } from "./tenants.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { QueryTenantDto } from "./dto/query-tenant.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";

@Controller("tenants")
@UseGuards(AuthGuard, RolesGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Permissions("tenants:manage")
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Get()
  @Permissions("tenants:manage")
  findAll(@Query() query: QueryTenantDto) {
    return this.tenantsService.findAll(query);
  }

  @Get("analytics")
  @Permissions("tenants:manage")
  getPlatformAnalytics() {
    return this.tenantsService.getPlatformAnalytics();
  }

  @Get(":id")
  @Permissions("tenants:manage")
  findOne(@Param("id") id: string) {
    return this.tenantsService.findOne(id);
  }

  @Get(":id/analytics")
  @Permissions("tenants:manage")
  getAnalytics(@Param("id") id: string) {
    return this.tenantsService.getAnalytics(id);
  }

  @Patch(":id")
  @Permissions("tenants:manage")
  update(@Param("id") id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.update(id, dto);
  }

  @Delete(":id")
  @Permissions("tenants:manage")
  remove(@Param("id") id: string) {
    return this.tenantsService.softDelete(id);
  }
}
