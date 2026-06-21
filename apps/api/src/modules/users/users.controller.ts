import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from "./dto/users.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Roles } from "@common/decorators/roles.decorator";
import { CurrentUser } from "@common/decorators/current-user.decorator";
import { SystemRole, JwtPayload } from "@constructos/types";
import { createApiResponse } from "@constructos/utils";

@ApiTags("Enterprise - Users")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(SystemRole.SUPER_ADMIN, SystemRole.ADMIN)
  @ApiOperation({ summary: "Create a new user account (Admin only)" })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return createApiResponse(true, this.sanitizeUser(user), "User account created successfully");
  }

  @Get()
  @Roles(SystemRole.SUPER_ADMIN, SystemRole.ADMIN, SystemRole.ORG_ADMIN)
  @ApiOperation({ summary: "List all active user accounts" })
  async findAll() {
    const result = await this.usersService.findAll();
    const users = result.map((u) => this.sanitizeUser(u));
    return createApiResponse(true, users, "Users retrieved successfully");
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve detailed profile for a single user" })
  async findOne(@Param("id") id: string, @CurrentUser() currentUser: JwtPayload) {
    // Users can read their own profile, admins can read any profile
    if (
      currentUser.role !== SystemRole.SUPER_ADMIN &&
      currentUser.role !== SystemRole.ADMIN &&
      currentUser.sub !== id
    ) {
      throw new ForbiddenException("Access denied: You do not have privilege to view this profile");
    }
    const user = await this.usersService.findOneById(id);
    return createApiResponse(true, this.sanitizeUser(user), "User profile retrieved successfully");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Modify profile details or active states" })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    // Enforce role assignment security
    if (dto.roleNames && currentUser.role !== SystemRole.SUPER_ADMIN) {
      throw new ForbiddenException(
        "Access denied: Only Super Admins can assign or alter security roles",
      );
    }

    if (
      currentUser.role !== SystemRole.SUPER_ADMIN &&
      currentUser.role !== SystemRole.ADMIN &&
      currentUser.sub !== id
    ) {
      throw new ForbiddenException(
        "Access denied: You do not have privilege to modify this profile",
      );
    }

    const user = await this.usersService.update(id, dto);
    return createApiResponse(true, this.sanitizeUser(user), "User profile updated successfully");
  }

  @Delete(":id")
  @Roles(SystemRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Soft delete a user account (Super Admin only)" })
  async remove(@Param("id") id: string) {
    const result = await this.usersService.remove(id);
    return createApiResponse(true, result, "User account logically removed");
  }

  @Post(":id/roles")
  @Roles(SystemRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Link an additional role to a user (Super Admin only)" })
  async assignRole(@Param("id") id: string, @Body() dto: AssignRoleDto) {
    const result = await this.usersService.assignRole(id, dto.roleName);
    return createApiResponse(true, result, "Role mapped to user successfully");
  }

  @Delete(":id/roles/:roleName")
  @Roles(SystemRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Unlink a role from a user (Super Admin only)" })
  async removeRole(@Param("id") id: string, @Param("roleName") roleName: string) {
    const result = await this.usersService.removeRole(id, roleName);
    return createApiResponse(true, result, "Role unmapped from user successfully");
  }

  /**
   * Cleans internal relational DB structure to align with frontend types expectation
   */
  private sanitizeUser(u: unknown) {
    const primaryRole = (u as any).userRoles?.[0]?.roles;
    return {
      id: (u as any).id,
      email: (u as any).email,
      firstName: (u as any).firstName,
      lastName: (u as any).lastName,
      isActive: (u as any).isActive,
      roleId: primaryRole?.id || "",
      createdAt: (u as any).createdAt.toISOString(),
      updatedAt: (u as any).updatedAt.toISOString(),
      deletedAt: (u as any).deletedAt ? (u as any).deletedAt.toISOString() : null,
      role: primaryRole
        ? {
            id: primaryRole.id,
            name: primaryRole.name,
            description: primaryRole.description,
            createdAt: primaryRole.createdAt.toISOString(),
            updatedAt: primaryRole.updatedAt.toISOString(),
            permissions: primaryRole.rolePermissions?.map((p: unknown) => ({
              id: (p as any).permissions?.id,
              action: (p as any).permissions?.action,
              description: (p as any).permissions?.description,
              createdAt: (p as any).permissions?.createdAt.toISOString(),
            })),
          }
        : undefined,
      roles: (u as any).userRoles
        ? (u as any).userRoles.map((ur: unknown) => ({
            id: (ur as any).roles?.id,
            name: (ur as any).roles?.name,
            description: (ur as any).roles?.description,
            createdAt: (ur as any).roles?.createdAt.toISOString(),
            updatedAt: (ur as any).roles?.updatedAt.toISOString(),
            permissions: (ur as any).roles?.rolePermissions?.map((p: unknown) => ({
              id: (p as any).permissions?.id,
              action: (p as any).permissions?.action,
              description: (p as any).permissions?.description,
              createdAt: (p as any).permissions?.createdAt.toISOString(),
            })),
          }))
        : [],
    };
  }
}
