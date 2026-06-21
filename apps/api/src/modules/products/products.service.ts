import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateProductDto, UpdateProductDto } from "./dto/products.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  private generateSku(name: string): string {
    const prefix = name
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, "X");
    const timestamp = Date.now().toString(36).toUpperCase().slice(-5);
    return `SKU-${prefix}-${timestamp}`;
  }

  private readonly productIncludes = {
    categories: true,
    subCategories: true,
    units: true,
    warehouseStocks: { include: { warehouses: true } },
    _count: { select: { productVariants: true, stockMovements: true } },
  };

  async create(dto: CreateProductDto) {

                try {
                  const slug = this.slugify(dto.name);
      const sku = dto.sku || this.generateSku(dto.name);

      const skuCheck = await this.prisma.product.findUnique({ where: { sku } });
      if (skuCheck) throw new ConflictException(`SKU '${sku}' already exists`);

      const slugCheck = await this.prisma.product.findUnique({ where: { slug } });
      const finalSlug = slugCheck ? `${slug}-${Date.now().toString(36)}` : slug;

      return this.prisma.product.create({
        data: {
          name: dto.name,
          slug: finalSlug,
          sku,
          barcode: dto.barcode,
          description: dto.description,
          shortDescription: dto.shortDescription,
          image: dto.image,
          categoryId: dto.categoryId,
          subCategoryId: dto.subCategoryId,
          unitId: dto.unitId,
          purchasePrice: dto.purchasePrice,
          sellingPrice: dto.sellingPrice,
          mrp: dto.mrp || dto.sellingPrice,
          taxPercent: dto.taxPercent || 0,
          taxCategory: dto.taxCategory,
          minimumStock: dto.minimumStock || 0,
          reorderLevel: dto.reorderLevel || 0,
          reorderQuantity: dto.reorderQuantity || 0,
          isActive: dto.isActive ?? true,
          isFeatured: dto.isFeatured ?? false,
          trackInventory: dto.trackInventory ?? true,
          weight: dto.weight,
          dimensions: dto.dimensions,
          brand: dto.brand,
          manufacturer: dto.manufacturer,
          hsn: dto.hsn,
        },
        include: this.productIncludes,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ProductsService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAll(query: any = {}) {
    const {
      search,
      categoryId,
      subCategoryId,
      brand,
      isActive,
      lowStock,
      sortBy,
      sortOrder,
      page,
      limit,
    } = query;
    const take = Math.min(Number(limit) || 20, 100);
    const skip = ((Number(page) || 1) - 1) * take;

    const where: unknown = { deletedAt: null };
    if (search) {
      (where as any).OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { barcode: { contains: search } },
        { brand: { contains: search } },
      ];
    }
    if (categoryId) (where as any).categoryId = categoryId;
    if (subCategoryId) (where as any).subCategoryId = subCategoryId;
    if (brand) (where as any).brand = brand;
    if (isActive !== undefined) (where as any).isActive = isActive === "true" || isActive === true;

    const orderBy: unknown = {};
    (orderBy as any)[sortBy || "createdAt"] = sortOrder || "desc";

    const [items, totalItems] = await Promise.all([
      this.prisma.product.findMany({
        where: where as any,
        include: this.productIncludes,
        orderBy: orderBy as any,
        skip,
        take,
      }),
      this.prisma.product.count({ where: where as any }),
    ]);

    // Compute total stock per product from warehouse stocks
    const enrichedItems = items.map((p: unknown) => {
      const totalStock =
        (p as any).warehouseStocks?.reduce(
          (sum: number, ws: unknown) => sum + (ws as any).quantity,
          0,
        ) || 0;
      return { ...(p as any), totalStock };
    });

    // Filter low stock after computing total
    let finalItems = enrichedItems;
    if (lowStock === "true" || lowStock === true) {
      finalItems = enrichedItems.filter(
        (p: unknown) =>
          (p as any).totalStock <= (p as any).reorderLevel && (p as any).trackInventory,
      );
    }

    return {
      items: finalItems,
      meta: {
        totalItems,
        itemCount: finalItems.length,
        itemsPerPage: take,
        totalPages: Math.ceil(totalItems / take),
        currentPage: Number(page) || 1,
      },
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: this.productIncludes,
    });
    if (!product) throw new NotFoundException(`Product '${id}' not found`);
    const totalStock =
      (product as any).warehouseStocks?.reduce(
        (sum: number, ws: unknown) => sum + (ws as any).quantity,
        0,
      ) || 0;
    return { ...product, totalStock };
  }

  async findBySku(sku: string) {
    const product = await this.prisma.product.findFirst({
      where: { sku, deletedAt: null },
      include: this.productIncludes,
    });
    if (!product) throw new NotFoundException(`Product with SKU '${sku}' not found`);
    return product;
  }

  async findByBarcode(barcode: string) {
    const product = await this.prisma.product.findFirst({
      where: { barcode, deletedAt: null },
      include: this.productIncludes,
    });
    if (!product) throw new NotFoundException(`Product with barcode '${barcode}' not found`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {

                try {
                  await this.findById(id);
      const data: unknown = { ...dto };
      if (dto.name) (data as any).slug = this.slugify(dto.name);
      return this.prisma.product.update({
        where: { id },
        data: data as any,
        include: this.productIncludes,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ProductsService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, message: `Product '${id}' removed` };
  }

  async getDashboardStats() {
    const [totalProducts, activeProducts, totalWarehouses] = await Promise.all([
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.product.count({ where: { deletedAt: null, isActive: true } }),
      this.prisma.warehouse.count({ where: { deletedAt: null, isActive: true } }),
    ]);

    const allProducts = await this.prisma.product.findMany({
      where: { deletedAt: null, trackInventory: true },
      include: { warehouseStocks: true },
    });

    let totalInventoryValue = 0;
    let totalStockQuantity = 0;
    let lowStockItems = 0;
    let outOfStockItems = 0;

    for (const p of allProducts) {
      const totalQty =
        (p as any).warehouseStocks?.reduce(
          (sum: number, ws: unknown) => sum + (ws as any).quantity,
          0,
        ) || 0;
      totalStockQuantity += totalQty;
      totalInventoryValue += totalQty * p.sellingPrice;
      if (totalQty <= p.reorderLevel && totalQty > 0) lowStockItems++;
      if (totalQty === 0) outOfStockItems++;
    }

    const recentMovements = await this.prisma.stockMovement.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        products: true,
        warehousesStockMovementsFromWarehouseIdTowarehouses: true,
        warehousesStockMovementsToWarehouseIdTowarehouses: true,
      },
    });

    return {
      totalProducts,
      activeProducts,
      lowStockItems,
      outOfStockItems,
      totalWarehouses,
      totalInventoryValue,
      totalStockQuantity,
      recentMovements,
    };
  }
}
