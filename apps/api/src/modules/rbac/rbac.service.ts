import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateRoleDto, CreatePermissionDto } from "./dto/rbac.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async createRole(dto: CreateRoleDto) {

                try {
                  const existing = await this.prisma.role.findUnique({
        where: { name: dto.name },
      });

      if (existing) {
        throw new ConflictException(`Role with name '${dto.name}' already exists`);
      }

      return this.prisma.role.create({
        data: {
          name: dto.name,
          description: dto.description,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'RbacService', 
                         action: 'createRole',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async createPermission(dto: CreatePermissionDto) {

                try {
                  const existing = await this.prisma.permission.findUnique({
        where: { action: dto.action },
      });

      if (existing) {
        throw new ConflictException(`Permission with action '${dto.action}' already exists`);
      }

      return this.prisma.permission.create({
        data: {
          action: dto.action,
          description: dto.description,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'RbacService', 
                         action: 'createPermission',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async assignPermissionToRole(roleName: string, permissionAction: string) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new NotFoundException(`Role with name '${roleName}' not found`);
    }

    const permission = await this.prisma.permission.findUnique({
      where: { action: permissionAction },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with action '${permissionAction}' not found`);
    }

    // Upsert the junction relationship
    return this.prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: role.id,
          permissionId: permission.id,
        },
      },
      create: {
        roleId: role.id,
        permissionId: permission.id,
      },
      update: {},
      include: {
        roles: true,
        permissions: true,
      },
    });
  }

  async removePermissionFromRole(roleName: string, permissionAction: string) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new NotFoundException(`Role with name '${roleName}' not found`);
    }

    const permission = await this.prisma.permission.findUnique({
      where: { action: permissionAction },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with action '${permissionAction}' not found`);
    }

    try {
      await this.prisma.rolePermission.delete({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
      });
      return {
        success: true,
        message: `Permission '${permissionAction}' unassigned from role '${roleName}'`,
      };
    } catch {
      throw new NotFoundException(`Permission assignment not found for role '${roleName}'`);
    }
  }

  async findAllRoles() {
    return this.prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany();
  }

  async findRoleByName(name: string) {
    const role = await this.prisma.role.findUnique({
      where: { name },
      include: {
        rolePermissions: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with name '${name}' not found`);
    }

    return role;
  }
}
