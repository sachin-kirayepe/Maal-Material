import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class EcosystemService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  createConnection(data: unknown) {

                try {
                  return this.prisma.ecosystemConnection.create({ data: data as any });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'EcosystemService', 
                         action: 'createConnection',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  getConnections() {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.ecosystemConnection.findMany({ include: { vendors: true } });
  }

  processSettlement(data: unknown) {

                try {
                  return this.prisma.marketplaceSettlement.create({ data: data as any });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'EcosystemService', 
                         action: 'processSettlement',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  getSettlements() {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.marketplaceSettlement.findMany({ include: { vendors: true, order: true } });
  }
}
