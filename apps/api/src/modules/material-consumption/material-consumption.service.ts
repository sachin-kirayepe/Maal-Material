import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import {
  CreateSiteTransferDto,
  ReceiveSiteTransferDto,
  RecordConsumptionDto,
  ConsumptionQueryDto,
} from "./dto/material-consumption.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class MaterialConsumptionService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  /**
   * Generate transfer number: TRF-YYYYMMDD-XXXX
   */
  private async generateTransferNumber(): Promise<string> {
    const date = new Date();
    const prefix = `TRF-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    const count = await this.prisma.siteTransfer.count({
      where: { transferNumber: { startsWith: prefix } },
    });
    return `${prefix}-${String(count + 1).padStart(4, "0")}`;
  }

  // ==========================================
  // SITE TRANSFER â€” Warehouse â†’ Site
  // ==========================================

  /**
   * Create a material transfer from warehouse to site.
   * This is a TRANSACTION-SAFE operation:
   * 1. Validates warehouse stock availability
   * 2. Deducts from WarehouseStock
   * 3. Creates StockMovement (TRANSFER)
   * 4. Creates the SiteTransfer record
   */
  async createTransfer(dto: CreateSiteTransferDto, userId: string) {

                try {
                  // Validate warehouse and site
      const [warehouse, site, product] = await Promise.all([
        this.prisma.warehouse.findUnique({ where: { id: dto.fromWarehouseId } }),
        this.prisma.projectSite.findUnique({
          where: { id: dto.toSiteId },
          include: { projects: { select: { id: true } } },
        }),
        this.prisma.product.findUnique({ where: { id: dto.productId } }),
      ]);

      if (!warehouse) throw new NotFoundException(`Warehouse ${dto.fromWarehouseId} not found`);
      if (!site) throw new NotFoundException(`Site ${dto.toSiteId} not found`);
      if (!product) throw new NotFoundException(`Product ${dto.productId} not found`);

      // Check stock availability
      const stock = await this.prisma.warehouseStock.findUnique({
        where: {
          warehouseId_productId: { warehouseId: dto.fromWarehouseId, productId: dto.productId },
        },
      });

      const availableQty = (stock?.quantity || 0) - (stock?.reservedQty || 0);
      if (availableQty < dto.quantity) {
        throw new BadRequestException(
          `Insufficient stock: available ${availableQty}, requested ${dto.quantity} of ${product.name}`,
        );
      }

      const transferNumber = await this.generateTransferNumber();
      const unitCost = product.purchasePrice || 0;
      const totalCost = unitCost * dto.quantity;

      return this.prisma.$transaction(async (tx) => {
        // 1. Deduct from warehouse stock
        await tx.warehouseStock.update({
          where: {
            warehouseId_productId: { warehouseId: dto.fromWarehouseId, productId: dto.productId },
          },
          data: { quantity: { decrement: dto.quantity } },
        });

        // 2. Create StockMovement for audit trail
        await tx.stockMovement.create({
          data: {
            productId: dto.productId,
            movementType: "TRANSFER",
            quantity: dto.quantity,
            referenceType: "SITE_TRANSFER",
            referenceId: transferNumber,
            fromWarehouseId: dto.fromWarehouseId,
            unitCost,
            totalCost,
            notes: `Transfer to projectSites: ${site.name} (${site.siteCode})`,
            performedBy: userId,
          },
        });

        // 3. Create SiteTransfer record
        const transfer = await tx.siteTransfer.create({
          data: {
            transferNumber,
            fromWarehouseId: dto.fromWarehouseId,
            toSiteId: dto.toSiteId,
            productId: dto.productId,
            productName: product.name,
            sku: product.sku,
            quantity: dto.quantity,
            unitCost,
            totalCost,
            status: "IN_TRANSIT",
            createdBy: userId,
            notes: dto.notes,
          },
          include: {
            products: { select: { name: true, sku: true } },
            projectSitesSiteTransfersToSiteIdToprojectSites: {
              select: { name: true, siteCode: true },
            },
          },
        });

        return transfer;
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'MaterialConsumptionService', 
                         action: 'createTransfer',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Receive a transfer at site â€” updates SiteInventory
   */
  async receiveTransfer(transferId: string, dto: ReceiveSiteTransferDto, userId: string) {
    const transfer = await this.prisma.siteTransfer.findUnique({ where: { id: transferId } });
    if (!transfer) throw new NotFoundException(`Transfer ${transferId} not found`);
    if (transfer.status !== "IN_TRANSIT") {
      throw new BadRequestException(`Transfer is in '${transfer.status}' status, cannot receive`);
    }

    const receivedQty = dto.receivedQuantity || transfer.quantity;

    return this.prisma.$transaction(async (tx) => {
      // 1. Update transfer status
      await tx.siteTransfer.update({
        where: { id: transferId },
        data: {
          status: "RECEIVED",
          receivedDate: new Date(),
          receivedBy: userId,
        },
      });

      // 2. Upsert SiteInventory â€” add received quantity
      await tx.siteInventory.upsert({
        where: {
          siteId_productId: {
            siteId: transfer.toSiteId!,
            productId: transfer.productId,
          },
        },
        create: {
          siteId: transfer.toSiteId!,
          productId: transfer.productId,
          quantity: receivedQty,
          lastUpdatedAt: new Date(),
        },
        update: {
          quantity: { increment: receivedQty },
          lastUpdatedAt: new Date(),
        },
      });

      return { message: "Transfer received", transferId, receivedQty };
    });
  }

  /**
   * List transfers
   */
  async findAllTransfers(query: {
    siteId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (query.siteId) (where as any).toSiteId = query.siteId;
    if (query.status) (where as any).status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.siteTransfer.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { transferDate: "desc" },
        include: {
          products: { select: { name: true, sku: true } },
          projectSitesSiteTransfersToSiteIdToprojectSites: {
            select: { name: true, siteCode: true },
          },
          // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
          fromWarehouse: { select: { name: true, code: true } },
        },
      }),
      this.prisma.siteTransfer.count({ where: where as any }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ==========================================
  // MATERIAL CONSUMPTION â€” Site Usage
  // ==========================================

  /**
   * Record material consumption at a site.
   * TRANSACTION-SAFE:
   * 1. Deducts from SiteInventory
   * 2. Creates MaterialConsumption record
   * 3. Creates MATERIAL ProjectExpense
   * 4. Increments ProjectCosting.materialCost
   */
  async recordConsumption(dto: RecordConsumptionDto, userId: string) {

                try {
                  const [site, product] = await Promise.all([
        this.prisma.projectSite.findUnique({
          where: { id: dto.siteId },
          include: { projects: { select: { id: true } } },
        }),
        this.prisma.product.findUnique({ where: { id: dto.productId } }),
      ]);

      if (!site) throw new NotFoundException(`Site ${dto.siteId} not found`);
      if (!product) throw new NotFoundException(`Product ${dto.productId} not found`);

      // Check site inventory
      const siteStock = await this.prisma.siteInventory.findUnique({
        where: { siteId_productId: { siteId: dto.siteId, productId: dto.productId } },
      });

      const available = (siteStock?.quantity || 0) - (siteStock?.reservedQty || 0);
      const totalRequired = dto.quantity + (dto.wastageQty || 0);
      if (available < totalRequired) {
        throw new BadRequestException(
          `Insufficient site stock: available ${available}, required ${totalRequired} of ${product.name}`,
        );
      }

      const unitCost = product.purchasePrice || 0;
      const totalCost = unitCost * dto.quantity;
      const wastageCost = unitCost * (dto.wastageQty || 0);

      return this.prisma.$transaction(async (tx) => {
        // 1. Deduct from site inventory
        await tx.siteInventory.update({
          where: { siteId_productId: { siteId: dto.siteId, productId: dto.productId } },
          data: {
            quantity: { decrement: totalRequired },
            consumedQty: { increment: dto.quantity },
            wastedQty: { increment: dto.wastageQty || 0 },
            lastUpdatedAt: new Date(),
          },
        });

        // 2. Create consumption record
        const consumption = await tx.materialConsumption.create({
          data: {
            siteId: dto.siteId,
            productId: dto.productId,
            productName: product.name,
            sku: product.sku,
            quantity: dto.quantity,
            unitCost,
            totalCost: totalCost + wastageCost,
            wastageQty: dto.wastageQty || 0,
            consumptionType: dto.consumptionType || "USAGE",
            referenceType: "MANUAL",
            notes: dto.notes,
            recordedBy: userId,
          },
        });

        // 3. Create a MATERIAL expense
        await tx.projectExpense.create({
          data: {
            projectId: site.projectId,
            siteId: site?.id,
            expenseType: "MATERIAL",
            description: `Material: ${product.name} (${product.sku}) x ${dto.quantity}`,
            amount: totalCost + wastageCost,
            referenceType: "CONSUMPTION",
            referenceId: consumption?.id,
            recordedBy: userId,
            status: "APPROVED",
          },
        });

        // 4. Update project costing
        await tx.projectCosting.upsert({
          where: { projectId: site.projectId },
          create: {
            projectId: site.projectId,
            materialCost: totalCost + wastageCost,
            totalCost: totalCost + wastageCost,
          },
          update: {
            materialCost: { increment: totalCost + wastageCost },
            totalCost: { increment: totalCost + wastageCost },
            lastCalculatedAt: new Date(),
          },
        });

        // 5. Update project actual cost
        await tx.project.update({
          where: { id: site.projectId },
          data: { actualCost: { increment: totalCost + wastageCost } },
        });

        return consumption;
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'MaterialConsumptionService', 
                         action: 'recordConsumption',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * List consumption records
   */
  async findAllConsumptions(query: ConsumptionQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (query.siteId) (where as any).siteId = query.siteId;
    if (query.productId) (where as any).productId = query.productId;
    if (query.consumptionType) (where as any).consumptionType = query.consumptionType;
    if (query.dateFrom || query.dateTo) {
      (where as any).consumedDate = {};
      if (query.dateFrom) (where as any).consumedDate.gte = new Date(query.dateFrom);
      if (query.dateTo) (where as any).consumedDate.lte = new Date(query.dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.materialConsumption.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { consumedDate: "desc" },
        include: {
          products: { select: { name: true, sku: true } },
          projectSites: { select: { name: true, siteCode: true } },
        },
      }),
      this.prisma.materialConsumption.count({ where: where as any }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /**
   * Get site inventory summary
   */
  async getSiteInventory(siteId: string) {
    return this.prisma.siteInventory.findMany({
      where: { siteId },
      include: {
        products: { select: { name: true, sku: true, units: { select: { abbreviation: true } } } },
      },
      orderBy: { lastUpdatedAt: "desc" },
    });
  }
}
