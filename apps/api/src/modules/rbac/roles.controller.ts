import { Controller, Get, Post, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { RbacService } from "./rbac.service";
import { CreateRoleDto, AssignPermissionDto } from "./dto/rbac.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Roles } from "@common/decorators/roles.decorator";
import { SystemRole } from "@constructos/types";
import { createApiResponse } from "@constructos/utils";

@ApiTags("RBAC - Roles")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("roles")
export class RolesController {
  constructor(private readonly rbacService: RbacService) {}

  @Post()
  @Roles(SystemRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Create a new security role (Super Admin only)" })
  async create(@Body() dto: CreateRoleDto) {
    const result = await this.rbacService.createRole(dto);
    return createApiResponse(true, result, "Role created successfully");
  }

  @Get()
  @Roles(SystemRole.SUPER_ADMIN, SystemRole.ADMIN, SystemRole.ORG_ADMIN)
  @ApiOperation({ summary: "List all active system roles" })
  async findAll() {
    const result = await this.rbacService.findAllRoles();
    // Normalize permissions mapping for unified client consumption
    const roles = result.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      permissions: r.rolePermissions?.map((p: unknown) => ({
        id: (p as any).permissions?.id,
        action: (p as any).permissions?.action,
        description: (p as any).permissions?.description,
        createdAt: (p as any).permissions?.createdAt.toISOString(),
      })),
    }));
    return createApiResponse(true, roles, "Roles retrieved successfully");
  }

  @Get(":name")
  @Roles(SystemRole.SUPER_ADMIN, SystemRole.ADMIN, SystemRole.ORG_ADMIN)
  @ApiOperation({ summary: "Retrieve detailed configuration for a role" })
  async findOne(@Param("name") name: string) {
    const r = await this.rbacService.findRoleByName(name);
    const role = {
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      permissions: r.rolePermissions?.map((p: unknown) => ({
        id: (p as any).permissions?.id,
        action: (p as any).permissions?.action,
        description: (p as any).permissions?.description,
        createdAt: (p as any).permissions?.createdAt.toISOString(),
      })),
    };
    return createApiResponse(true, role, "Role details retrieved successfully");
  }

  @Post(":name/permissions")
  @Roles(SystemRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Assign a permission key to a role (Super Admin only)" })
  async assignPermission(@Param("name") name: string, @Body() dto: AssignPermissionDto) {
    const result = await this.rbacService.assignPermissionToRole(name, dto.permissionAction);
    return createApiResponse(true, result, `Permission linked to role successfully`);
  }

  @Delete(":name/permissions/:action")
  @Roles(SystemRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Unassign a permission key from a role (Super Admin only)" })
  async removePermission(@Param("name") name: string, @Param("action") action: string) {
    const result = await this.rbacService.removePermissionFromRole(name, action);
    return createApiResponse(true, result, `Permission unlinked from role successfully`);
  }
}
