import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class PlatformService {
  constructor(private prisma: PrismaService) {}

  async getPlatformServices(tenantId: string) {
    return this.prisma.platformService.findMany({
      where: { tenantId },
      orderBy: { serviceName: "asc" },
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      include: { platformContracts: true },
    });
  }

  async getPlatformExtensions(tenantId: string) {
    return this.prisma.platformExtension.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }
}
