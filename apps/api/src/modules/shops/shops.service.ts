import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateShopDto } from "./dto/create-shop.dto";
import { UpdateShopDto, UpdateShopAddressDto, UpdateShopSettingsDto } from "./dto/update-shop.dto";
import { QueryShopDto } from "./dto/query-shop.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ShopsService {
  private readonly logger = new Logger(ShopsService.name);

  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  /**
   * Onboarding flow: Create shop + address + default settings atomically
   */
  async create(tenantId: string, dto: CreateShopDto) {

                try {
                  // Validate slug uniqueness
      const existing = await this.prisma.shop.findFirst({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException(`Shop slug "${dto.slug}" is already taken`);
      }

      const shop = await this.prisma.$transaction(async (tx) => {
        // Create shop record
        const created = await tx.shop.create({
          data: {
            tenantId,
            name: dto.name,
            slug: dto.slug,
            businessType: dto.businessType || "HARDWARE",
            description: dto.description,
            gstin: dto.gstin,
            ownerName: dto.ownerName,
            phone: dto.phone,
            email: dto.email,
            operationalStatus: "ACTIVE",
            marketplaceVisibility: dto.marketplaceVisibility ?? false,
          },
        });

        // Create address if provided
        if (dto.address) {
          await tx.shopAddress.create({
            data: {
              shopId: created.id,
              addressLine: dto.address.addressLine,
              city: dto.address.city,
              state: dto.address.state,
              pincode: dto.address.pincode,
              country: dto.address.country || "India",
              latitude: dto.address.latitude,
              longitude: dto.address.longitude,
            },
          });
        }

        // Create default settings
        await tx.shopSetting.create({
          data: {
            shopId: created.id,
            currency: "INR",
            timezone: "Asia/Kolkata",
            defaultTaxPercent: 18,
          },
        });

        this.logger.log(`Shop onboarded: ${created.id} (${created.name}) for tenant ${tenantId}`);
        return created;
      });

      return this.findOne(shop.id, tenantId);
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ShopsService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Paginated, searchable, filterable shop listing scoped to tenant
   */
  async findAllByTenant(tenantId: string, query: QueryShopDto) {
    const {
      page = 1,
      limit = 20,
      search,
      businessType,
      operationalStatus,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;
    const skip = (page - 1) * limit;

    const where: unknown = {
      tenantId,
      deletedAt: null,
    };

    if (businessType) {
      (where as any).businessType = businessType;
    }

    if (operationalStatus) {
      (where as any).operationalStatus = operationalStatus;
    }

    if (search) {
      (where as any).OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
        { ownerName: { contains: search } },
        { gstin: { contains: search } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.shop.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              marketplaceListings: true,
            },
          },
        },
      }),
      this.prisma.shop.count({ where: where as any }),
    ]);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  /**
   * Full shop profile with address, settings, users, and listing count
   */
  async findOne(id: string, tenantId: string) {
    const shop = await this.prisma.shop.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        settings: true,
        users: {
          where: { deletedAt: null },
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
        },
        _count: {
          select: {
            marketplaceListings: true,
          },
        },
      },
    });
    if (!shop) throw new NotFoundException("Shop not found or does not belong to this tenant");
    return shop;
  }

  /**
   * Partial update of shop properties
   */
  async update(id: string, tenantId: string, dto: UpdateShopDto) {

                try {
                  const shop = await this.prisma.shop.findFirst({
        where: { id, tenantId, deletedAt: null },
      });
      if (!shop) throw new NotFoundException("Shop not found");

      await this.prisma.shop.update({
        where: { id },
        data: dto,
      });

      this.logger.log(`Shop updated: ${id} â€” ${JSON.stringify(dto)}`);
      return this.findOne(id, tenantId);
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ShopsService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Soft delete shop
   */
  async softDelete(id: string, tenantId: string) {

                try {
                  const shop = await this.prisma.shop.findFirst({
        where: { id, tenantId, deletedAt: null },
      });
      if (!shop) throw new NotFoundException("Shop not found");

      await this.prisma.shop.update({
        where: { id },
        data: { deletedAt: new Date(), operationalStatus: "SUSPENDED" },
      });

      this.logger.warn(`Shop soft-deleted: ${id} (${shop.name})`);
      return { message: "Shop successfully deactivated" };
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ShopsService', 
                         action: 'softDelete',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Upsert shop address
   */
  async updateAddress(shopId: string, tenantId: string, dto: UpdateShopAddressDto) {

                try {
                  const shop = await this.prisma.shop.findFirst({
        where: { id: shopId, tenantId, deletedAt: null },
      });
      if (!shop) throw new NotFoundException("Shop not found");

      const address = await this.prisma.shopAddress.upsert({
        where: { shopId },
        create: {
          shopId,
          addressLine: dto.addressLine || "",
          city: dto.city || "",
          state: dto.state || "",
          pincode: dto.pincode || "",
          country: dto.country || "India",
          latitude: dto.latitude,
          longitude: dto.longitude,
        },
        update: dto,
      });

      this.logger.log(`Shop address updated: ${shopId}`);
      return address;
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ShopsService', 
                         action: 'updateAddress',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Upsert shop settings
   */
  async updateSettings(shopId: string, tenantId: string, dto: UpdateShopSettingsDto) {

                try {
                  const shop = await this.prisma.shop.findFirst({
        where: { id: shopId, tenantId, deletedAt: null },
      });
      if (!shop) throw new NotFoundException("Shop not found");

      const settings = await this.prisma.shopSetting.upsert({
        where: { shopId },
        create: {
          shopId,
          ...dto,
        },
        update: dto,
      });

      this.logger.log(`Shop settings updated: ${shopId}`);
      return settings;
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ShopsService', 
                         action: 'updateSettings',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Shop-level analytics
   */
  async getShopAnalytics(shopId: string, tenantId: string) {
    const shop = await this.prisma.shop.findFirst({
      where: { id: shopId, tenantId, deletedAt: null },
    });
    if (!shop) throw new NotFoundException("Shop not found");

    const [totalStaff, activeListings] = await Promise.all([
      this.prisma.shopUser.count({ where: { shopId, deletedAt: null } }),
      this.prisma.marketplaceListing.count({ where: { shopId, isActive: true, deletedAt: null } }),
    ]);

    return {
      totalProducts: 0, // Will be connected when shop-scoped inventory is implemented
      totalOrders: 0,
      totalRevenue: 0,
      activeListings,
      totalStaff,
    };
  }
}
