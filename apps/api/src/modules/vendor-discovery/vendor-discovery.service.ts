import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class VendorDiscoveryService {
  constructor(private prisma: PrismaService) {}

  async getInsights(tenantId: string) {
    return this.prisma.regionalDemandInsight.findMany({
      where: { tenantId },
    });
  }
}
