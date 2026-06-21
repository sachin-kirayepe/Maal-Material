import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class PredictionsService {
  private readonly logger = new Logger(PredictionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getInventoryPredictions(tenantId: string) {
    this.logger.log(`Fetching inventory predictions for ${tenantId}`);
    return this.prisma.inventoryPrediction.findMany({
      where: { tenantId },
      orderBy: { generatedAt: "desc" },
      take: 100,
    });
  }

  async getProcurementPredictions(tenantId: string) {
    return this.prisma.procurementPrediction.findMany({
      where: { tenantId },
      orderBy: { generatedAt: "desc" },
      take: 100,
    });
  }

  async getCommerceForecasts(tenantId: string) {
    return this.prisma.commerceForecast.findMany({
      where: { tenantId },
      orderBy: { generatedAt: "desc" },
      take: 100,
    });
  }
}
