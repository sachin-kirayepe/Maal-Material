import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getProfitabilityAnalytics(tenantId: string) {
    // Generate operational financial intelligence
    const revenues = await this.prisma.generalLedgerAccount.aggregate({
      where: { tenantId, chartOfAccount: { type: "REVENUE" } },
      _sum: { balance: true },
    });

    const expenses = await this.prisma.generalLedgerAccount.aggregate({
      where: { tenantId, chartOfAccount: { type: "EXPENSE" } },
      _sum: { balance: true },
    });

    const totalRevenue = revenues._sum.balance || 0;
    const totalExpense = expenses._sum.balance || 0;
    const netProfit = totalRevenue - totalExpense;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalExpense,
      netProfit,
      profitMargin,
      currency: "USD",
      calculatedAt: new Date(),
    };
  }

  async getCashFlowInsights(tenantId: string) {
    const assetAccounts = await this.prisma.generalLedgerAccount.findMany({
      where: { tenantId, chartOfAccount: { type: "ASSET" } },
      include: { chartOfAccount: true },
    });

    const cashEquivalent = assetAccounts
      .filter(
        (a) =>
          a.chartOfAccount.name.toLowerCase().includes("cash") ||
          a.chartOfAccount.name.toLowerCase().includes("bank"),
      )
      .reduce((sum, a) => sum + a.balance, 0);

    return {
      cashEquivalent,
      currency: "USD",
      calculatedAt: new Date(),
    };
  }
}
