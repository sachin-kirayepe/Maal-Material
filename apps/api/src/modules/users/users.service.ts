import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateUserDto, UpdateUserDto } from "./dto/users.dto";
import * as bcrypt from "bcryptjs";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async create(dto: CreateUserDto) {

                try {
                  const existing = await this.prisma.user!.findUnique({
        where: { email: dto.email },
      });

      if (existing) {
        throw new ConflictException(`User with email '${dto.email}' already exists`);
      }

      // Encrypt password securely
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(dto.password, salt);

      const user = await this.prisma.user!.create({
        data: {
          email: dto.email,
          password: passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      // If roles are provided, assign them
      if (dto.roleNames && dto.roleNames.length > 0) {
        for (const roleName of dto.roleNames) {
          await this.assignRole(user!.id, roleName);
        }
      }

      return this.findOneById(user!.id);
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'UsersService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAll() {
    return this.prisma.user!.findMany({
      where: { deletedAt: null },
      include: {
        userRoles: {
          include: {
            roles: {
              include: {
                rolePermissions: {
                  include: {
                    permissions: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOneById(id: string) {
    const user = await this.prisma.user!.findFirst({
      where: { id, deletedAt: null },
      include: {
        shopUsers: {
          include: {
            shops: true,
          },
        },
        userRoles: {
          include: {
            roles: {
              include: {
                rolePermissions: {
                  include: {
                    permissions: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    return this.prisma.user!.findFirst({
      where: { email, deletedAt: null },
      include: {
        shopUsers: {
          include: {
            shops: true,
          },
        },
        userRoles: {
          include: {
            roles: {
              include: {
                rolePermissions: {
                  include: {
                    permissions: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {

                try {
                  await this.findOneById(id);

      const updateData: unknown = {};
      if (dto.email) {
        const emailCheck = await this.prisma.user!.findFirst({
          where: { email: dto.email, id: { not: id } },
        });
        if (emailCheck) {
          throw new ConflictException(`Email '${dto.email}' is already in use by another account`);
        }
        (updateData as any).email = dto.email;
      }

      if (dto.password) {
        const salt = await bcrypt.genSalt(10);
        (updateData as any).password = await bcrypt.hash(dto.password, salt);
      }

      if (dto.firstName !== undefined) (updateData as any).firstName = dto.firstName;
      if (dto.lastName !== undefined) (updateData as any).lastName = dto.lastName;
      if (dto.isActive !== undefined) (updateData as any).isActive = dto.isActive;

      await this.prisma.user!.update({
        where: { id },
        data: updateData as any,
      });

      if (dto.roleNames) {
        // Re-evaluate user roles completely
        await this.prisma.userRole.deleteMany({
          where: { userId: id },
        });
        for (const roleName of dto.roleNames) {
          await this.assignRole(id, roleName);
        }
      }

      return this.findOneById(id);
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'UsersService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async remove(id: string) {
    await this.findOneById(id);

    // Perform a clean logical soft delete to preserve historical integrity
    await this.prisma.user!.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    return { success: true, message: `User account '${id}' logically removed` };
  }

  async assignRole(userId: string, roleName: string) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException(`Role with name '${roleName}' does not exist`);
    }

    return this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id,
        },
      },
      create: {
        userId,
        roleId: role.id,
      },
      update: {},
      include: {
        roles: true,
      },
    });
  }

  async removeRole(userId: string, roleName: string) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException(`Role with name '${roleName}' not found`);
    }

    try {
      await this.prisma.userRole.delete({
        where: {
          userId_roleId: {
            userId,
            roleId: role.id,
          },
        },
      });
      return { success: true, message: `Role '${roleName}' removed from user` };
    } catch {
      throw new BadRequestException(`Role assignment does not exist for this user`);
    }
  }
}
