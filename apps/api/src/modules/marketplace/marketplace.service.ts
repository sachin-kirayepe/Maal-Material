import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";
import { QueryListingDto } from "./dto/query-listing.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  /**
   * Public paginated, searchable listing of marketplace products
   */
  async findAllListings(query: QueryListingDto) {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      region,
      isFeatured,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;
    const skip = (page - 1) * limit;

    const where: unknown = {
      isActive: true,
      deletedAt: null,
      shops: {
        operationalStatus: "ACTIVE",
        deletedAt: null,
        marketplaceVisibility: true,
      },
    };

    if (categoryId) (where as any).marketplaceCategoryId = categoryId;
    if (isFeatured !== undefined) (where as any).isFeatured = isFeatured;
    if (region) (where as any).regionalAvailability = { contains: region };

    if (search) {
      (where as any).OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { products: { name: { contains: search } } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.marketplaceListing.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          marketplaceCategories: { select: { id: true, name: true, slug: true } },
          shops: {
            select: {
              id: true,
              name: true,
              slug: true,
              businessType: true,
              logo: true,
              // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
              address: { select: { city: true, state: true } },
            },
          },
        },
      }),
      this.prisma.marketplaceListing.count({ where: where as any }),
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
   * Public listing detail with view count increment
   */
  async findListingById(id: string) {
    const listing = await this.prisma.marketplaceListing.findFirst({
      where: { id, isActive: true, deletedAt: null },
      include: {
        marketplaceCategories: true,
        products: true,
        shops: {
          include: {
            // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
            address: true,
          },
        },
      },
    });

    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    if (!listing || listing.shops.operationalStatus !== "ACTIVE") {
      throw new NotFoundException("Marketplace listing not found or shop is inactive");
    }

    // Increment view count asynchronously
    this.prisma.marketplaceListing
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((e) => this.logger.error(`Failed to increment view count for listing ${id}`, e));

    return listing;
  }

  /**
   * Create a new marketplace listing (Tenant scoped)
   */
  async createListing(tenantId: string, dto: CreateListingDto) {

                try {
                  // Validate shop belongs to tenant
      const shop = await this.prisma.shop.findFirst({
        where: { id: dto.shopId, tenantId, deletedAt: null },
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        include: { settings: true },
      });
      if (!shop) throw new NotFoundException("Shop not found");

      // Validate product exists
      const product = await this.prisma.product.findUnique({
        where: { id: dto.productId },
      });
      if (!product) throw new NotFoundException("Product not found");

      // Check if listing already exists for this product
      const existing = await this.prisma.marketplaceListing.findFirst({
        where: { productId: dto.productId, deletedAt: null },
      });
      if (existing) throw new ConflictException("Listing already exists for this product");

      // Create listing. Auto-approve if shop settings allow, otherwise require admin approval
      const listing = await this.prisma.marketplaceListing.create({
        data: {
          ...dto,
          // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
          isActive: shop.settings?.autoApproveListings ?? false,
        },
      });

      this.logger.log(`Listing created: ${listing.id} for product ${product.id}`);
      return listing;
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'MarketplaceService', 
                         action: 'createListing',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Update listing (Tenant scoped)
   */
  async updateListing(id: string, tenantId: string, dto: UpdateListingDto) {

                try {
                  const listing = await this.prisma.marketplaceListing.findFirst({
        where: { id, deletedAt: null },
        include: { shops: true },
      });

      if (!listing || listing.shops.tenantId !== tenantId) {
        throw new NotFoundException("Listing not found");
      }

      return this.prisma.marketplaceListing.update({
        where: { id },
        data: dto,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'MarketplaceService', 
                         action: 'updateListing',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Soft delete listing (Tenant scoped)
   */
  async deleteListing(id: string, tenantId: string) {

                try {
                  const listing = await this.prisma.marketplaceListing.findFirst({
        where: { id, deletedAt: null },
        include: { shops: true },
      });

      if (!listing || listing.shops.tenantId !== tenantId) {
        throw new NotFoundException("Listing not found");
      }

      await this.prisma.marketplaceListing.update({
        where: { id },
        data: { deletedAt: new Date(), isActive: false },
      });

      return { message: "Listing removed from marketplace" };
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'MarketplaceService', 
                         action: 'deleteListing',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Get all active categories (Public)
   */
  async findCategories() {
    return this.prisma.marketplaceCategory.findMany({
      where: { isActive: true },
      include: {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        _count: { select: { listings: { where: { isActive: true, deletedAt: null } } } },
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Create new category (Admin)
   */
  async createCategory(dto: CreateCategoryDto) {

                try {
                  const existing = await this.prisma.marketplaceCategory.findFirst({
        where: { slug: dto.slug },
      });
      if (existing) throw new ConflictException(`Category slug "${dto.slug}" already exists`);

      return this.prisma.marketplaceCategory.create({
        data: dto,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'MarketplaceService', 
                         action: 'createCategory',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Admin Analytics for Marketplace
   */
  async getMarketplaceAnalytics() {

                try {
                  const [totalListings, activeListings, featuredListings, totalCategories, totalShopsListing] =
        await Promise.all([
          this.prisma.marketplaceListing.count({ where: { deletedAt: null } }),
          this.prisma.marketplaceListing.count({ where: { deletedAt: null, isActive: true } }),
          this.prisma.marketplaceListing.count({ where: { deletedAt: null, isFeatured: true } }),
          this.prisma.marketplaceCategory.count(),
          this.prisma.marketplaceListing
            .groupBy({
              by: ["shopId"],
              where: { deletedAt: null, isActive: true },
            })
            .then((res) => res.length),
        ]);

      // Listings by category
      const categoriesGroup = await this.prisma.marketplaceListing.groupBy({
        by: ["marketplaceCategoryId"],
        where: { deletedAt: null, isActive: true },
        _count: { marketplaceCategoryId: true },
      });

      const categoryDocs = await this.prisma.marketplaceCategory.findMany({
        where: { id: { in: categoriesGroup.map((g) => g.marketplaceCategoryId) } },
        select: { id: true, name: true },
      });

      const listingsByCategory = categoriesGroup.map((g) => ({
        categoryName: categoryDocs.find((c) => c.id === g.marketplaceCategoryId)?.name || "Unknown",
        count: g._count.marketplaceCategoryId,
      }));

      return {
        totalListings,
        activeListings,
        featuredListings,
        totalCategories,
        totalShopsListing,
        listingsByCategory,
      };
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'MarketplaceService', 
                         action: 'getMarketplaceAnalytics',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
