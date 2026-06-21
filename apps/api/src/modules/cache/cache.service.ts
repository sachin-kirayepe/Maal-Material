import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class CacheService {
  constructor(private prisma: PrismaService) {}

  async getEntries(tenantId: string) {
    return this.prisma.cacheEntry.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async invalidateKey(tenantId: string, cacheKey: string) {
    return this.prisma.cacheEntry.updateMany({
      where: { cacheKey, tenantId },
      data: { invalidated: true },
    });
  }
}
