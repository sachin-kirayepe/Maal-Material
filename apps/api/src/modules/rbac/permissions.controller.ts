import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { RbacService } from "./rbac.service";
import { CreatePermissionDto } from "./dto/rbac.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Roles } from "@common/decorators/roles.decorator";
import { SystemRole } from "@constructos/types";
import { createApiResponse } from "@constructos/utils";

@ApiTags("RBAC - Permissions")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("permissions")
export class PermissionsController {
  constructor(private readonly rbacService: RbacService) {}

  @Post()
  @Roles(SystemRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Create a new action permission (Super Admin only)" })
  async create(@Body() dto: CreatePermissionDto) {
    const result = await this.rbacService.createPermission(dto);
    return createApiResponse(true, result, "Permission created successfully");
  }

  @Get()
  @Roles(SystemRole.SUPER_ADMIN, SystemRole.ADMIN, SystemRole.ORG_ADMIN)
  @ApiOperation({ summary: "List all registered action permissions" })
  async findAll() {
    const result = await this.rbacService.findAllPermissions();
    const permissions = result.map((p) => ({
      id: p.id,
      action: p.action,
      description: p.description,
      createdAt: p.createdAt.toISOString(),
    }));
    return createApiResponse(true, permissions, "Permissions retrieved successfully");
  }
}
