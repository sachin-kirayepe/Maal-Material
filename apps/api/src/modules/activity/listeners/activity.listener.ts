import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ActivityService } from "../activity.service";
import { DomainEvents } from "../../events/dto/events.dto";

@Injectable()
export class ActivityListener {
  constructor(private readonly activityService: ActivityService) {}

  @OnEvent(DomainEvents.ORDER_CREATED)
  async handleOrderCreated(payload: unknown) {
    await this.activityService.logActivity({
      tenantId: (payload as any).tenantId,
      actorId: (payload as any).userId,
      action: "ORDER_CREATED",
      entityType: "Order",
      entityId: (payload as any).orderId,
      metadata: { totalAmount: (payload as any).totalAmount },
    });
  }

  @OnEvent(DomainEvents.STOCK_REDUCED)
  async handleStockReduced(payload: unknown) {
    await this.activityService.logActivity({
      tenantId: (payload as any).tenantId,
      actorId: (payload as any).userId,
      action: "STOCK_REDUCED",
      entityType: "Stock",
      entityId: (payload as any).warehouseStockId || "unknown",
      metadata: { productId: (payload as any).productId, quantity: (payload as any).quantity },
    });
  }

  @OnEvent(DomainEvents.INVOICE_CREATED)
  async handleInvoiceCreated(payload: unknown) {
    await this.activityService.logActivity({
      tenantId: (payload as any).tenantId,
      actorId: (payload as any).userId,
      action: "INVOICE_CREATED",
      entityType: "Invoice",
      entityId: (payload as any).invoiceId,
      metadata: { amount: (payload as any).amount },
    });
  }
}
