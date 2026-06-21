import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class InventorySharingService {
  constructor(private prisma: PrismaService) {}

  async getTransfers(tenantId: string) {
    return this.prisma.inventoryTransfer.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }
}
