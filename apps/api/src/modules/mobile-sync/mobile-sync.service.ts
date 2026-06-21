import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class MobileSyncService {
  constructor(private prisma: PrismaService) {}

  async getSyncQueues(tenantId: string) {
    return this.prisma.offlineSyncQueue.findMany({
      where: { tenantId },
      orderBy: { serverTime: "desc" },
      take: 100,
    });
  }

  async getAuditLogs(tenantId: string) {
    return this.prisma.syncAuditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
}
