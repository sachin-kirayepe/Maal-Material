import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import {
  StockInDto,
  StockOutDto,
  StockTransferDto,
  StockAdjustmentDto,
  StockReservationDto,
} from "./dto/stock.dto";
import { EventsService } from "../events/events.service";
import { DomainEvents } from "../events/dto/events.dto";

import { LockService } from "@database/lock.service";

@Injectable()
export class StockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
    private readonly lockService: LockService,
  ) {}

  /**
   * STOCK IN â€” Add inventory to a warehouse
   */
  async stockIn(dto: StockInDto, performedBy: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, deletedAt: null },
    });
    if (!product) throw new NotFoundException("Product not found");

    const warehouse = await this.prisma.warehouse.findFirst({
      where: { id: dto.warehouseId, deletedAt: null },
    });
    if (!warehouse) throw new NotFoundException("Warehouse not found");

    // Upsert warehouse stock
    await this.prisma.warehouseStock.upsert({
      where: { warehouseId_productId: { warehouseId: dto.warehouseId, productId: dto.productId } },
      create: { warehouseId: dto.warehouseId, productId: dto.productId, quantity: dto.quantity },
      update: { quantity: { increment: dto.quantity } },
    });

    // Log movement
    const movement = await this.prisma.stockMovement.create({
      data: {
        productId: dto.productId,
        movementType: "STOCK_IN",
        quantity: dto.quantity,
        toWarehouseId: dto.warehouseId,
        unitCost: dto.unitCost,
        totalCost: dto.unitCost ? dto.unitCost * dto.quantity : null,
        referenceType: dto.referenceType || "MANUAL",
        referenceId: dto.referenceId,
        notes: dto.notes,
        performedBy,
      },
      include: { products: true },
    });

    return movement;
  }

  /**
   * STOCK OUT - Remove inventory from a warehouse securely
   */
  async stockOut(dto: StockOutDto, performedBy: string) {
    return this.prisma.$transaction(async (tx) => {
      // Find stock first to get ID
      const stock = await tx.warehouseStock.findUnique({
        where: {
          warehouseId_productId: { warehouseId: dto.warehouseId, productId: dto.productId },
        },
      });

      if (!stock) {
        throw new NotFoundException(
          "No stock record found for this product in the specified warehouse",
        );
      }

      // ACQUIRE ROW LOCK: Prevent any other concurrent process from reading or modifying this stock
      await this.lockService.acquireRowLock(tx, "WarehouseStock", stock.id);

      // Re-fetch stock after lock to get absolute real-time quantity
      const lockedStock = await tx.warehouseStock.findUnique({
        where: { id: stock.id },
      });

      const available = lockedStock!.quantity - lockedStock!.reservedQty;
      if (available < dto.quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${available}, Requested: ${dto.quantity}`,
        );
      }

      await tx.warehouseStock.update({
        where: { id: stock.id },
        data: { quantity: { decrement: dto.quantity } },
      });

      const movement = await tx.stockMovement.create({
        data: {
          productId: dto.productId,
          movementType: "STOCK_OUT",
          quantity: dto.quantity,
          fromWarehouseId: dto.warehouseId,
          referenceType: dto.referenceType || "MANUAL",
          referenceId: dto.referenceId,
          notes: dto.notes,
          performedBy,
        },
        include: { products: true },
      });

      this.eventsService.publish(DomainEvents.STOCK_REDUCED, {
        tenantId: (movement as any).fromWarehouseId?.tenantId || "system",
        userId: performedBy,
        productId: dto.productId,
        productName: (movement as any).products?.name,
        warehouseId: dto.warehouseId,
        quantityReduced: dto.quantity,
        remainingQuantity: available - dto.quantity,
      });

      return movement;
    });
  }

  /**
   * TRANSFER - Move stock between warehouses securely
   */
  async transfer(dto: StockTransferDto, performedBy: string) {
    if (dto.fromWarehouseId === dto.toWarehouseId) {
      throw new BadRequestException("Source and destination warehouses cannot be the same");
    }

    return this.prisma.$transaction(async (tx) => {
      // Find source stock to get ID
      const sourceStock = await tx.warehouseStock.findUnique({
        where: {
          warehouseId_productId: { warehouseId: dto.fromWarehouseId, productId: dto.productId },
        },
      });

      if (!sourceStock) throw new NotFoundException("No stock in source warehouse");

      // ACQUIRE ROW LOCK on source stock
      await this.lockService.acquireRowLock(tx, "WarehouseStock", sourceStock.id);

      // Re-fetch source stock after lock
      const lockedSourceStock = await tx.warehouseStock.findUnique({
        where: { id: sourceStock.id },
      });

      const available = lockedSourceStock!.quantity - lockedSourceStock!.reservedQty;
      if (available < dto.quantity) {
        throw new BadRequestException(`Insufficient stock for transfer. Available: ${available}`);
      }

      // Decrement source securely
      await tx.warehouseStock.update({
        where: { id: sourceStock.id },
        data: { quantity: { decrement: dto.quantity } },
      });

      // Increment destination (We don't need to strictly lock destination for incrementing via UPSERT)
      await tx.warehouseStock.upsert({
        where: {
          warehouseId_productId: { warehouseId: dto.toWarehouseId, productId: dto.productId },
        },
        create: {
          warehouseId: dto.toWarehouseId,
          productId: dto.productId,
          quantity: dto.quantity,
        },
        update: { quantity: { increment: dto.quantity } },
      });

      return tx.stockMovement.create({
        data: {
          productId: dto.productId,
          movementType: "TRANSFER",
          quantity: dto.quantity,
          fromWarehouseId: dto.fromWarehouseId,
          toWarehouseId: dto.toWarehouseId,
          referenceType: "TRANSFER",
          notes: dto.notes,
          performedBy,
        },
        include: { products: true },
      });
    });
  }

  /**
   * ADJUSTMENT â€” Correct stock count (recount, damage, loss)
   */
  async adjust(dto: StockAdjustmentDto, performedBy: string) {
    const stock = await this.prisma.warehouseStock.findUnique({
      where: { warehouseId_productId: { warehouseId: dto.warehouseId, productId: dto.productId } },
    });

    const previousQty = stock?.quantity || 0;
    const adjustedQty = dto.newQuantity - previousQty;

    // Update stock to new quantity
    await this.prisma.warehouseStock.upsert({
      where: { warehouseId_productId: { warehouseId: dto.warehouseId, productId: dto.productId } },
      create: {
        warehouseId: dto.warehouseId,
        productId: dto.productId,
        quantity: dto.newQuantity,
        lastCountedAt: new Date(),
      },
      update: { quantity: dto.newQuantity, lastCountedAt: new Date() },
    });

    // Record adjustment
    await this.prisma.stockAdjustment.create({
      data: {
        warehouseId: dto.warehouseId,
        productId: dto.productId,
        adjustmentType: dto.adjustmentType,
        previousQty,
        adjustedQty,
        newQty: dto.newQuantity,
        reason: dto.reason,
        performedBy,
      },
    });

    // Log movement
    return this.prisma.stockMovement.create({
      data: {
        productId: dto.productId,
        movementType: "ADJUSTMENT",
        quantity: Math.abs(adjustedQty),
        toWarehouseId: dto.warehouseId,
        referenceType: "MANUAL",
        notes: `${dto.adjustmentType}: ${dto.reason || "No reason provided"}`,
        performedBy,
      },
      include: { products: true },
    });
  }

  /**
   * RESERVE - Hold stock for an order securely
   */
  async reserve(dto: StockReservationDto, reservedBy: string) {
    return this.prisma.$transaction(async (tx) => {
      const stock = await tx.warehouseStock.findUnique({
        where: {
          warehouseId_productId: { warehouseId: dto.warehouseId, productId: dto.productId },
        },
      });
      if (!stock) throw new NotFoundException("No stock record found");

      // ACQUIRE ROW LOCK
      await this.lockService.acquireRowLock(tx, "WarehouseStock", stock.id);

      // Re-fetch stock after lock
      const lockedStock = await tx.warehouseStock.findUnique({
        where: { id: stock.id },
      });

      const available = lockedStock!.quantity - lockedStock!.reservedQty;
      if (available < dto.quantity) {
        throw new BadRequestException(
          `Cannot reserve. Available: ${available}, Requested: ${dto.quantity}`,
        );
      }

      await tx.warehouseStock.update({
        where: { id: stock.id },
        data: { reservedQty: { increment: dto.quantity } },
      });

      return tx.stockReservation.create({
        data: {
          warehouseId: dto.warehouseId,
          productId: dto.productId,
          quantity: dto.quantity,
          referenceType: dto.referenceType,
          referenceId: dto.referenceId,
          reservedBy,
        },
        include: { products: true, warehouses: true },
      });
    });
  }

  /**
   * Get movement history for a product or warehouse
   */
  async getMovements(query: unknown = {}) {
    const { productId, warehouseId, movementType, page, limit } = query as any;
    const take = Math.min(Number(limit) || 20, 100);
    const skip = ((Number(page) || 1) - 1) * take;

    const where: unknown = {};
    if (productId) (where as any).productId = productId;
    if (movementType) (where as any).movementType = movementType;
    if (warehouseId) {
      (where as any).OR = [{ fromWarehouseId: warehouseId }, { toWarehouseId: warehouseId }];
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where: where as any,
        include: {
          products: true,
          users: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.prisma.stockMovement.count({ where: where as any }),
    ]);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: take,
        totalPages: Math.ceil(totalItems / take),
        currentPage: Number(page) || 1,
      },
    };
  }

  /**
   * Get stock overview across all warehouses
   */
  async getStockOverview() {
    return this.prisma.warehouseStock.findMany({
      include: { products: { include: { units: true } }, warehouses: true },
      orderBy: { updatedAt: "desc" },
    });
  }
}
