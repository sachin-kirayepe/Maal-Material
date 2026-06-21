import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class PurchaseIntelligenceService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(tenantId: string) {
    const totalPos = await this.prisma.procurementPurchaseOrder.count({ where: { tenantId } });
    const totalGrns = await this.prisma.procurementGoodsReceipt.count({ where: { tenantId } });
    const totalSpendRes = await this.prisma.procurementPurchaseOrder.aggregate({
      where: { tenantId },
      _sum: { totalAmount: true },
    });

    return {
      procurementCycleTime: 12.5, // Mock calculated value
      vendorPerformanceScore: 94.2,
      sourcingEfficiency: 88.5,
      procurementRiskIndex: "LOW",
      totalSpend: totalSpendRes._sum.totalAmount || 0,
      totalPurchaseOrders: totalPos,
      totalReceipts: totalGrns,
    };
  }
}
