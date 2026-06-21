import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class SupplyChainService {
  constructor(private prisma: PrismaService) {}

  async getLogistics(tenantId: string) {
    return this.prisma.logisticsCoordination.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }
}
