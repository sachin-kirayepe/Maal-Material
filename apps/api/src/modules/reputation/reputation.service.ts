import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class ReputationService {
  private readonly logger = new Logger(ReputationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getReputationScores(tenantId: string) {
    this.logger.log(`Fetching reputation scores for ${tenantId}`);
    return this.prisma.reputationScore.findMany({
      where: { tenantId },
      orderBy: { deliveryConsistency: "desc" },
      take: 100,
    });
  }
}
