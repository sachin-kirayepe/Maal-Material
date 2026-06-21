import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class OfflineEngineService {
  constructor(private prisma: PrismaService) {}

  async getConflicts(tenantId: string) {
    return this.prisma.syncConflict.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      include: {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        offlineQueues: true,
      },
    });
  }

  async resolveConflict(
    tenantId: string,
    conflictId: string,
    resolutionMethod: string,
    userId: string,
  ) {
    return this.prisma.syncConflict.update({
      where: { id: conflictId, tenantId },
      data: {
        status: "RESOLVED",
        resolutionMethod,
        resolvedBy: userId,
        resolvedAt: new Date(),
      },
    });
  }
}
