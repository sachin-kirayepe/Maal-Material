import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class VendorNetworkService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  createVendor(data: unknown) {

                try {
                  return this.prisma.marketplaceVendor.create({ data: data as any });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'VendorNetworkService', 
                         action: 'createVendor',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  getVendors() {
    return this.prisma.marketplaceVendor.findMany({ include: { ratings: true } });
  }

  rateVendor(data: unknown) {
    return this.prisma.vendorRating.create({ data: data as any });
  }
}
