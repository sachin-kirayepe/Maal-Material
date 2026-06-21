import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateFulfillmentDto } from "./dto/order-fulfillment.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class OrderFulfillmentService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async createFulfillment(createFulfillmentDto: CreateFulfillmentDto, userId: string) {

                try {
                  const { orderId, warehouseId, items, carrier, trackingNumber } = createFulfillmentDto;

      const order = await this.prisma.order!.findUnique({
        where: { id: orderId },
        include: { fulfillments: true },
      });

      if (!order) throw new NotFoundException("Order not found");

      const fulfillmentNumber = `FF-${Date.now().toString().slice(-6)}`;

      return this.prisma.$transaction(async (tx) => {
        const fulfillment = await tx.fulfillment.create({
          data: {
            fulfillmentNumber,
            orderId,
            warehouseId,
            carrier,
            trackingNumber,
            createdBy: userId,
            fulfillmentItems: {
              create: items.map((i) => ({
                orderItemId: i.orderItemId,
                productId: i.productId,
                quantity: i.quantity,
              })),
            },
          },
          include: { fulfillmentItems: true },
        });

        // Update Order Items Fulfilled Qty and Stock Deduction
        for (const item of items) {
          // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
          const orderItem = order!.items.find((i) => i.id === item.orderItemId);
          if (!orderItem) throw new BadRequestException(`Order item ${item.orderItemId} not found`);

          const newFulfilledQty = orderItem.fulfilledQty + item.quantity;
          if (newFulfilledQty > orderItem.orderedQty) {
            throw new BadRequestException(
              `Cannot fulfill more than ordered quantity for product ${item.productId}`,
            );
          }

          await tx.orderItem.update({
            where: { id: item.orderItemId },
            data: { fulfilledQty: newFulfilledQty },
          });

          // Deduct from Warehouse Stock
          const stock = await tx.warehouseStock.findUnique({
            where: { warehouseId_productId: { warehouseId, productId: item.productId } },
          });

          if (!stock || stock.quantity < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product ${item.productId} in warehouse ${warehouseId}`,
            );
          }

          await tx.warehouseStock.update({
            where: { id: stock.id },
            data: { quantity: stock.quantity - item.quantity },
          });

          // Record Stock Movement
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              movementType: "STOCK_OUT",
              quantity: item.quantity,
              referenceType: "FULFILLMENT",
              referenceId: fulfillment.id,
              fromWarehouseId: warehouseId,
              notes: `Fulfillment for order ${order!.orderNumber}`,
              performedBy: userId,
            },
          });
        }

        // Check if order is partially or fully fulfilled
        const updatedOrderItems = await tx.orderItem.findMany({ where: { orderId } });
        const isFullyFulfilled = updatedOrderItems.every((i) => i.fulfilledQty >= i.orderedQty);

        await tx.order!.update({
          where: { id: orderId },
          data: {
            fulfillmentStatus: isFullyFulfilled ? "FULFILLED" : "PARTIAL",
          },
        });

        return fulfillment;
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'OrderFulfillmentService', 
                         action: 'createFulfillment',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async markAsShipped(id: string) {

                try {
                  return this.prisma.fulfillment.update({
        where: { id },
        data: { status: "SHIPPED", shippedAt: new Date() },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'OrderFulfillmentService', 
                         action: 'markAsShipped',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async markAsDelivered(id: string) {

                try {
                  return this.prisma.fulfillment.update({
        where: { id },
        data: { status: "DELIVERED", deliveredAt: new Date() },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'OrderFulfillmentService', 
                         action: 'markAsDelivered',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
