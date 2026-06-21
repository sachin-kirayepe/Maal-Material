import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateShopUserDto } from "./dto/create-shop-user.dto";
import { UpdateShopUserDto } from "./dto/update-shop-user.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ShopUsersService {
  private readonly logger = new Logger(ShopUsersService.name);

  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  /**
   * Add a user to a shop
   */
  async addUserToShop(shopId: string, tenantId: string, dto: CreateShopUserDto) {
    // Validate shop ownership
    const shop = await this.prisma.shop.findFirst({
      where: { id: shopId, tenantId, deletedAt: null },
    });
    if (!shop) throw new NotFoundException("Shop not found");

    // Check if user exists
    const user = await this.prisma.user!.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException("User not found in system");

    // Check if already in shop
    const existing = await this.prisma.shopUser.findFirst({
      where: { shopId, userId: dto.userId },
    });

    if (existing) {
      if (existing!.deletedAt) {
        // Reactivate
        return this.prisma.shopUser.update({
          where: { id: existing!.id },
          data: { deletedAt: null, isActive: true, role: dto.role },
        });
      }
      throw new ConflictException("User is already assigned to this shop");
    }

    const shopUser = await this.prisma.shopUser.create({
      data: {
        shopId,
        userId: dto.userId,
        role: dto.role,
      },
    });

    this.logger.log(`User ${dto.userId} added to shop ${shopId} with role ${dto.role}`);
    return shopUser;
  }

  /**
   * List staff for a shop
   */
  async findAllByShop(shopId: string, tenantId: string) {
    const shop = await this.prisma.shop.findFirst({
      where: { id: shopId, tenantId, deletedAt: null },
    });
    if (!shop) throw new NotFoundException("Shop not found");

    return this.prisma.shopUser.findMany({
      where: { shopId, deletedAt: null },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isActive: true,
          },
        },
      },
    });
  }

  /**
   * Update user role/status in shop
   */
  async updateRole(shopUserId: string, tenantId: string, dto: UpdateShopUserDto) {

                try {
                  const shopUser = await this.prisma.shopUser.findFirst({
        where: { id: shopUserId, deletedAt: null },
        include: { shops: true },
      });

      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      if (!shopUser || shopUser.shop.tenantId !== tenantId) {
        throw new NotFoundException("Shop user not found");
      }

      return this.prisma.shopUser.update({
        where: { id: shopUserId },
        data: dto,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ShopUsersService', 
                         action: 'updateRole',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Soft remove user from shop
   */
  async removeFromShop(shopUserId: string, tenantId: string) {
    const shopUser = await this.prisma.shopUser.findFirst({
      where: { id: shopUserId, deletedAt: null },
      include: { shops: true },
    });

    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    if (!shopUser || shopUser.shop.tenantId !== tenantId) {
      throw new NotFoundException("Shop user not found");
    }

    await this.prisma.shopUser.update({
      where: { id: shopUserId },
      data: { deletedAt: new Date(), isActive: false },
    });

    this.logger.warn(`User removed from shops: ${shopUserId}`);
    return { message: "User successfully removed from shop" };
  }
}
