import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class CommerceNetworkService {
  constructor(private prisma: PrismaService) {}

  async getNetworkGraph(tenantId: string) {
    const nodes = await this.prisma.commerceGraphNode.findMany({
      where: { tenantId },
    });

    const edges = await this.prisma.commerceRelationship.findMany({
      where: { tenantId },
    });

    return { nodes, edges };
  }
}
