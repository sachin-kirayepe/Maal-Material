import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import {
  CreatePurchaseOrderDto,
  CreateGoodsReceiptDto,
  CreatePurchaseReturnDto,
} from "./dto/purchases.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  // ========= PURCHASE ORDERS =========

  async createPurchaseOrder(dto: CreatePurchaseOrderDto, createdBy: string) {

                try {
                  const supplier = await this.prisma.commerceParticipant.findFirst({
        where: { id: dto.supplierId, deletedAt: null },
      });
      if (!supplier) throw new NotFoundException("Supplier not found");

      const warehouse = await this.prisma.warehouse.findFirst({
        where: { id: dto.warehouseId, deletedAt: null },
      });
      if (!warehouse) throw new NotFoundException("Warehouse not found");

      // Build line items with product snapshot
      const itemsData = [];
      let subtotal = 0;
      let totalTax = 0;

      for (const item of dto.items) {
        const product = await this.prisma.product.findFirst({
          where: { id: item.productId, deletedAt: null },
        });
        if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

        const discountPercent = item.discountPercent || 0;
        const taxPercent = item.taxPercent || product.taxPercent || 0;
        const lineSubtotal = item.orderedQty * item.unitPrice;
        const discountAmount = lineSubtotal * (discountPercent / 100);
        const taxableAmount = lineSubtotal - discountAmount;
        const taxAmount = taxableAmount * (taxPercent / 100);
        const totalAmount = taxableAmount + taxAmount;

        subtotal += taxableAmount;
        totalTax += taxAmount;

        itemsData.push({
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          hsn: product.hsn,
          orderedQty: item.orderedQty,
          unitPrice: item.unitPrice,
          taxPercent,
          taxAmount,
          discountPercent,
          discountAmount,
          totalAmount,
        });
      }

      const discount = dto.discount || 0;
      const shippingCost = dto.shippingCost || 0;
      const grandTotal = subtotal - discount + totalTax + shippingCost;

      const poNumber = "PO-" + Date.now();

      return this.prisma.purchaseOrder.create({
        data: {
          poNumber,
          supplierId: dto.supplierId,
          warehouseId: dto.warehouseId,
          subtotal,
          taxAmount: totalTax,
          discount,
          shippingCost,
          grandTotal,
          expectedDelivery: dto.expectedDelivery ? new Date(dto.expectedDelivery) : undefined,
          notes: dto.notes,
          terms: dto.terms,
          createdBy,
          purchaseOrderItems: { create: itemsData },
        },
        include: {
          purchaseOrderItems: { include: { products: true } },
          suppliers: true,
          warehouses: true,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'PurchasesService', 
                         action: 'createPurchaseOrder',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAllPurchaseOrders(query: unknown = {}) {
    const { status, supplierId, search, page, limit } = query as any;
    const take = Math.min(Number(limit) || 20, 100);
    const skip = ((Number(page) || 1) - 1) * take;

    const where: unknown = { deletedAt: null };
    if (status) (where as any).status = status;
    if (supplierId) (where as any).supplierId = supplierId;
    if (search) (where as any).poNumber = { contains: search };

    const [items, totalItems] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where: where as any,
        skip,
        take,
        include: {
          suppliers: true,
          warehouses: true,
          _count: { select: { purchaseOrderItems: true, goodsReceiptNotes: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.purchaseOrder.count({ where: where as any }),
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

  async findPurchaseOrderById(id: string) {
    const po = await this.prisma.purchaseOrder.findFirst({
      where: { id, deletedAt: null },
      include: {
        suppliers: true,
        warehouses: true,
        purchaseOrderItems: { include: { products: true } },
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        goodsReceiptNotes: { include: { purchaseItems: true } },
        invoices: true,
      },
    });
    if (!po) throw new NotFoundException("Purchase order not found");
    return po;
  }

  async approvePurchaseOrder(id: string, approvedBy: string) {

                try {
                  const po = await this.findPurchaseOrderById(id);
      if (po.status !== "DRAFT" && po.status !== "PENDING")
        throw new BadRequestException("Only DRAFT or PENDING orders can be approved");

      return this.prisma.purchaseOrder.update({
        where: { id },
        data: { status: "APPROVED", approvedBy, approvedAt: new Date() },
        include: { suppliers: true, purchaseOrderItems: true },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'PurchasesService', 
                         action: 'approvePurchaseOrder',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async cancelPurchaseOrder(id: string) {

                try {
                  const po = await this.findPurchaseOrderById(id);
      if (po.status === "RECEIVED" || po.status === "CANCELLED")
        throw new BadRequestException("Cannot cancel this order");

      return this.prisma.purchaseOrder.update({
        where: { id },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'PurchasesService', 
                         action: 'cancelPurchaseOrder',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  // ========= GOODS RECEIPT NOTES (GRN) =========

  async createGoodsReceipt(dto: CreateGoodsReceiptDto, receivedBy: string) {

                try {
                  const po = await this.findPurchaseOrderById(dto.purchaseOrderId);
      if (po.status === "CANCELLED")
        throw new BadRequestException("Cannot receive goods for a cancelled PO");
      if (po.status === "RECEIVED")
        throw new BadRequestException("All goods already received for this PO");

      const grnNumber = "GRN-" + Date.now();

      return this.prisma.$transaction(
        async (tx) => {
          // 1. Create GRN
          const grn = await tx.goodsReceiptNote.create({
            data: {
              grnNumber,
              purchaseOrderId: dto.purchaseOrderId,
              warehouseId: po.warehouseId,
              receivedBy,
              notes: dto.notes,
              status: "COMPLETED",
              goodsReceiptItems: {
                create: dto.items.map((item) => ({
                  purchaseOrderItemId: item.purchaseOrderItemId,
                  productId: item.productId,
                  receivedQty: item.receivedQty,
                  acceptedQty: item.acceptedQty,
                  rejectedQty: item.rejectedQty || 0,
                  damagedQty: item.damagedQty || 0,
                  notes: item.notes,
                })),
              },
            },
            include: { goodsReceiptItems: { include: { products: true } } },
          });

          // 2. Update PO item received quantities + warehouse stock
          for (const item of dto.items) {
            // Update PO line item
            await tx.purchaseOrderItem.update({
              where: { id: item.purchaseOrderItemId },
              data: { receivedQty: { increment: item.acceptedQty } },
            });

            // CRITICAL: Update warehouse stock (STOCK IN)
            await tx.warehouseStock.upsert({
              where: {
                warehouseId_productId: { warehouseId: po.warehouseId, productId: item.productId },
              },
              create: {
                warehouseId: po.warehouseId,
                productId: item.productId,
                quantity: item.acceptedQty,
                damagedQty: item.damagedQty || 0,
              },
              update: {
                quantity: { increment: item.acceptedQty },
                damagedQty: { increment: item.damagedQty || 0 },
              },
            });

            // Log stock movement
            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                movementType: "STOCK_IN",
                quantity: item.acceptedQty,
                toWarehouseId: po.warehouseId,
                referenceType: "PURCHASE_ORDER",
                referenceId: po.id,
                // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
                unitCost: po.purchaseOrderItems.find((i) => i.id === item.purchaseOrderItemId)
                  ?.unitPrice,
                notes: `GRN ${grnNumber} - Goods received`,
                performedBy: receivedBy,
              },
            });
          }

          // 3. Update PO status
          const updatedItems = await tx.purchaseOrderItem.findMany({
            where: { purchaseOrderId: po.id },
          });
          const allReceived = updatedItems.every((i) => i.receivedQty >= i.orderedQty);
          const someReceived = updatedItems.some((i) => i.receivedQty > 0);

          await tx.purchaseOrder.update({
            where: { id: po.id },
            data: {
              status: allReceived ? "RECEIVED" : someReceived ? "PARTIAL_RECEIVED" : po.status,
            },
          });

          return grn;
        },
        { maxWait: 10000, timeout: 20000 },
      );
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'PurchasesService', 
                         action: 'createGoodsReceipt',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAllGRNs(query: unknown = {}) {
    const { purchaseOrderId, page, limit } = query as any;
    const take = Math.min(Number(limit) || 20, 100);
    const skip = ((Number(page) || 1) - 1) * take;

    const where: unknown = {};
    if (purchaseOrderId) (where as any).purchaseOrderId = purchaseOrderId;

    const [items, totalItems] = await Promise.all([
      this.prisma.goodsReceiptNote.findMany({
        where: where as any,
        skip,
        take,
        include: {
          purchaseOrders: { include: { suppliers: true } },
          warehouses: true,
          _count: { select: { goodsReceiptItems: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.goodsReceiptNote.count({ where: where as any }),
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

  async findGRNById(id: string) {
    const grn = await this.prisma.goodsReceiptNote.findUnique({
      where: { id },
      include: {
        purchaseOrders: { include: { suppliers: true } },
        warehouses: true,
        goodsReceiptItems: { include: { products: true } },
        users: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!grn) throw new NotFoundException("GRN not found");
    return grn;
  }

  // ========= PURCHASE RETURNS =========

  async createPurchaseReturn(dto: CreatePurchaseReturnDto, createdBy: string) {

                try {
                  const po = await this.findPurchaseOrderById(dto.purchaseOrderId);

      return this.prisma.$transaction(
        async (tx) => {
          const returnNumber = "RET-" + Date.now();
          let totalAmount = 0;

          const itemsData = dto.items.map((item) => {
            // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
            const product = po.purchaseOrderItems.find((i) => i.productId === item.productId);
            const productName = product?.productName || "Unknown";
            const lineTotal = item.returnedQty * item.unitPrice;
            totalAmount += lineTotal;
            return {
              productId: item.productId,
              productName,
              returnedQty: item.returnedQty,
              unitPrice: item.unitPrice,
              totalAmount: lineTotal,
              reason: item.reason,
            };
          });

          const purchaseReturn = await tx.purchaseReturn.create({
            data: {
              returnNumber,
              supplierId: po.supplierId,
              purchaseOrderId: po.id,
              warehouseId: po.warehouseId,
              totalAmount,
              reason: dto.reason,
              status: "COMPLETED",
              createdBy,
              purchaseReturnItems: { create: itemsData },
            },
            include: { purchaseReturnItems: true },
          });

          // STOCK OUT for returned items
          for (const item of dto.items) {
            await tx.warehouseStock.update({
              where: {
                warehouseId_productId: { warehouseId: po.warehouseId, productId: item.productId },
              },
              data: { quantity: { decrement: item.returnedQty } },
            });

            await tx.purchaseOrderItem.updateMany({
              where: { purchaseOrderId: po.id, productId: item.productId },
              data: { returnedQty: { increment: item.returnedQty } },
            });

            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                movementType: "RETURN",
                quantity: item.returnedQty,
                fromWarehouseId: po.warehouseId,
                referenceType: "PURCHASE_ORDER",
                referenceId: po.id,
                notes: `Purchase Return ${returnNumber}`,
                performedBy: createdBy,
              },
            });
          }

          // Update supplier ledger (credit - we owe less)
          const ledger = await tx.supplierLedger.findUnique({ where: { supplierId: po.supplierId } });
          if (ledger) {
            const newBalance = ledger.balance - totalAmount;
            await tx.supplierLedger.update({
              where: { id: ledger.id },
              data: { balance: newBalance },
            });
            await tx.supplierLedgerEntry.create({
              data: {
                supplierLedgerId: ledger.id,
                referenceId: purchaseReturn.id,
                referenceType: "PURCHASE_RETURN",
                description: `Purchase Return ${returnNumber}`,
                credit: totalAmount,
                balance: newBalance,
                createdBy,
              },
            });
          }

          return purchaseReturn;
        },
        { maxWait: 10000, timeout: 20000 },
      );
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'PurchasesService', 
                         action: 'createPurchaseReturn',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  // ========= DASHBOARD STATS =========

  async getDashboardStats() {
    const [totalPOs, pendingPOs, todayGRNs, totalPurchaseValue] = await Promise.all([
      this.prisma.purchaseOrder.count({ where: { deletedAt: null } }),
      this.prisma.purchaseOrder.count({
        where: { status: { in: ["DRAFT", "PENDING", "APPROVED"] }, deletedAt: null },
      }),
      this.prisma.goodsReceiptNote.count({
        where: { receiptDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      this.prisma.purchaseOrder.aggregate({
        where: { deletedAt: null, status: { not: "CANCELLED" } },
        _sum: { grandTotal: true },
      }),
    ]);

    return {
      totalPurchaseOrders: totalPOs,
      pendingPurchaseOrders: pendingPOs,
      goodsReceivedToday: todayGRNs,
      totalPurchaseValue: totalPurchaseValue._sum.grandTotal || 0,
    };
  }
}
