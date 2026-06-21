import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class GatewayService {
  constructor(private prisma: PrismaService) {}

  async getPolicies(tenantId: string) {
    return this.prisma.gatewayPolicy.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async togglePolicy(tenantId: string, policyId: string, isActive: boolean) {
    return this.prisma.gatewayPolicy.updateMany({
      where: { id: policyId, tenantId },
      data: { isActive },
    });
  }
}
