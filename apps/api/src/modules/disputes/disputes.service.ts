import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class DisputesService {
  private readonly logger = new Logger(DisputesService.name);

  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getDisputeCases(tenantId: string) {
    this.logger.log(`Fetching dispute cases for ${tenantId}`);
    return this.prisma.disputeCase.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async updateDisputeStatus(tenantId: string, id: string, status: string, resolution?: string) {

                try {
                  return this.prisma.disputeCase.update({
        where: { id, tenantId },
        data: { status, resolution },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'DisputesService', 
                         action: 'updateDisputeStatus',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
