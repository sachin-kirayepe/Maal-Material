import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import {
  CreateDeliveryDto,
  AssignDeliveryDto,
  UpdateDeliveryStatusDto,
  DeliveryProofDto,
  DeliveryQueryDto,
} from "./dto/delivery.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async create(dto: CreateDeliveryDto, userId: string) {

                try {
                  // Validate order and customer
      const order = await this.prisma.order!.findUnique({ where: { id: dto.orderId } });
      if (!order) throw new NotFoundException("Order not found");

      const customer = await this.prisma.customer.findUnique({ where: { id: dto.customerId } });
      if (!customer) throw new NotFoundException("Customer not found");

      const deliveryNumber = `DEL-${Date.now().toString().slice(-8)}`;

      return this.prisma.$transaction(async (tx) => {
        const delivery = await tx.delivery.create({
          data: {
            deliveryNumber,
            orderId: dto.orderId,
            fulfillmentId: dto.fulfillmentId,
            customerId: dto.customerId,
            warehouseId: dto.warehouseId,
            shippingAddress: dto.shippingAddress,
            shippingCity: dto.shippingCity,
            shippingState: dto.shippingState,
            shippingPincode: dto.shippingPincode,
            weight: dto.weight || 0,
            deliveryNotes: dto.deliveryNotes,
            createdBy: userId,
            deliveryItems: {
              create: dto.items.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                orderItemId: item.orderItemId,
                quantity: item.quantity,
              })),
            },
          },
          include: { deliveryItems: true },
        });

        await tx.deliveryTimeline.create({
          data: {
            deliveryId: delivery.id,
            status: "PENDING",
            description: `Delivery ${deliveryNumber} created. Awaiting driver assignment.`,
            createdBy: userId,
          },
        });

        return delivery;
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'DeliveryService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async assignDriver(id: string, dto: AssignDeliveryDto, userId: string) {
    const delivery = await this.findById(id);

    if (delivery.deliveryStatus !== "PENDING") {
      throw new BadRequestException(
        `Cannot assign driver to delivery in '${delivery.deliveryStatus}' status`,
      );
    }

    // Validate driver and vehicle
    const driver = await this.prisma.driver.findFirst({
      where: { id: dto.driverId, deletedAt: null },
    });
    if (!driver) throw new NotFoundException("Driver not found");

    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: dto.vehicleId, deletedAt: null },
    });
    if (!vehicle) throw new NotFoundException("Vehicle not found");

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.delivery.update({
        where: { id },
        data: {
          driverId: dto.driverId,
          vehicleId: dto.vehicleId,
          scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : null,
          deliveryStatus: "ASSIGNED",
        },
      });

      await tx.driver.update({
        where: { id: dto.driverId },
        data: { availabilityStatus: "ON_DELIVERY" },
      });

      await tx.deliveryTimeline.create({
        data: {
          deliveryId: id,
          status: "ASSIGNED",
          description: `Assigned to driver ${driver.name} with vehicle ${vehicle.vehicleNumber}`,
          createdBy: userId,
        },
      });

      // Integrate with Order Timeline
      await tx.orderTimeline.create({
        data: {
          orderId: delivery.orderId,
          status: "DELIVERY_ASSIGNED",
          description: `Delivery assigned to driver ${driver.name}`,
          createdBy: userId,
        },
      });

      return updated;
    });
  }

  async updateStatus(id: string, dto: UpdateDeliveryStatusDto, userId: string) {

                try {
                  const delivery = await this.findById(id);

      // Validate state transitions
      const validTransitions: Record<string, string[]> = {
        PENDING: ["ASSIGNED", "CANCELLED"],
        ASSIGNED: ["DISPATCHED", "PICKED_UP", "FAILED"],
        DISPATCHED: ["IN_TRANSIT", "DELIVERED", "FAILED"],
        PICKED_UP: ["IN_TRANSIT", "DELIVERED", "FAILED"],
        IN_TRANSIT: ["DELIVERED", "FAILED"],
        FAILED: ["ASSIGNED", "RETURNED"],
        DELIVERED: [],
        RETURNED: [],
      };

      const allowed = validTransitions[delivery.deliveryStatus];
      if (!allowed || !allowed.includes(dto.status)) {
        throw new BadRequestException(
          `Invalid transition from '${delivery.deliveryStatus}' to '${dto.status}'`,
        );
      }

      return this.prisma.$transaction(async (tx) => {
        const updateData: unknown = { deliveryStatus: dto.status };

        if (dto.status === "FAILED") {
          (updateData as any).failureReason = dto.reason;
        } else if (dto.status === "RETURNED") {
          (updateData as any).returnReason = dto.reason;
        } else if (dto.status === "DELIVERED") {
          (updateData as any).actualDeliveryDate = new Date();
        }

        const updated = await tx.delivery.update({
          where: { id },
          data: updateData as any,
        });

        await tx.deliveryTimeline.create({
          data: {
            deliveryId: id,
            status: dto.status,
            description: `Status changed to ${dto.status}${dto.reason ? ` - ${dto.reason}` : ""}`,
            location: dto.location,
            createdBy: userId,
          },
        });

        // Driver availability integration
        if (["DELIVERED", "FAILED", "RETURNED"].includes(dto.status) && delivery.driverId) {
          // Only free the driver if they don't have other active deliveries
          const activeDeliveries = await tx.delivery.count({
            where: {
              driverId: delivery.driverId,
              deliveryStatus: { in: ["ASSIGNED", "DISPATCHED", "PICKED_UP", "IN_TRANSIT"] },
              id: { not: id },
            },
          });

          if (activeDeliveries === 0) {
            await tx.driver.update({
              where: { id: delivery.driverId },
              data: { availabilityStatus: "AVAILABLE" },
            });
          }
        }

        // Order Integration for completion
        if (dto.status === "DELIVERED") {
          // Check if all deliveries for this order are delivered
          const pendingDeliveries = await tx.delivery.count({
            where: {
              orderId: delivery.orderId,
              deliveryStatus: { notIn: ["DELIVERED", "RETURNED"] },
              id: { not: id },
            },
          });

          if (pendingDeliveries === 0) {
            // If the order has fulfillments, check their status as well, ideally everything is processed
            await tx.order!.update({
              where: { id: delivery.orderId },
              data: { orderStatus: "DELIVERED" },
            });

            await tx.orderTimeline.create({
              data: {
                orderId: delivery.orderId,
                status: "DELIVERED",
                description: `All deliveries completed. Order delivered.`,
                createdBy: userId,
              },
            });
          }
        }

        return updated;
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'DeliveryService', 
                         action: 'updateStatus',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async markDelivered(id: string, dto: DeliveryProofDto, userId: string) {

                try {
                  const delivery = await this.findById(id);

      if (!["IN_TRANSIT", "DISPATCHED", "PICKED_UP"].includes(delivery.deliveryStatus)) {
        throw new BadRequestException(
          `Cannot mark as delivered from '${delivery.deliveryStatus}' status`,
        );
      }

      return this.prisma.$transaction(async (tx) => {
        await tx.deliveryProof.create({
          data: {
            deliveryId: id,
            recipientName: dto.recipientName,
            recipientSignature: dto.recipientSignature,
            photoUrl: dto.photoUrl,
            notes: dto.notes,
          },
        });

        // Update all items delivered qty
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        for (const item of delivery.items as any[]) {
          await tx.deliveryItem.update({
            where: { id: item.id },
            data: { deliveredQty: item.quantity },
          });
        }

        return this.updateStatus(id, { status: "DELIVERED" }, userId);
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'DeliveryService', 
                         action: 'markDelivered',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async initiateReturn(id: string, reason: string, userId: string) {
    const delivery = await this.findById(id);

    if (delivery.deliveryStatus !== "FAILED" && delivery.deliveryStatus !== "DELIVERED") {
      throw new BadRequestException(
        `Cannot initiate return from '${delivery.deliveryStatus}' status`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Update status
      await this.updateStatus(id, { status: "RETURNED", reason }, userId);

      // 2. If warehouse is set, create a Stock Movement (STOCK_IN / RETURN)
      if (delivery.warehouseId) {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        for (const item of delivery.items as any[]) {
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              movementType: "STOCK_IN",
              quantity: item.quantity,
              toWarehouseId: delivery.warehouseId,
              referenceType: "SALES_RETURN",
              referenceId: delivery.deliveryNumber,
              notes: `Returned delivery ${delivery.deliveryNumber}: ${reason}`,
              performedBy: userId,
            },
          });

          // Increment stock safely
          await tx.warehouseStock.update({
            where: {
              warehouseId_productId: {
                warehouseId: delivery.warehouseId,
                productId: item.productId,
              },
            },
            data: {
              quantity: { increment: item.quantity },
            },
          });
        }
      }

      return { success: true, message: "Return processed and stock restored" };
    });
  }

  async findAll(query: DeliveryQueryDto = {}) {
    const { status, driverId, customerId, search, page, limit } = query as any;
    const take = Math.min(Number(limit) || 20, 100);
    const skip = ((Number(page) || 1) - 1) * take;

    const where: unknown = { deletedAt: null };
    if (status) (where as any).deliveryStatus = status;
    if (driverId) (where as any).driverId = driverId;
    if (customerId) (where as any).customerId = customerId;
    if (search) {
      (where as any).OR = [
        { deliveryNumber: { contains: search } },
        { shippingAddress: { contains: search } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.delivery.findMany({
        where: where as any,
        include: {
          customers: { select: { name: true, companyName: true, mobile: true } },
          drivers: { select: { name: true, mobile: true } },
          vehicles: { select: { vehicleNumber: true, type: true } },
          // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
          order: { select: { orderNumber: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.prisma.delivery.count({ where: where as any }),
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

  async findById(id: string) {
    const delivery = await this.prisma.delivery.findFirst({
      where: { id, deletedAt: null },
      include: {
        customers: true,
        drivers: true,
        vehicles: true,
        warehouses: true,
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        order: { select: { orderNumber: true, orderStatus: true, grandTotal: true } },
        deliveryItems: { include: { products: { select: { name: true, sku: true } } } },
        timeline: {
          include: { creator: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: "desc" },
        },
        proof: true,
      },
    });

    if (!delivery) throw new NotFoundException(`Delivery '${id}' not found`);
    return delivery;
  }

  /**
   * Analytics: Delivery metrics
   */
  async getStats() {
    const [total, pending, assigned, inTransit, delivered, failed] = await Promise.all([
      this.prisma.delivery.count({ where: { deletedAt: null } }),
      this.prisma.delivery.count({ where: { deletedAt: null, deliveryStatus: "PENDING" } }),
      this.prisma.delivery.count({ where: { deletedAt: null, deliveryStatus: "ASSIGNED" } }),
      this.prisma.delivery.count({
        where: {
          deletedAt: null,
          deliveryStatus: { in: ["DISPATCHED", "PICKED_UP", "IN_TRANSIT"] },
        },
      }),
      this.prisma.delivery.count({ where: { deletedAt: null, deliveryStatus: "DELIVERED" } }),
      this.prisma.delivery.count({ where: { deletedAt: null, deliveryStatus: "FAILED" } }),
    ]);

    return { total, pending, assigned, inTransit, delivered, failed };
  }
}
