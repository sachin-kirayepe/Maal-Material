import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";

@Injectable()
export class MonitoringService {
  constructor(private prisma: PrismaService) {}

  async getMetrics(tenantId: string) {
    return this.prisma.infrastructureMetric.findMany({
      where: { tenantId },
      orderBy: { timestamp: "desc" },
      take: 100,
    });
  }

  async getNodes(tenantId: string) {
    return this.prisma.clusterNode.findMany({
      where: { tenantId },
      orderBy: { region: "asc" },
    });
  }
}
