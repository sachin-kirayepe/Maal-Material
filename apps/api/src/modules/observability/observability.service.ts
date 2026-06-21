import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ObservabilityService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getMetrics(tenantId: string) {
    return this.prisma.systemMetric.findMany({
      where: { tenantId },
      orderBy: { recordedAt: "desc" },
      take: 100,
    });
  }

  async recordMetric(
    tenantId: string | null,
    metricName: string,
    metricValue: number,
    unit: string,
    metadata?: unknown,
  ) {

                try {
                  return this.prisma.systemMetric.create({
        data: {
          tenantId,
          metricName,
          metricValue,
          unit,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ObservabilityService', 
                         action: 'recordMetric',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
