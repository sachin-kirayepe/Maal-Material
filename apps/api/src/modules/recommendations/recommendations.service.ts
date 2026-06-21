import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getRecommendations(tenantId: string, module?: string) {
    this.logger.log(`Fetching recommendations for ${tenantId}`);
    const whereClause: unknown = { tenantId, status: "PENDING" };
    if (module) {
      (whereClause as any).module = module;
    }
    return this.prisma.operationalRecommendation.findMany({
      where: undefined as any,
      orderBy: { impactScore: "desc" },
    });
  }

  async actionRecommendation(
    tenantId: string,
    recommendationId: string,
    actionTaken: string,
    userId: string,
    feedback?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const rec = await tx.operationalRecommendation.update({
        where: { id: recommendationId, tenantId },
        data: { status: actionTaken },
      });

      await tx.intelligenceAuditLog.create({
        data: {
          tenantId,
          recommendationId,
          userId,
          actionTaken,
          feedback,
        },
      });

      return rec;
    });
  }
}
