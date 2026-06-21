import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class DigitalExchangeService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  createRfq(data: unknown) {

                try {
                  return this.prisma.rFQExchange.create({ data: data as any });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'DigitalExchangeService', 
                         action: 'createRfq',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  getRfqs() {
    return this.prisma.rFQExchange.findMany({
      include: { quotations: true },
      orderBy: { createdAt: "desc" },
    });
  }

  submitQuotation(data: unknown) {
    return this.prisma.marketplaceQuotation.create({ data: data as any });
  }
}
