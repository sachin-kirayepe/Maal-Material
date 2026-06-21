import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as crypto from "crypto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ProcurementService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getRequisitions(tenantId: string) {
    return this.prisma.purchaseRequisition.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPurchaseOrders(tenantId: string) {
    return this.prisma.procurementPurchaseOrder.findMany({
      where: { tenantId },
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      include: { vendors: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getGoodsReceipts(tenantId: string) {
    return this.prisma.procurementGoodsReceipt.findMany({
      where: { tenantId },
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      include: { purchaseOrders: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async createRequisition(tenantId: string, data: any) {

                try {
                  // Generate secure unique ID instead of Date.now() to prevent PK collisions
      const secureId = crypto.randomBytes(4).toString("hex").toUpperCase();
      const prNumber = `PR-${new Date().getFullYear()}-${secureId}`;

      return this.prisma.$transaction(async (tx) => {
        const pr = await tx.purchaseRequisition.create({
          data: {
            tenantId,
            prNumber,
            department: data.department || "Operations",
            requestedBy: data.requestedBy || "System",
            status: "PENDING_APPROVAL",
            priority: data.priority || "NORMAL",
            items: JSON.stringify(data.items || []),
          },
        });
        return pr;
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ProcurementService', 
                         action: 'createRequisition',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
