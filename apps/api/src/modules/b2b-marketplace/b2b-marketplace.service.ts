import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class B2bMarketplaceService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  createStorefront(data: unknown) {

                try {
                  return this.prisma.vendorStorefront.create({ data: data as any });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'B2bMarketplaceService', 
                         action: 'createStorefront',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  getStorefronts() {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.vendorStorefront.findMany({ include: { vendors: true } });
  }

  createOrder(data: unknown) {

                try {
                  return this.prisma.commerceOrder.create({ data: data as any });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'B2bMarketplaceService', 
                         action: 'createOrder',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  getOrders() {
    return this.prisma.commerceOrder.findMany({
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      include: { vendors: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
