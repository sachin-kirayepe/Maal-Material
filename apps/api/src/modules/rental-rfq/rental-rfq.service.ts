import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class RentalRfqService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getRfqs(tenantId: string) {
    return this.prisma.rentalRFQ.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async createRfq(data: unknown) {

                try {
                  return this.prisma.rentalRFQ.create({
        data: {
          tenantId: (data as any).tenantId,
          contractorId: (data as any).contractorId,
          equipmentType: (data as any).equipmentType,
          quantity: (data as any).quantity,
          requiredFrom: (data as any).requiredFrom,
          requiredUntil: (data as any).requiredUntil,
          location: (data as any).location,
          status: "OPEN",
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'RentalRfqService', 
                         action: 'createRfq',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
