import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async createNotification(data: {
    tenantId?: string;
    userId: string;
    title: string;
    body: string;
    type?: string;
    priority?: string;
    actionUrl?: string;
  }) {

                try {
                  const notification = await this.prisma.notification.create({
        data: {
          ...(data as any),
        } as any,
      });

      // Instantly push to connected clients via WebSockets
      this.realtimeGateway.sendToUser(data.userId, "notification.new", notification);

      return notification;
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'NotificationsService', 
                         action: 'createNotification',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async getUserNotifications(userId: string, limit = 50) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async markAsRead(notificationId: string, userId: string) {

                try {
                  return this.prisma.notification.update({
        where: { id: notificationId, userId },
        data: { isRead: true, readAt: new Date() },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'NotificationsService', 
                         action: 'markAsRead',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async markAllAsRead(userId: string) {

                try {
                  return this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'NotificationsService', 
                         action: 'markAllAsRead',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
