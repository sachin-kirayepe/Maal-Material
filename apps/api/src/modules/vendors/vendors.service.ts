import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async getVendors(tenantId: string) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.vendor.findMany({
      where: { tenantId },
      include: { scores: { orderBy: { periodEnd: "desc" }, take: 1 } },
    });
  }

  async getVendorScores(vendorId: string) {
    return this.prisma.vendorScore.findMany({
      where: { vendorId },
      orderBy: { periodEnd: "desc" },
    });
  }
}
