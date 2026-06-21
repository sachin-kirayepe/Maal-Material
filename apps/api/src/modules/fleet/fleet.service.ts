import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class FleetService {
  constructor(private prisma: PrismaService) {}

  async getFleetOperations(tenantId: string) {
    return this.prisma.fleetOperation.findMany({
      where: { tenantId },
    });
  }

  async getAnalytics(tenantId: string) {
    return this.prisma.fleetAnalytics.findMany({
      where: { tenantId },
      orderBy: { recordedAt: "desc" },
      take: 20,
    });
  }
}
