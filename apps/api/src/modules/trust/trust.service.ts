import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class TrustService {
  private readonly logger = new Logger(TrustService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getTrustProfiles(tenantId: string) {
    this.logger.log(`Fetching trust profiles for ${tenantId}`);
    return this.prisma.trustProfile.findMany({
      where: { tenantId },
      orderBy: { trustScore: "desc" },
      take: 100,
    });
  }

  async getTrustMetrics(tenantId: string) {
    const totalProfiles = await this.prisma.trustProfile.count({ where: { tenantId } });
    const verifiedGst = await this.prisma.trustProfile.count({
      where: { tenantId, gstVerified: true },
    });

    return {
      totalProfiles,
      verifiedGst,
      networkTrustScore: 85, // Placeholder for ecosystem aggregate
      status: "HEALTHY",
    };
  }
}
