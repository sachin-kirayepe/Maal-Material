import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class InfrastructureService {
  constructor(private prisma: PrismaService) {}

  async getNodes(tenantId: string) {
    return this.prisma.infrastructureNode.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getRegions(tenantId: string) {
    return this.prisma.regionConfig.findMany({
      where: { tenantId },
      orderBy: { regionName: "asc" },
    });
  }
}
