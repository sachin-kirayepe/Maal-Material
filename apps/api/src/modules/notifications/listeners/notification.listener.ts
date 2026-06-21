import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationsService } from "../notifications.service";
import { JobsService } from "../../jobs/jobs.service";
import { DomainEvents } from "../../events/dto/events.dto";

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jobsService: JobsService,
  ) {}

  @OnEvent(DomainEvents.ORDER_CONFIRMED)
  async handleOrderConfirmed(payload: unknown) {
    this.logger.debug(`Received ORDER_CONFIRMED event for Order ${(payload as any).orderNumber}`);

    // Create In-App Notification
    await this.notificationsService.createNotification({
      tenantId: (payload as any).tenantId,
      userId: (payload as any).userId, // The user to notify
      title: "Order Confirmed",
      body: `Order ${(payload as any).orderNumber} has been confirmed successfully.`,
      type: "ALERT",
      actionUrl: `/orders/${(payload as any).orderId}`,
    });

    // Enqueue Background Job for Email
    await this.jobsService.enqueueNotification("send-email", {
      email: (payload as any).customerEmail,
      subject: `Order Confirmation - ${(payload as any).orderNumber}`,
      template: "order-confirmed",
      data: payload,
    });
  }

  @OnEvent(DomainEvents.STOCK_REDUCED)
  async handleStockReduced(payload: unknown) {
    this.logger.debug(`Received STOCK_REDUCED event for Product ${(payload as any).productId}`);

    // Create In-App Notification (e.g., to warehouse manager if threshold reached)
    // Only if payload indicates low stock (omitted logic for brevity)
    if ((payload as any).quantity < 10) {
      await this.notificationsService.createNotification({
        tenantId: (payload as any).tenantId,
        userId: (payload as any).userId, // Usually the shop owner or warehouse manager
        title: "Low Stock Alert",
        body: `Product ${(payload as any).productId} is running low on stock.`,
        type: "SYSTEM",
        priority: "HIGH",
        actionUrl: `/inventory/${(payload as any).productId}`,
      });
    }
  }
}
