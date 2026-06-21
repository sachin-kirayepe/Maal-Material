import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class InsightsService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getAiInsights(tenantId: string) {
    return this.prisma.aiInsight.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async markInsightRead(tenantId: string, id: string) {

                try {
                  return this.prisma.aiInsight.update({
        where: { id, tenantId },
        data: { isRead: true },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'InsightsService', 
                         action: 'markInsightRead',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async getOperationalAlerts(tenantId: string) {
    return this.prisma.operationalAlert.findMany({
      where: { tenantId, isResolved: false },
      orderBy: { createdAt: "desc" },
    });
  }

  async resolveAlert(tenantId: string, id: string, userId: string) {
    return this.prisma.operationalAlert.update({
      where: { id, tenantId },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy: userId,
      },
    });
  }
}
