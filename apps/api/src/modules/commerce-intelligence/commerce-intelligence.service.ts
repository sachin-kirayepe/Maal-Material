import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class CommerceIntelligenceService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics() {
    const totalOrders = await this.prisma.commerceOrder.count();
    const totalRfqs = await this.prisma.rFQExchange.count();
    const totalVendors = await this.prisma.marketplaceVendor.count();

    // Aggregate order volume
    const orders = await this.prisma.commerceOrder.findMany();
    const gmv = orders.reduce((sum, order) => sum + order!.totalAmount, 0);

    return {
      totalOrders,
      totalRfqs,
      totalVendors,
      grossMerchandiseValue: gmv,
    };
  }
}
