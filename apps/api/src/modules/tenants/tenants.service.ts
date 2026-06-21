import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { QueryTenantDto } from "./dto/query-tenant.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  /**
   * Create a new tenant with automatic FREE subscription provisioning
   */
  async create(dto: CreateTenantDto) {

                try {
                  // Validate domain uniqueness if provided
      if (dto.domain) {
        const existing = await this.prisma.tenant!.findFirst({
          where: { domain: dto.domain, deletedAt: null },
        });
        if (existing) {
          throw new ConflictException(`Domain "${dto.domain}" is already registered`);
        }
      }

      const tenant = await this.prisma.$transaction(async (tx) => {
        // Create tenant
        const created = await tx.tenant!.create({
          data: {
            name: dto.name,
            domain: dto.domain,
            status: "ACTIVE",
          },
        });

        // Auto-provision FREE subscription
        const periodEnd = new Date();
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);

        await tx.tenantSubscription.create({
          data: {
            tenantId: created.id,
            planName: "FREE",
            status: "ACTIVE",
            billingCycle: "MONTHLY",
            maxShops: 1,
            maxProducts: 100,
            maxUsers: 5,
            currentPeriodEnd: periodEnd,
          },
        });

        this.logger.log(`Tenant created: ${created.id} (${created.name})`);
        return created;
      });

      return this.findOne(tenant!.id);
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'TenantsService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Paginated, searchable, filterable tenant listing
   */
  async findAll(query: QueryTenantDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;
    const skip = (page - 1) * limit;

    const where: unknown = {
      deletedAt: null,
    };

    if (status) {
      (where as any).status = status;
    }

    if (search) {
      (where as any).OR = [{ name: { contains: search } }, { domain: { contains: search } }];
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.tenant!.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              shops: true,
              products: true,
              orders: true,
            },
          },
          tenantSubscriptions: {
            select: {
              planName: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.tenant!.count({ where: where as any }),
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
   * Get single tenant with full details
   */
  async findOne(id: string) {
    const tenant = await this.prisma.tenant!.findFirst({
      where: { id, deletedAt: null },
      include: {
        shops: {
          where: { deletedAt: null },
          include: {
            _count: { select: { marketplaceListings: true } },
          },
        },
        _count: {
          select: {
            shops: true,
            products: true,
            customers: true,
            orders: true,
            warehouses: true,
          },
        },
      },
    });
    if (!tenant) throw new NotFoundException("Tenant not found");
    return tenant;
  }

  /**
   * Update tenant properties with status transition validation
   */
  async update(id: string, dto: UpdateTenantDto) {

                try {
                  const tenant = await this.prisma.tenant!.findFirst({
        where: { id, deletedAt: null },
      });
      if (!tenant) throw new NotFoundException("Tenant not found");

      // Validate domain uniqueness if changing
      if (dto.domain && dto.domain !== tenant!.domain) {
        const existing = await this.prisma.tenant!.findFirst({
          where: { domain: dto.domain, deletedAt: null, id: { not: id } },
        });
        if (existing) {
          throw new ConflictException(`Domain "${dto.domain}" is already registered`);
        }
      }

      const updated = await this.prisma.tenant!.update({
        where: { id },
        data: dto,
      });

      this.logger.log(`Tenant updated: ${id} â€” ${JSON.stringify(dto)}`);
      return this.findOne(updated.id);
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'TenantsService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Soft delete tenant
   */
  async softDelete(id: string) {

                try {
                  const tenant = await this.prisma.tenant!.findFirst({
        where: { id, deletedAt: null },
      });
      if (!tenant) throw new NotFoundException("Tenant not found");

      await this.prisma.tenant!.update({
        where: { id },
        data: { deletedAt: new Date(), status: "SUSPENDED" },
      });

      this.logger.warn(`Tenant soft-deleted: ${id} (${tenant!.name})`);
      return { message: "Tenant successfully deactivated" };
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'TenantsService', 
                         action: 'softDelete',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Tenant-level analytics dashboard data
   */
  async getAnalytics(tenantId: string) {
    const tenant = await this.prisma.tenant!.findFirst({
      where: { id: tenantId, deletedAt: null },
    });
    if (!tenant) throw new NotFoundException("Tenant not found");

    const [totalShops, activeShops, totalProducts, totalOrders, totalListings, totalStaff] =
      await Promise.all([
        this.prisma.shop.count({ where: { tenantId, deletedAt: null } }),
        this.prisma.shop.count({
          where: { tenantId, deletedAt: null, operationalStatus: "ACTIVE" },
        }),
        this.prisma.product.count({ where: { tenantId, deletedAt: null } }),
        this.prisma.order!.count({ where: { tenantId, deletedAt: null } }),
        this.prisma.marketplaceListing.count({
          where: { shops: { tenantId }, deletedAt: null },
        }),
        this.prisma.shopUser.count({
          where: { shops: { tenantId }, deletedAt: null },
        }),
      ]);

    // Revenue sum from orders
    const revenueResult = await this.prisma.order!.aggregate({
      where: { tenantId, deletedAt: null },
      _sum: { grandTotal: true },
    });

    return {
      totalShops,
      activeShops,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult._sum.grandTotal || 0,
      totalListings,
      totalStaff,
    };
  }

  /**
   * Platform-wide analytics for super admin dashboard
   */
  async getPlatformAnalytics() {
    const [
      totalTenants,
      activeTenants,
      totalShops,
      activeShops,
      totalListings,
      activeSubscriptions,
    ] = await Promise.all([
      this.prisma.tenant!.count({ where: { deletedAt: null } }),
      this.prisma.tenant!.count({ where: { deletedAt: null, status: "ACTIVE" } }),
      this.prisma.shop.count({ where: { deletedAt: null } }),
      this.prisma.shop.count({ where: { deletedAt: null, operationalStatus: "ACTIVE" } }),
      this.prisma.marketplaceListing.count({ where: { deletedAt: null, isActive: true } }),
      this.prisma.tenantSubscription.count({ where: { status: "ACTIVE" } }),
    ]);

    // Regional activity â€” shops by state
    const shopsByState = await this.prisma.shopAddress.groupBy({
      by: ["state"],
      _count: { state: true },
      orderBy: { _count: { state: "desc" } },
      take: 10,
    });

    return {
      totalTenants,
      activeTenants,
      totalShops,
      activeShops,
      totalListings,
      activeSubscriptions,
      regionalActivity: shopsByState.map((s) => ({
        state: s.state,
        shopCount: s._count.state,
      })),
    };
  }
}
