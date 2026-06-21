import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates realtime overview metrics for the dashboard
   */
  async getDashboardOverview(tenantId?: string) {
    // These queries are fast aggregations
    const whereTenant = tenantId ? { tenantId } : {};

    // 1. Financial: Total project costings & invoice sums
    const [invoices, expenses] = await Promise.all([
      this.prisma.invoice.aggregate({
        _sum: { grandTotal: true },
        where: { status: "PAID" }, // Using PAID as a surrogate for confirmed revenue
      }),
      this.prisma.projectExpense.aggregate({
        _sum: { amount: true },
        where: { status: "APPROVED" },
      }),
    ]);

    // 2. Logistics: Deliveries completed vs pending
    const [completedDeliveries, pendingDeliveries] = await Promise.all([
      this.prisma.delivery.count({ where: { deliveryStatus: "DELIVERED", ...whereTenant } }),
      this.prisma.delivery.count({
        where: { deliveryStatus: { in: ["PENDING", "IN_TRANSIT"] }, ...whereTenant },
      }),
    ]);

    // 3. Stock Value estimation (requires join but can be approximated via products)
    // We will use a raw query if necessary, but for now we will query top 10 low stock
    const lowStockItems = await this.prisma.warehouseStock.findMany({
      where: { quantity: { lte: 10 } },
      include: {
        products: { select: { name: true, sku: true } },
        warehouses: { select: { name: true } },
      },
      take: 10,
    });

    return {
      revenue: invoices._sum.grandTotal || 0,
      expenses: expenses._sum.amount || 0,
      logistics: {
        completed: completedDeliveries,
        pending: pendingDeliveries,
      },
      alerts: {
        lowStockItems,
      },
    };
  }

  /**
   * Retrieves historical trends from AnalyticsSnapshots
   */
  async getTrends(module: string, days: number = 30, tenantId?: string) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const snapshots = await this.prisma.analyticsSnapshot.findMany({
      where: {
        module,
        snapshotDate: { gte: cutoff },
        ...(tenantId && { tenantId }),
      },
      orderBy: { snapshotDate: "asc" },
    });

    return snapshots;
  }
}
